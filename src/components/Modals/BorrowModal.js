import React, { useContext, useEffect, useState } from 'react'
import { Container, Button, Modal, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import CoreData from '../../methods/CoreData'
import BigNumber from 'bignumber.js'
import log from '../../utils/logger'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import LoadingIcon from '../../images/loading.svg'
import { FaCheckCircle } from 'react-icons/fa'
import { IoInformationCircleSharp } from 'react-icons/io5'
import styles from './TxnModal.module.scss'

function BorrowModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)

    const { t } = useTranslation()
    const [inputValue, setInputValue] = useState('')
    const [invalidInput, setInvalidInput] = useState(false)
    const [borrowBtnDisabled, setBorrowBtnDisabled] = useState(false)
    const [borrowCheck, setBorrowCheck] = useState(false)
    const [loading, setLoading] = useState(false)
    const [borrowCompleted, setBorrowCompleted] = useState(false)
    const [borrowFailed, setBorrowFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')

    let updatedLoanBalance = props.totalLoanBalance + (CoreData.fixedNaN(inputValue) * props.data.price)
    const loanUsedPercent = (updatedLoanBalance / props.totalBorrowLimitFiat) * 100
    let loanUsedPercentFixed2 = loanUsedPercent.toFixed(2)
    if (loanUsedPercentFixed2 === "NaN" || loanUsedPercentFixed2 === "Infinity") {
        loanUsedPercentFixed2 = "0"
    }

    const getValue = (percent = 1) => {
        const borrowSafeMaxTotal = (props.totalBorrowLimitFiat / props.data.price) * percent
        const alreayBorrowAmount = props.totalLoanBalance / props.data.price
        let accountLiquidity = alreayBorrowAmount >= borrowSafeMaxTotal ? 0 : borrowSafeMaxTotal - alreayBorrowAmount
        let marketLiquidity = props.data.liquidityFormatted
        let borrowSafeMax = accountLiquidity > marketLiquidity ? marketLiquidity : accountLiquidity
        borrowSafeMax = CoreData.fixedNaN(borrowSafeMax)

        return borrowSafeMax
    }

    const borrowLimit = 90
    const borrowMaxTotal = getValue(borrowLimit * 0.01)
    const borrowAbove85 = getValue(0.85)

    const validateInput = async (value) => {
        let newValue = new BigNumber(value)

        if (newValue.isNegative()) {
            newValue = newValue.absoluteValue()
            setInputValue(newValue.toString())
            setInvalidInput(false)
        } else {
            setInputValue(value)
            const IS_NUMERIC = /^(\d+(\.\d+)?)?$/
            const isNumeric = (str) => IS_NUMERIC.test(str)
            setInvalidInput(!isNumeric(value))
        }

        const inputV = Number(value)

        if (inputV < borrowAbove85) {
            // <85%
            setBorrowBtnDisabled(false)
        } else if (inputV > borrowAbove85 && inputV <= borrowMaxTotal) {
            // >85% && <100
            setBorrowBtnDisabled(!borrowCheck)
        } else {
            // >100%
            setBorrowBtnDisabled(true)
        }
    }

    useEffect(() => {
        setBorrowBtnDisabled(!borrowCheck)
    }, [borrowCheck])

    const handleClose = async () => {
        setInputValue('')
        setInvalidInput(false)
        setBorrowBtnDisabled(false)
        setLoading(false)
        setBorrowCompleted(false)
        setBorrowFailed(false)
        setBorrowCheck(false)
        setTxnHash('')
        props.handleClose('borrow')
    }

    const handleBorrow = async () => {
        const gtagParams = {
            url: window.location.href,
            symbol: props.data.symbol,
        }
        setLoading(true)

        const contract = await CoreData.getQTokenContract(web3, networkType, props.data.symbol)
        if (!contract) {
            setBorrowFailed(true)
            props.data.borrowTxnHash = null
            return setLoading(false)
        }

        const gasInfo = await CoreData.getGasInfo(web3)

        const txnValue = await CoreData.getRawValue(web3, networkType, props.data.symbol, inputValue)

        let estimatedGas = await contract.methods.borrow(web3.utils.toBN(txnValue)).estimateGas()
        estimatedGas = estimatedGas * 5
        if (estimatedGas < gasInfo.gasLimit) estimatedGas = gasInfo.gasLimit

        await contract.methods.borrow(web3.utils.toBN(txnValue)).send({
            from: connectedAddress,
            gasLimit: estimatedGas,      // posted at compound.finance/developers#gas-costs
            gasPrice: web3.utils.toHex(gasInfo.gasPrice), // use ethgasstation.info (mainnet only)
        })
            .on('transactionHash', function (hash) {
                log.info(hash)
                props.data.borrowTxnHash = hash
                setTxnHash(hash) // we use this only for the modal's state
            })
            .then(response => {
                log.info(response)
                if (response.events.Failure) {
                    window.gtag('event', 'borrow', {
                        ...gtagParams,
                        error: 'response event fail'
                    })
                    setBorrowFailed(true)
                } else {
                    window.gtag('event', 'borrow', gtagParams)
                    if (props.callback) {
                        props.callback(web3.utils.toBN(txnValue))
                        handleClose()
                    } else {
                        setBorrowCompleted(true)
                    }
                }
                props.data.borrowTxnHash = null
                setLoading(false)
            })
            .catch(error => {
                log.error(error)
                if (error.code === 4001) {
                    window.gtag('event', 'borrow', {
                        ...gtagParams,
                        error: 'user rejected'
                    })
                    handleClose()
                } else {
                    window.gtag('event', 'borrow', {
                        ...gtagParams,
                        error: 'other error'
                    })
                    setBorrowFailed(true)
                    props.data.borrowTxnHash = null
                }
            })
    }

    const changeInputValue = (value) => {
        const inputValue = new BigNumber(borrowMaxTotal).multipliedBy(value).toString(10)
        setInputValue(inputValue)
        validateInput(inputValue)
    }

    //UI Rendering

    const BorrowButton =
        (invalidInput || borrowBtnDisabled || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) ?
            <Button variant="secondary" disabled>{t('Common.Borrow')}</Button> :
            <Button variant="secondary" onClick={handleBorrow}>{t('Common.Borrow')}</Button>

    const LoanPercentageUsed = 
        <div className={styles.walletInfo}>
            <div className={styles.label}>{t('BorrowModal.LoanPercentageUsed')}</div>
            <div className={styles.value}>
                {loanUsedPercentFixed2} %
            </div>
        </div>

    const LoadingMessage = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('BorrowModal.CheckYourWallet')}</div>
                <div className={styles.description}>Please approve the transaction from your wallet provider</div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    <img
                        src={LoadingIcon}
                        width="auto"
                        height="18"
                        className="d-inline-block align-top"
                        alt="loading"
                        />
                    <div className={styles.text}>{t('BorrowModal.InProgress')}</div>
                </div>
            </div>
        </div>

    const CannotBorrowMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <IoInformationCircleSharp />
                    <div className={styles.text}>{t('BorrowModal.CannotBorrowMsgTitle')}</div>
                </div>
                <div className={styles.subText}>{t('BorrowModal.CannotBorrowMsgDesc')}</div>
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose('deposit')}>Close</Button>
                </div>
            </div>
        </div>

    const BorrowForm = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.BorrowAssets')}</div>
                <div className={styles.description}>{t('BorrowModal.Info')}</div>
                <Form >
                    <Form.Group controlId="formDeposit" className={styles.inputContainer}>
                        <Form.Control
                            className={styles.txnValue}
                            type="number"
                            placeholder={"0.00 " + props.data.symbol}
                            autoComplete="off"
                            value={inputValue}
                            onChange={e => validateInput(e.target.value)} />
                        <ToggleButtonGroup name="default-value-list" type="radio" className="default-value-btn-list" onChange={changeInputValue}>
                            <ToggleButton variant="outline-darkgrey" value={0.25} className="default-value-btn">25%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={0.5} className="default-value-btn">50%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={0.75} className="default-value-btn">75%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={borrowLimit * 0.01} className="default-value-btn" >{borrowLimit}%</ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>
                </Form>
                {invalidInput ? (
                    <div className={styles.txnError}>
                        {t('BorrowModal.InvalidInput')}
                    </div>
                ) : Number(loanUsedPercentFixed2) > borrowLimit ? (
                    <div className={styles.txnError}>
                        {t('BorrowModal.ExceedsBorrowLimit')}
                    </div>
                ) : (
                    ''
                )}
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    {BorrowButton}
                    <Button variant="outline-black" onClick={() => handleClose('deposit')}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>
    
    const TxnSuccessMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>{t('BorrowModal.SuccessMsg')}</div>
                    <a href={CoreData.getExplorerUrl(txnHash, networkType)} target="_blank">{t('Common.ViewTxnOnExplorer')}</a>
                </div>
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose('deposit')}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const TxnErrorMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>{t('BorrowModal.ErrorMsg')}</div>
                    <a href={CoreData.getExplorerUrl(txnHash, networkType)} target="_blank">{t('Common.ViewTxnOnExplorer')}</a>
                </div>
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose('deposit')}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const Rendered = Number(props.data.totalBorrowLimitFiat) === 0 ? CannotBorrowMsg
        : loading ? LoadingMessage : BorrowForm

    return (
        <Modal
            show={props.show}
            onHide={handleClose}
            aria-labelledby="example-custom-modal-styling-title"
            dialogClassName={styles.txnModal}
            animation={true}>
            <Container className={styles.txnModalContainer}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>
                        <img
                            src={props.data.logo}
                            width="auto"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Logo"
                            />
                        <div className={styles.text}>{props.data.name}</div>
                    </div>
                    <div className={styles.closeButton} style={{ 'cursor': 'pointer' }} onClick={() => handleClose()}>x</div>
                </div>
                {
                    borrowCompleted ? TxnSuccessMsg : borrowFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default BorrowModal