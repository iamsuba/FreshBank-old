
import React, {useContext, useState, useEffect} from 'react'
import { Container, Button, Modal, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import CoreData from '../../methods/CoreData'
import log from '../../utils/logger'
import BigNumber from 'bignumber.js'
import  { formatDecimalNumber } from '../../utils/numberFormat';
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import LoadingIcon from '../../images/loading.svg'
import { FaCheckCircle } from 'react-icons/fa'
import { IoInformationCircleSharp } from 'react-icons/io5'
import styles from './TxnModal.module.scss'

function WithdrawModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)

    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [withdrawSafeMax, setWithdrawSafeMax] = useState(true)
    const [withdrawBtnDisabled, setWithdrawBtnDisabled] = useState(false)
    const [withdrawCheck, setWithdrawCheck] = useState(false)
    const [withdrawCompleted, setWithdrawCompleted] = useState(false)
    const [withdrawFailed, setWithdrawFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')

    const savingsBalanceFormatted = new BigNumber(props.data.savingsBalanceFormatted) // 存款金额
    const savingsBalanceFiat = new BigNumber(props.data.savingsBalanceFiat)
    const totalLoanBalance = new BigNumber(props.totalLoanBalance);
    const totalBorrowLimitFiat = new BigNumber(props.totalBorrowLimitFiat)
    /**
     * 计算方法：
     * 用户存入 100 刀，抵押率90%，得到 90 刀贷款额度，借出 50 刀，贷款使用率为 50/90=55%
     * 这时用户最大取款额度 100-(50/0.9) = 44.4 刀，但如果用户取出 44.4 刀，贷款使用率会变成 50/((100-44.4) * 90%) = 100%，立刻就会面临清算风险
     * 为了降低清算风险，我们需要得到一个最大安全值 x，使得 50/((100-x) * 90%) = 85%，当x过高时给出警告
     * 50/((100-x) * 0.9) = 0.85   ===> x = 100 - (50 / 0.85 / 0.9)
     * 100 ---> props.data.savingsBalanceFormatted 存款金额
     * 50 ---> props.totalLoanBalance  贷款金额
     * 0.9 ---> props.data.collateralFactor 抵押率
     */

    const getAmount = (percent = 1) => {
        let otherLoanBalance = totalBorrowLimitFiat.minus(savingsBalanceFiat.multipliedBy(props.data.collateralFactor))
        let amount = savingsBalanceFiat.minus(totalLoanBalance.div(percent).minus(otherLoanBalance).div(props.data.collateralFactor))
        amount = amount.div(props.data.price)
        if(amount.lt(0)){
            amount = new BigNumber(0)
        }
        if (savingsBalanceFormatted.lt(amount) || totalLoanBalance.eq(0) || props.data.isAssetMember === false) {
            // 存款金额<提取安全最大值 || 贷款金额为0 || 资产成员为false
            amount = savingsBalanceFormatted;
        }
        return amount
    }
    const borrowLimit = 90
    const withdrawMaxTotal = getAmount(borrowLimit * 0.01)
    const withdrawAbove85 = getAmount(0.85)

    const getPercent = (value = inputValue) => {
        const inputV = Number(value)

        if (inputV < 0) return;

        let otherLoanBalance = totalBorrowLimitFiat.minus(savingsBalanceFiat.multipliedBy(props.data.collateralFactor))
        let changedLoanBalance = (savingsBalanceFiat.minus(inputV * props.data.price)).times(props.data.collateralFactor);
        let temp = otherLoanBalance.plus(changedLoanBalance)
        if (inputV == 0 || withdrawMaxTotal.isEqualTo(savingsBalanceFormatted)) {
            temp = totalBorrowLimitFiat;
        }

        let loanUsedPercent = totalLoanBalance.div(temp).times(100)

        if (loanUsedPercent < 0) {
            loanUsedPercent = 100
        }

        let loanUsedPercentFixed2 = loanUsedPercent.toString(10)

        if (!new BigNumber(loanUsedPercentFixed2).isFinite()) {
            loanUsedPercentFixed2 = '0'
        }

        return loanUsedPercentFixed2
    }


    const loanUsedPercentFixed2 = Number(getPercent())
    const validateInput = async(value) => {
        setInputValue(value)
        const inputV = new BigNumber(value)
        if (inputV.isLessThan(withdrawAbove85) || withdrawMaxTotal.isEqualTo(savingsBalanceFormatted)) {
            // <85%
            setWithdrawBtnDisabled(false)
        } else if (inputV.isGreaterThan(withdrawAbove85) && inputV.isLessThanOrEqualTo(withdrawMaxTotal)) {
            // >85% && <100
            setWithdrawBtnDisabled(!withdrawCheck)
        } else {
            // >100%
            setWithdrawBtnDisabled(true)
        }
    }

    useEffect(()=> {
        setWithdrawBtnDisabled(!withdrawCheck)
    }, [withdrawCheck])


    const getRawValue = async(value) => {
        return CoreData.getRawValue(web3, networkType, props.data.symbol, value)
    }

    const handleClose = async() => {
        setInputValue('')
        setLoading(false)
        setWithdrawSafeMax(true)
        setWithdrawCheck(false)
        setWithdrawBtnDisabled(false)
        setWithdrawCompleted(false)
        setWithdrawFailed(false)
        setTxnHash('')
        props.handleClose('withdraw')
    }

    const handleWithdraw = async(max) => {
        const gtagParams = {
            url: window.location.href,
            symbol: props.data.symbol,
        }
        setLoading(true)
        const withdrawAmount = max ? withdrawAbove85 : inputValue
        const contract = await CoreData.getQTokenContract(web3, networkType, props.data.symbol)
        const gasInfo = await CoreData.getGasInfo(web3)
        let rawWithdrawAmount
        let redeemFunction = contract.methods.redeemUnderlying
        if (`${withdrawAmount}` === savingsBalanceFormatted.toString(10)) {
            rawWithdrawAmount = props.data.savingsCTokenBalance
            redeemFunction = contract.methods.redeem
        } else {
            rawWithdrawAmount = await getRawValue(withdrawAmount)
        }
        await redeemFunction(web3.utils.toBN(rawWithdrawAmount)).send({
            from: connectedAddress,
            gasLimit: props.data.isLPToken ? gasInfo.gasLimit * 2 : gasInfo.gasLimit,    
            gasPrice: web3.utils.toHex(gasInfo.gasPrice)
        })
        .on('transactionHash', function(hash) {
            log.info(hash)
            props.data.withdrawTxnHash = hash
            setTxnHash(hash) // we use this only for the modal's state
        })
        .then(response => {
            log.info(response)
            if(response.events.Failure) {
                window.gtag('event', 'withdraw', {
                    ...gtagParams,
                    error: 'response event fail'
                })
                setWithdrawFailed(true)
            } else {
                window.gtag('event', 'withdraw', gtagParams)
                setWithdrawCompleted(true)
            }
            props.data.withdrawTxnHash = null
            setLoading(false)
        })
        .catch(error => {
            log.error(error)
            if(error.code === 4001) {
                window.gtag('event', 'withdraw', {
                    ...gtagParams,
                    error: 'user rejected'
                })
                handleClose()
            } else {
                window.gtag('event', 'withdraw', {
                    ...gtagParams,
                    error: 'other error'
                })
                setWithdrawFailed(true)
                props.data.withdrawTxnHash = null
            }
        })
    }

    //UI Rendering

    const WithdrawButton =
        (withdrawBtnDisabled || isNaN(Number(inputValue)) || Number(inputValue) <= 0 || Number(inputValue) > Number(withdrawMaxTotal))?
            <Button variant="primary" disabled>{t('Common.Withdraw')}</Button> :
            <Button variant="primary" onClick={() => handleWithdraw(false)}>{t('Common.Withdraw')}</Button>

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

    const WithdrawForm = withdrawSafeMax ? 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.WithdrawAssets')}</div>
                <div className={styles.description}>{t('WithdrawModal.WithdrawSafeMax')} <span className={styles.value}>{ formatDecimalNumber(withdrawAbove85) + ' ' + props.data.symbol}</span></div>
                <div className={styles.description}>{t('WithdrawModal.WithdrawMax')} <span className={styles.value}>{ formatDecimalNumber(withdrawMaxTotal) + ' ' + props.data.symbol}</span></div>
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    <Button variant="primary" onClick={() => handleWithdraw(true)}>{t('WithdrawModal.WithdrawSafeMax')}</Button>
                    <Button variant="secondary" onClick={() => setWithdrawSafeMax(false)}>{t('WithdrawModal.WithdrawCustomAmount')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div> : 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.WithdrawAssets')}</div>
                <div className={styles.description}>{t('WithdrawModal.WithdrawSafeMax')} <span className={styles.value}>{ formatDecimalNumber(withdrawAbove85) + ' ' + props.data.symbol}</span></div>
                <div className={styles.description}>{t('WithdrawModal.WithdrawMax')} <span className={styles.value}>{ formatDecimalNumber(withdrawMaxTotal) + ' ' + props.data.symbol}</span></div>
                <Form >
                    <Form.Group controlId="formDeposit" className={styles.inputContainer}>
                        <Form.Control
                            className={styles.txnValue}
                            type="number"
                            placeholder={"0.00 " + props.data.symbol}
                            autoComplete="off"
                            value={inputValue}
                            onChange={e => validateInput(e.target.value)} />
                    </Form.Group>
                </Form>
                {
                    (loanUsedPercentFixed2 > 85 && loanUsedPercentFixed2 <= borrowLimit && BigNumber(inputValue).lt(withdrawMaxTotal) && !withdrawMaxTotal.isEqualTo(savingsBalanceFormatted)) &&
                        <div className={styles.checkTips}>
                            <Form.Label className={styles.txnCheckTips}>{t('BorrowModal.BorrowCheckTips')}</Form.Label>
                            <Form.Check
                                type="switch"
                                id="borrowSwitch"
                                label=""
                                checked={withdrawCheck}
                                onChange={() => setWithdrawCheck(v =>!v)}
                            />
                        </div>
                    }
                    {
                        (loanUsedPercentFixed2 > borrowLimit || BigNumber(inputValue).gt(withdrawMaxTotal)) &&
                        <div className={styles.txnError}>{t('WithdrawModal.InsufficientBalance')}</div>
                    }
            </div>
            <div className={styles.footer}>
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    {WithdrawButton}
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
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
            {LoanPercentageUsed}
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
                {LoanPercentageUsed}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const Rendered = loading ? LoadingMessage : WithdrawForm

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
                    withdrawCompleted ? TxnSuccessMsg : withdrawFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default WithdrawModal