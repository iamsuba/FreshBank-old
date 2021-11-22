
import React, { useContext, useState } from 'react'
import { Container, Button, Modal, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import LoadingIcon from '../../images/loading.svg'
import { FaCheckCircle } from 'react-icons/fa'
import { IoInformationCircleSharp } from 'react-icons/io5'
import styles from './TxnModal.module.scss'
import CoreMethod from '../../methods/CoreMethod'
import CoreData from '../../methods/CoreData'
import BigNumber from 'bignumber.js'
import log from '../../utils/logger'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import FetchData from '../../methods/FetchData'
import { sleep } from '../../utils/promise'

function RepayModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)
    
    const { t } = useTranslation()
    const [inputValue, setInputValue] = useState('')
    const [invalidInput, setInvalidInput] = useState(false)
    const [overPay, setOverPay] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lowBalance, setLowBalance] = useState(false)
    const [repayCompleted, setRepayCompleted] = useState(false)
    const [repayFailed, setRepayFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')
    const [needsFurtherApproval, setNeedsFurtherApproval] = useState(false)
    const [allowanceFormatted, setAllowanceFormatted] = useState('')
    const [isMax, setIsMax] = useState(false)
    const [firstApproval, setFirstApproval] = useState(true)

    const validateInput = async (value) => {
        setIsMax(false)
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

        const txnValue = await getRawValue(
            CoreData.fixedNaN(newValue)
        )
        if (parseFloat(props.data.loanBalance) < parseFloat(txnValue)) {
            setOverPay(true)
        } else {
            setOverPay(false)
        }

        if (parseFloat(props.data.walletBalance) < parseFloat(txnValue)) {
            setLowBalance(true)
        } else {
            setLowBalance(false)
        }
    }

    const getRawValue = async (value) => {
        return CoreData.getRawValue(web3, networkType, props.data.symbol, value)
    }

    const handleClose = async () => {
        setInputValue('')
        setInvalidInput(false)
        setOverPay(false)
        setLoading(false)
        setLowBalance(false)
        setRepayCompleted(false)
        setRepayFailed(false)
        setTxnHash('')
        setNeedsFurtherApproval(false)
        setIsMax(false)
        setFirstApproval(true)
        props.handleClose('repay')
    }

    const verifyFurtherApproval = async (txnValue) => {
        if (!CoreData.isNativeToken(props.data.symbol, networkType)) {
            const { allowance, allowanceFormatted } = await FetchData.getAccountAllowance(web3, connectedAddress, networkType, props.data)
            if (allowance && allowance < Number(txnValue)) {
                setNeedsFurtherApproval(true)
                setAllowanceFormatted(allowanceFormatted)
                return Promise.resolve(false)
            }
    
        }

        setNeedsFurtherApproval(false)
        setAllowanceFormatted('')
        return Promise.resolve(true)
    }

    const setMaximum = async (fullPayOnly) => {
        let loanRepayAmount = props.data.loanBalanceFormatted;
        if (BigNumber(props.data.walletBalance).gte(BigNumber(props.data.loanBalance))) {
            // max all
            setIsMax(true)
        } else {
            // max part
            setIsMax(false)
            loanRepayAmount = props.data.walletBalanceFormatted;
        }

        setInputValue(loanRepayAmount.toString())
        return loanRepayAmount.toString();
    }



    const handleRepay = async () => {
        const gtagParams = {
            url: window.location.href,
            symbol: props.data.symbol,
        }
        setFirstApproval(true)

        if(lowBalance || overPay || invalidInput) return;

        setLoading(true)
        let repayAmount = isMax ? new BigNumber(2).pow(256).minus(1).toString(10) : await getRawValue(inputValue);

        const isValidAllowance = await verifyFurtherApproval(repayAmount)
        if (!isValidAllowance) {
            setLoading(false)
            return
        }

        const contract = await CoreData.getQTokenContract(web3, networkType, props.data.symbol)
        const gasInfo = await CoreData.getGasInfo(web3)
        const isNativeToken = CoreData.isNativeToken(props.data.symbol, networkType)
        let repayBorrow
        
        if (isNativeToken) {
            if (isMax) {
                repayAmount = BigNumber(props.data.loanBalance).multipliedBy(1.00001).plus(1).toFixed(0)
                const maximillionContract = await CoreData.getMaximillion(web3, networkType)
                repayBorrow = await maximillionContract.methods.repayBehalf(connectedAddress)
            } else {
                repayBorrow = await contract.methods.repayBorrow()
            }
        } else {
            repayBorrow = await contract.methods.repayBorrow(web3.utils.toBN(repayAmount))
        }

        let sendParams = {
            from: connectedAddress,
            gasLimit: web3.utils.toHex(gasInfo.gasLimit),     
            gasPrice: web3.utils.toHex(gasInfo.gasPrice),
        }

        isNativeToken && (sendParams.value = repayAmount)


        repayBorrow.send(sendParams).on('transactionHash', function (hash) {
            setTxnHash(hash)
        })
        .then(response => {
            if (response.events.Failure) {
                window.gtag('event', 'repay', {
                    ...gtagParams,
                    error: 'response event fail'
                })
                setRepayFailed(true)
            } else {
                window.gtag('event', 'repay', gtagParams)
                setRepayCompleted(true)
            }
            setLoading(false)
        })
        .catch(error => {
            if (error.code === 4001) {
                window.gtag('event', 'repay', {
                    ...gtagParams,
                    error: 'user rejected'
                })
                handleClose()
            } else {
                window.gtag('event', 'repay', {
                    ...gtagParams,
                    error: 'other error'
                })
                setRepayFailed(true)
            }
        })
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

    const availableWalletBalance = () => {
        if (CoreData.isNativeToken(props.data.symbol, networkType)) {
            const value = BigNumber(props.data.walletBalanceFormatted).minus(0.1)
            return value.isNegative() ? '0' : value.toFixed(4)
        } else {
            return BigNumber(props.data.walletBalanceFormatted).toFixed(4)
        }
    }

    //UI Rendering

    const RepayButton =
        (invalidInput || overPay || lowBalance || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) ?
            <Button variant="primary" disabled>{t('Common.Repay')}</Button> :
            <Button variant="primary" onClick={() => handleRepay()}>{t('Common.Repay')}</Button>

    const WalletBalanceInfo = 
        <div className={styles.walletInfo}>
            <div className={styles.label}>{t('Common.AvailableWalletBalance')}</div>
            <div className={styles.value}>
                {`${availableWalletBalance()} ${props.data.symbol}`}
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
                    <Button variant="outline-black" onClick={() => handleClose()}>Cancel</Button>
                </div>
            </div>
        </div>

    const ApproveFurtherRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('DepositModal.DepositToSavingsAccount')}</div>
                <div className={styles.description}>{t('Common.FurtherApprovalMsg', { type: t('Common.RepayAmount'), inputValue, allowanceFormatted })}</div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(false)}>{t('Common.FurtherApprove')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>Cancel</Button>
                </div>
            </div>
        </div>

    const RepayForm = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.BorrowAssets')}</div>
                <div className={styles.description}>{t('RepayModal.LoanAmountDue')} <span className={styles.value}>{parseFloat(props.data.loanBalanceFormatted).toFixed(2) + ' ' + props.data.symbol}</span> <span className={styles.subValue}>({parseFloat(props.data.loanBalanceFormatted) + ' ' + props.data.symbol})</span></div>
                <Form >
                    <Form.Group controlId="formDeposit" className={styles.inputContainer}>
                        <Form.Control
                            className={styles.txnValue}
                            type="number"
                            placeholder={"0.00 " + props.data.symbol}
                            autoComplete="off"
                            value={inputValue}
                            onChange={e => validateInput(e.target.value)} />
                        <Button variant="outline-darkgrey" onClick={() => setMaximum(false)}>{t('Common.Maximum')}</Button>
                    </Form.Group>
                </Form>
                {invalidInput ? (
                    <div className={styles.txnError}>{t('RepayModal.InvalidInput')}</div>
                ) : overPay ? (
                    <div className={styles.txnError}>{t('RepayModal.OverPayError')}</div>
                ) : lowBalance ? (
                    <div className={styles.txnError}>{t('RepayModal.LowBalanceError')}</div>
                ) : ''}
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    {RepayButton}
                    <Button variant="outline-black" onClick={() => handleClose()}>Cancel</Button>
                </div>
            </div>
        </div>

    const TxnSuccessMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>{t('RepayModal.SuccessMsg')}</div>
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
                    <div className={styles.text}>{t('RepayModal.ErrorMsg')}</div>
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
    const Loaded = needsApproval ? ApproveRequest : RepayForm
    const Rendered = loading ? LoadingMessage : needsFurtherApproval ? ApproveFurtherRequest : Loaded

    return (
        <Modal
            show={props.show}
            onHide={() => handleClose()}
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
                    repayCompleted ? TxnSuccessMsg : repayFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default RepayModal