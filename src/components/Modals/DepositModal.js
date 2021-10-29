import React, { useContext, useEffect, useState } from 'react'
import { Container, Button, Modal, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import styles from './TxnModal.module.scss'
import { FaCheckCircle } from 'react-icons/fa'
import CoreMethod from '../../methods/CoreMethod'
import { useTranslation } from 'react-i18next'
import CoreData from '../../methods/CoreData'
import BigNumber from 'bignumber.js'
import log from '../../utils/logger'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import FetchData from '../../methods/FetchData'
import { sleep } from '../../utils/promise'
import LoadingIcon from '../../images/loading.svg'

function DepositModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)

    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('')
    const [lowBalance, setLowBalance] = useState(false)
    const [negativeNum, setNegativeNum] = useState(false)
    const [loading, setLoading] = useState(false)
    const [depositCompleted, setDepositCompleted] = useState(false)
    const [depositFailed, setDepositFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')
    const [needsFurtherApproval, setNeedsFurtherApproval] = useState(false)
    const [allowanceFormatted, setAllowanceFormatted] = useState('')
    const [firstApproval, setFirstApproval] = useState(true)

    const validateInput = async (value) => {
        setInputValue(value)
        if ((value !== '' && Number(value) <= 0) || value.includes('e')) {
            setLowBalance(false)
            setNegativeNum(true)
            return
        }
        setNegativeNum(false)
       
        const isLowBalance = CoreData.isNativeToken(props.data.symbol, networkType) 
                                ? new BigNumber(props.data.walletBalanceFormatted).minus(0.1).lte(new BigNumber(value)) 
                                : new BigNumber(props.data.walletBalanceFormatted).lte(new BigNumber(value))
        setLowBalance(isLowBalance)
    }

    const resetErrorTips = () => {
        setLowBalance(false)
        setNegativeNum(false)
    }

    const handleClose = async () => {
        console.log("closing")
        setInputValue('')
        setLowBalance(false)
        setNegativeNum(false)
        setLoading(false)
        setDepositCompleted(false)
        setDepositFailed(false)
        setTxnHash('')
        setNeedsFurtherApproval(false)
        setFirstApproval(true)
        props.handleClose('deposit')
    }

    const getRawValue = async (value) => {
        return CoreData.getRawValue(web3, networkType, props.data.symbol, value)
    }

    const verifyFurtherApproval = async (txnValue) => {
        if (CoreData.isNativeToken(props.data.symbol, networkType)) return Promise.resolve(true)

        const { allowance, allowanceFormatted } = await FetchData.getAccountAllowance(web3, connectedAddress, networkType, props.data)
        if (allowance && allowance < Number(txnValue)) {
            setNeedsFurtherApproval(true)
            setAllowanceFormatted(allowanceFormatted)
            return Promise.resolve(false)
        }

        setNeedsFurtherApproval(false)
        setAllowanceFormatted('')
        return Promise.resolve(true)
    }

    const handleDeposit = async () => {
        const gtagParams = await {
            url: window.location.href,
            symbol: props.data.symbol,
        }
        setFirstApproval(true)
        setLoading(true)

        const txnValue = await getRawValue(inputValue)
        const isValidAllowance = await verifyFurtherApproval(txnValue)
        if (!isValidAllowance) {
            setLoading(false)
            return
        }

        const [qContract, gasInfo] = await Promise.all([
            CoreData.getQTokenContract(web3, networkType, props.data.symbol),
            CoreData.getGasInfo(web3)
        ])

        if (CoreData.isNativeToken(props.data.symbol, networkType)) {
            await qContract.methods.mint().send({
                from: connectedAddress,
                gasLimit: web3.utils.toHex(gasInfo.gasLimit),      // posted at compound.finance/developers#gas-costs
                gasPrice: web3.utils.toHex(gasInfo.gasPrice), // use ethgasstation.info (mainnet only)
                value: web3.utils.toHex(txnValue)
            })
                .on('transactionHash', function (hash) {
                    log.info(hash)
                    props.data.depositTxnHash = hash
                    setTxnHash(hash) // we use this only for the modal's state
                })
                .then(response => {
                    log.info(response)
                    if (response.events.Failure) {
                        setDepositFailed(true)
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'response event fail'
                        })
                    } else {
                        window.gtag('event', 'deposit', gtagParams)
                        setDepositCompleted(true)
                    }
                    props.data.depositTxnHash = null
                    setLoading(false)
                })
                .catch(error => {
                    if (error.code === 4001) {
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'user rejected'
                        })
                        handleClose()
                    } else {
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'other error'
                        })
                        setDepositFailed(true)
                        props.data.depositTxnHash = null
                    }
                })
        } else {
            await qContract.methods.mint(web3.utils.toBN(txnValue)).send({
                from: connectedAddress,
                gasLimit: web3.utils.toHex(gasInfo.gasLimit),      // posted at compound.finance/developers#gas-costs
                gasPrice: web3.utils.toHex(gasInfo.gasPrice) // use ethgasstation.info (mainnet only)
            })
                .on('transactionHash', function (hash) {
                    log.info(hash)
                    props.data.depositTxnHash = hash
                    setTxnHash(hash) // we use this only for the modal's state
                })
                .then(response => {
                    log.info(response)
                    if (response.events.Failure) {
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'response event fail'
                        })
                        setDepositFailed(true)
                    } else {
                        window.gtag('event', 'deposit', gtagParams)
                        setDepositCompleted(true)
                    }
                    props.data.depositTxnHash = null
                    setLoading(false)
                })
                .catch(error => {
                    if (error.code === 4001) {                
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'user rejected'
                        })
                        handleClose()
                    } else {
                        window.gtag('event', 'deposit', {
                            ...gtagParams,
                            error: 'other error'
                        })
                        setDepositFailed(true)
                        props.data.depositTxnHash = null
                    }
                })
        }
    }

    const handleApprove = async (first = true) => {
        setLoading(true)
        await CoreMethod.approveERC20(web3, connectedAddress, networkType, props.data)
            .then(async response => {
                if (response) {
                    if (first) {
                        setFirstApproval(false)
                    } else {
                        const txnValue = await getRawValue(inputValue)
                        await sleep()
                        const isValidAllowance = await verifyFurtherApproval(txnValue)
                        isValidAllowance && setFirstApproval(false)
                    }
                }
                setLoading(false)
            })
            .catch(error => {
                if (error.code === 4001) {
                    handleClose()
                }
            })
    }

    const changeInputValue = (value) => {
        resetErrorTips()

        if(CoreData.isNativeToken(props.data.symbol, networkType)) {
            const calcValue = new BigNumber(props.data.walletBalanceFormatted).minus(0.1).multipliedBy(value)
            if (calcValue.isNegative()) {
                setInputValue('0')
                return
            }
            setInputValue(calcValue.toString())
        } else {
            setInputValue(new BigNumber(props.data.walletBalanceFormatted).multipliedBy(value).toString())
        }
    }

    const availableWalletBalance = () => {
        if (CoreData.isNativeToken(props.data.symbol, networkType)) {
            const value = BigNumber(props.data.walletBalanceFormatted).minus(0.1)
            return value.isNegative() ? '0' : value.toFixed(4)
        } else {
            return BigNumber(props.data.walletBalanceFormatted).toFixed(4)
        }
    }

    const DepositButton =
        (negativeNum || lowBalance || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) ?
            <Button variant="secondary" disabled>{t('Common.Deposit')}</Button> :
            <Button variant="secondary" onClick={handleDeposit}>{t('Common.Deposit')}</Button>

    const WalletBalanceInfo = 
        <div className={styles.walletInfo}>
            <div className={styles.label}>{t('Common.AvailableWalletBalance')}</div>
            <div className={styles.value}>
                {`${availableWalletBalance()} ${props.data.symbol}`}
            </div>
        </div>

    const ApproveRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('DepositModal.DepositToSavingsAccount')}</div>
                <div className={styles.description}>{t('Common.ApprovalMsg')}</div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(true)}>{t('Common.Approve')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const ApproveFurtherRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('DepositModal.DepositToSavingsAccount')}</div>
                <div className={styles.description}>{t('Common.FurtherApprovalMsg', { type: t('Common.SavingsBalance'), inputValue, allowanceFormatted })}</div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(false)}>{t('Common.FurtherApprove')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const LoadingMessage = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('DepositModal.CheckYourWallet')}</div>
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
                    <div className={styles.text}>{t('DepositModal.InProgress')}</div>
                </div>
            </div>
        </div>

    const DepositForm = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('DepositModal.DepositToSavingsAccount')}</div>
                <div className={styles.description}>Enter the amount to be deposited to your savings account</div>
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
                            <ToggleButton variant="outline-darkgrey" value={1} className="default-value-btn" >100%</ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>
                </Form>
                {
                    negativeNum && <div className={styles.txnError}>{t('Common.InvalidDepositAmount')}</div>
                }
                {lowBalance ? <div className={styles.txnError}>{t('Common.InsufficientBalance')}</div> : ''}
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    {DepositButton}
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>
    
    const TxnSuccessMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>{t('DepositModal.SuccessMsg')}</div>
                    <a href={CoreData.getExplorerUrl(txnHash, networkType)} target="_blank">{t('Common.ViewTxnOnExplorer')}</a>
                </div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const TxnErrorMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>{t('DepositModal.ErrorMsg')}</div>
                    <a href={CoreData.getExplorerUrl(txnHash, networkType)} target="_blank">{t('Common.ViewTxnOnExplorer')}</a>
                </div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const needsApproval = props.data && !(props.data.approved) && firstApproval
    const Loaded = needsApproval ?  ApproveRequest : DepositForm
    const Rendered = loading ? LoadingMessage : needsFurtherApproval ? ApproveFurtherRequest : Loaded

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
                    depositCompleted ? TxnSuccessMsg :
                    depositFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default DepositModal