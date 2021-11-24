import React, { useState, useEffect, useContext } from 'react'
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import CoreMethod from '../../methods/CoreMethod'
import CoreData from '../../methods/CoreData'
import FetchData from '../../methods/FetchData'
import log from '../../utils/logger'
import SwapRepay from '../../lib/SwapRepay'
import SwapRouter from '../../lib/SwapRouter'
import Config from '../../utils/config'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import { sleep } from '../../utils/promise'
import  { formatDecimalNumber } from '../../utils/numberFormat';
import LoadingIcon from '../../images/loading.svg'
import { FaCheckCircle } from 'react-icons/fa'
import { IoInformationCircleSharp } from 'react-icons/io5'
import styles from './TxnModal.module.scss'

function SwapRepayModal(props) {

    console.log("from swapRepay", props.data)

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)

    const { t } = useTranslation();

    const [swapValue, setSwapValue] = useState('')
    const [repayValue, setRepayValue] = useState('')
    const [swapAsset, setSwapAsset] = useState()
    const [swapData, setSwapData] = useState([])
    const [swapPath, setSwapPath] = useState([])
    const [showAssetSelect, setShowAssetSelect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [initDone, setInitDone] = useState(false)

    const [invalidInput, setInvalidInput] = useState(false)
    const [overPay, setOverPay] = useState(false)
    const [calculating, setCalculating] = useState(false)
    const [lowBalance, setLowBalance] = useState(false)
    const [noSwapRoute, setNoSwapRoute] = useState(false)
    const [largeDeviation, setLargeDeviation] = useState(false)
    const [firstApproval, setFirstApproval] = useState(true)
    const [needsFurtherApproval, setNeedsFurtherApproval] = useState(false)
    const [allowanceFormatted, setAllowanceFormatted] = useState('')

    const [repayInFull, setRepayInFull] = useState(true)
    const [confirmFullRepay, setConfirmFullRepay] = useState(false)

    const [confirmDeviation, setConfirmDeviation] = useState(false)
    const [deviationAmount, setDeviationAmount] = useState('')
    const [checkedDeviation, setCheckedDeviation] = useState(false)

    const [repayCompleted, setRepayCompleted] = useState(false)
    const [repayFailed, setRepayFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')

    useEffect(() => {
        if (props.show === true) {
            const swapPairs = ["HBTC", "HETH", "USDT", "HUSD", "MDX", "HT", "DAI", "USDC", "TUSD"]
            const data = props.allData.filter((d) => swapPairs.includes(d.symbol) && d.symbol !== props.data.symbol && parseFloat(d.walletBalance) > 0)
            setSwapData(data)
        }
    }, [props.allData, props.data, props.show])

    useEffect(() => {
        if (swapAsset) {
            const index = props.allData.findIndex((d) => d.symbol === swapAsset.symbol)
            if (index > -1) {
                setSwapAsset(props.allData[index])
            }
        }
    }, [props.allData])

    useEffect(() => {
        if ((swapData || []).length === 0) {
            setSwapAsset(undefined)
        } else if (!swapAsset || (swapData.findIndex((d) => d.symbol === swapAsset.symbol) < 0)) {
            console.log(swapData)
            setSwapAsset(swapData[0])
        }
        setInitDone(true)
    }, [swapData])

    function numberFromString(s) {
        return CoreData.fixedNaN(parseFloat(s))
    }

    const getRawValue = async (symbol, value) => {
        return CoreData.getRawValue(web3, networkType, symbol, value)
    }

    const fromWei = async (market, amount) => {
        if (CoreData.isNativeToken(market.symbol, networkType)) {
            return await web3.utils.fromWei(amount.toString(), 'ether')
        }
        const decimals = await FetchData.getDecimals(web3, networkType, market);
        return BigNumber(amount).shiftedBy(-parseInt(decimals))
    }

    const getTokenAddress = (symbol) => {
        if (symbol === 'HT') return Config.WHT
        return Config.markets[symbol].network[networkType].address
    }

    const getQTokenAddress = (symbol) => {
        return Config.markets[symbol].qToken.network[networkType].address
    }

    const newSwapRepay = () => {
        return new SwapRepay(web3, Config.WHT, Config.SwapRepayContract, newSwapRouter(), onTransactionHash);
    }

    const newSwapRouter = () => {
        return new SwapRouter(web3, getTokenAddress('USDT'), getTokenAddress('HUSD'), Config.WHT, Config.MDEXRouter);
    }

    const validateRepayValue = async (repayValue) => {
        if (new BigNumber(props.data.loanBalance).isLessThan(repayValue)) {
            setOverPay(true)
        } else {
            setOverPay(false)
        }
    }

    const calculateInAmount = async (amountOut) => {
        const swapRouter = newSwapRouter();
        const res = await swapRouter.getAmountOutRouter(amountOut, getTokenAddress(swapAsset.symbol), getTokenAddress(props.data.symbol))
        setNoSwapRoute(res.path.length === 0)
        setSwapPath(res.path)
        return res
    }

    const validateSwapValue = async (swapValue) => {
        if (new BigNumber(swapAsset.walletBalance).isLessThan(swapValue)) {
            setLowBalance(true)
        } else {
            setLowBalance(false)
        }
    }

    const calculateOutAmount = async (amountIn) => {
        const swapRouter = newSwapRouter();
        const res = await swapRouter.getAmountInRouter(amountIn, getTokenAddress(swapAsset.symbol), getTokenAddress(props.data.symbol))
        setNoSwapRoute(res.path.length === 0)
        setSwapPath(res.path)
        return res
    }

    const onSwapValueUpdate = async (value) => {
        let newValue = new BigNumber(value)

        if (newValue.isNegative()) {
            newValue = newValue.absoluteValue()
            setSwapValue(newValue.toString())
            setInvalidInput(false)
        } else {
            setSwapValue(value)
            const IS_NUMERIC = /^(\d+(\.\d+)?)?$/
            const isNumeric = (str) => IS_NUMERIC.test(str)
            setInvalidInput(!isNumeric(value))
        }

        setOverPay(false)
        setLowBalance(false)
        setLargeDeviation(false)
        if (numberFromString(newValue) === 0) {
            setRepayValue('')
            return
        }

        setCalculating(true)
        const txnValue = await getRawValue(
            swapAsset.symbol,
            numberFromString(newValue)
        )
        const res = await calculateOutAmount(txnValue)
        const outAmount = res.amount
        const amount = await fromWei(props.data, outAmount)
        setCalculating(false)

        setRepayValue(amount.toString())
        validateSwapValue(txnValue)
        validateRepayValue(outAmount)
    }

    const onTransactionHash = (hash) => {
        setTxnHash(hash) // we use this only for the modal's state
    }

    const verifyFurtherApproval = async (txnValue) => {
        if (!CoreData.isNativeToken(swapAsset.symbol, networkType)) {
            const { allowance, allowanceFormatted } = await FetchData.getSwapRepayAllowance(web3, connectedAddress, networkType, swapAsset)
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

    const handleRepay = async (fullPay) => {
        const gtagParams = {
            url: window.location.href,
            from: swapAsset.symbol,
            to: props.data.symbol,
        }
        setFirstApproval(true)
        // bad price check
        const warningLevel = 2 // (%) - show warnings
        const criticalLevel = 10 // (%) - stop repay

        const swapPrice = new BigNumber(swapValue).multipliedBy(swapAsset.price)
        const repayPrice = new BigNumber(repayValue).multipliedBy(props.data.price)
        const deviation = swapPrice.minus(repayPrice)
        setDeviationAmount(deviation.toFixed(6))
        if (deviation > swapPrice.multipliedBy(criticalLevel / 100.0)) {
            setConfirmFullRepay(false)
            setRepayInFull(false)
            setLargeDeviation(true)
            return
        }
        if (lowBalance || overPay || invalidInput) {
            setLoading(false)
            return
        }
        if (deviation > swapPrice.multipliedBy(warningLevel / 100.0) && !confirmDeviation) {
            setConfirmDeviation(true)
            setCheckedDeviation(false)
            return
        }
        setConfirmDeviation(false)

        // swap and repay
        setLoading(true)
        setConfirmFullRepay(true)
        const swapRepay = newSwapRepay()
        const swapAmount = await getRawValue(swapAsset.symbol, swapValue)
        const repayAmount = await getRawValue(props.data.symbol, repayValue)

        const swapToken = getTokenAddress(swapAsset.symbol)
        const swapQToken = getQTokenAddress(swapAsset.symbol)
        const repayToken = getTokenAddress(props.data.symbol)
        const repayQToken = getQTokenAddress(props.data.symbol)

        try {
            const isValidAllowance = await verifyFurtherApproval(swapAmount)
            if (!isValidAllowance) {
                setLoading(false)
                return
            }

            let response = null
            if (repayAmount === props.data.loanBalance || fullPay) {
                // 全部偿还
                // always out router is pre called
                // exceptional case maybe when the user inputed manually but matched repayAmount exactly but almost impossible
                const amountInMax = BigNumber(swapAmount).multipliedBy(1.02).toFixed(0)
                if (CoreData.isNativeToken(swapAsset.symbol, networkType) && !CoreData.isNativeToken(props.data.symbol, networkType)) {
                    response = await swapRepay.swapETHRepayERC20All(swapPath, repayQToken, connectedAddress, amountInMax)
                } else if (!CoreData.isNativeToken(swapAsset.symbol, networkType) && CoreData.isNativeToken(props.data.symbol, networkType)) {
                    response = await swapRepay.swapERC20RepayETHAll(swapPath, repayQToken, amountInMax, connectedAddress)
                } else {
                    response = await swapRepay.swapERC20RepayERC20All(swapPath, repayQToken, amountInMax, connectedAddress)
                }
            } else {
                // 偿还自定义
                // always in router is pre called
                const amountOutMin = BigNumber(repayAmount).multipliedBy(0.98).toFixed(0)
                if (CoreData.isNativeToken(swapAsset.symbol, networkType) && !CoreData.isNativeToken(props.data.symbol, networkType)) {
                    response = await swapRepay.swapExactETHRepayERC20(swapPath, repayQToken, amountOutMin, connectedAddress, swapAmount)
                } else if (!CoreData.isNativeToken(swapAsset.symbol, networkType) && CoreData.isNativeToken(props.data.symbol, networkType)) {
                    response = await swapRepay.swapExactERC20RepayETH(swapPath, swapAmount, repayQToken, amountOutMin, connectedAddress)
                } else {
                    response = await swapRepay.swapExactERC20RepayERC20(swapPath, swapAmount, repayQToken, amountOutMin, connectedAddress)
                }
            }

            log.info(response)

            if (props.show === false) {
                return
            }

            if (response.events.Failure) {
                window.gtag('event', 'swap_repay', {
                    ...gtagParams,
                    error: 'response event fail'
                })
                setRepayFailed(true)
            } else {
                window.gtag('event', 'swap_repay', gtagParams)
                setRepayCompleted(true)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            if (error.code === 4001) {
                window.gtag('event', 'swap_repay', {
                    ...gtagParams,
                    error: 'user rejected'
                })
                handleClose()
            } else {
                window.gtag('event', 'swap_repay', {
                    ...gtagParams,
                    error: 'other error'
                })
                setRepayFailed(true)
            }
        }
    }

    const resetTipsError = () => {
        setInvalidInput(false)
        setOverPay(false)
        setLowBalance(false)
        setNoSwapRoute(false)
        setLargeDeviation(false)
    }

    const handleRepayFull = async () => {
        await setMaximum(true)
        if (parseFloat(swapAsset.walletBalance) === 0) {
            setRepayInFull(false)
            resetTipsError()
            setSwapValue(swapAsset.walletBalance)
            setLowBalance(true)
        } else {
            setConfirmFullRepay(true)
        }

    }

    const setMaximum = async (fullPayOnly) => {
        if (parseFloat(swapAsset.walletBalance) === 0) {
            resetTipsError()
            setSwapValue(swapAsset.walletBalance)
            setLowBalance(true)
            return;
        }

        let loanRepayAmount = props.data.loanBalance
        const res = await calculateInAmount(loanRepayAmount.toString())
        let loanSwapAmount = res.amount
        if (parseFloat(loanSwapAmount) > parseFloat(swapAsset.walletBalance)) {
            if (fullPayOnly) {
                // 全部偿还
                setLowBalance(true)
                setLoading(false)
                setRepayInFull(false)
            } else {
                // input button max
                loanSwapAmount = swapAsset.walletBalance
                const res = await calculateOutAmount(loanSwapAmount.toString())
                loanRepayAmount = res.amount
            }
        }
        const swapAmount = await fromWei(swapAsset, loanSwapAmount)
        setSwapValue(swapAmount.toString())
        validateSwapValue(loanSwapAmount)
        const repayAmount = await fromWei(props.data, loanRepayAmount)
        setRepayValue(repayAmount.toString())
        validateRepayValue(loanRepayAmount)
        return [swapAmount.toString(), repayAmount.toString()]
    }

    const handleApprove = async (first = true) => {
        setLoading(true)
        await CoreMethod.approveSwapRepayERC20(web3, connectedAddress, networkType, swapAsset)
            .then(async response => {
                if (response) {
                    if (first) {
                        setFirstApproval(false)
                    } else {
                        const txnValue = await getRawValue(swapAsset.symbol, swapValue)
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

    const handleSelectAsset = async (asset) => {
        setShowAssetSelect(false)
        setSwapAsset(asset)
        setNoSwapRoute(false)
        setLowBalance(false)
        setOverPay(false)
        setLargeDeviation(false)
        setSwapValue('')
        setRepayValue('')
        setFirstApproval(true)
    }

    const handleClose = async () => {
        setInvalidInput(false)
        setOverPay(false)
        setLowBalance(false)
        setLargeDeviation(false)
        setNoSwapRoute(false)

        setLoading(false)
        setCalculating(false)
        setInitDone(false)

        setSwapAsset()
        setSwapValue('')
        setRepayValue('')
        setRepayInFull(true)
        setRepayCompleted(false)
        setRepayFailed(false)
        setTxnHash('')

        setNeedsFurtherApproval(false)
        setConfirmFullRepay(false)
        setConfirmDeviation(false)
        setShowAssetSelect(false)
        setFirstApproval(true)
        props.handleClose()
    }

    const handleConfirmFullRepay_cancel = () => {
        resetTipsError()
        setSwapValue('')
        setRepayValue('')
        setConfirmFullRepay(false)
    }

    //UI Rendering

    const RepayButton =
        (swapPath.length === 0 || calculating || invalidInput || overPay || lowBalance || isNaN(parseFloat(swapValue)) || isNaN(parseFloat(repayValue)) || parseFloat(swapValue) <= 0 || parseFloat(repayValue) <= 0) ?
            <Button variant="secondary" disabled>{t('Common.Repay')}</Button> :
            <Button variant="secondary" onClick={() => handleRepay(false)}>{t('Common.Repay')}</Button>

    const WalletBalanceInfo = 
        <div className={styles.walletInfo}>
            <div className={styles.label}>{t('Common.WalletBalance')}</div>
            <div className={styles.value}>
                {/* TODO: swapAsset.walletBalanceFormatted and swapAsset.symbol throws error */}
                {/* {parseFloat(swapAsset.walletBalanceFormatted).toFixed(6) + ' ' + swapAsset.symbol} */}
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

    const ConfirmFullRepay = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.SwapRepayAssets')}</div>
                <div className={styles.description}>
                    {t('SwapRepayModal.RepayConfirmMsg',
                        {
                            //TODO: swapAsset.symbol throws error
                            // swapValue: `${numberFromString(swapValue).toFixed(6)} ${swapAsset.symbol} `,
                            swapValue: `${numberFromString(swapValue).toFixed(6)}`,
                            repayValue: `${numberFromString(repayValue).toFixed(6)} ${props.data.symbol} `
                        }
                    )}
                </div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleRepay(true)}>{t('Common.Confirm')}</Button>
                    <Button variant="outline-back" onClick={handleConfirmFullRepay_cancel}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const ConfirmDeviation = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.SwapRepayAssets')}</div>
                <div className={styles.description}>{t('SwapRepayModal.DeviationWarning',{ value: deviationAmount })}</div>
            </div>
            <Form.Check
                className={styles.checkBox}
                type="checkbox"
                label={t('Common.IUnderstand')}
                onChange={() => { setCheckedDeviation(v => !v) }}
                checked={checkedDeviation} />
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleRepay(repayInFull)} disabled={!checkedDeviation}>{t('Common.Repay')}</Button>
                    <Button variant="outline-back" onClick={() => setConfirmDeviation(false)}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const ApproveRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.SwapRepayAssets')}</div>
                <div className={styles.description}>{t('Common.ApprovalMsg')}</div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(true)}>{t('Common.Approve')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const ApproveFurtherRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.SwapRepayAssets')}</div>
                <div className={styles.description}>{t('Common.FurtherApprovalMsg', { type: t('Common.Swap'), inputValue: swapValue, allowanceFormatted })}</div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(false)}>{t('Common.FurtherApprove')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const RepayCustom =
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.SwapRepayAssets')}</div>
                <div className={styles.description}>{t('Common.RepayAmount')} 
                    <span className={styles.value}>
                        {`${numberFromString(repayValue).toFixed(6)} ${props.data.symbol} `}
                        {
                            calculating && 
                            <img
                                src={LoadingIcon}
                                width="auto"
                                height="18"
                                className="d-inline-block align-top"
                                alt="loading" />
                        }
                    </span>
                </div>
                <Form.Group controlId="formSwapValue">
                    <Form.Control
                        className={styles.txnValue}
                        type="number"
                        //TODO: swapAsset.symbol throws error
                        // placeholder={"0.00 " + swapAsset.symbol}
                        placeholder={"0.00 "}
                        autoComplete="off"
                        value={swapValue}
                        min="0"
                        onChange={e => onSwapValueUpdate(e.target.value)} />
                    <Button variant="outline-grey" onClick={() => setMaximum(false)}>{t('Common.Maximum')}</Button>
                </Form.Group>
                {invalidInput ? (
                    <div className={styles.txnError}>{t('RepayModal.InvalidInput')}</div>
                    ) :
                overPay ? (
                    <div className={styles.txnError}>{t('RepayModal.OverPayError')}</div>
                    ) :
                    lowBalance ? (
                        <div className={styles.txnError}>{t('RepayModal.LowBalanceError')}</div>
                    ) : noSwapRoute ? (
                        <div className={styles.txnError}>{t('SwapRepayModal.NoSwapRouteError')}</div>
                    ) : largeDeviation ? (
                        <div className={styles.txnError}>{t('SwapRepayModal.LargeDeviationError')}</div>
                    ) : ''}
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    {RepayButton}
                    <Button variant="outline-black" onClick={() => handleClose}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const RepayOption = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <div className={styles.text}>{t('RepayModal.SuccessMsg')}</div>
                    <div className={styles.description}>{t('RepayModal.LoanAmountDue')} <span className={styles.value}>{parseFloat(props.data.loanBalanceFormatted).toFixed(6) + ' ' + props.data.symbol}</span> (<span className={styles.subValue}>{parseFloat(props.data.loanBalanceFormatted) + ' ' + props.data.symbol}</span>)</div>
                </div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="primary" onClick={handleRepayFull}>{t('RepayModal.RepayFullAmountDue')}</Button>
                    <Button variant="secondary" onClick={() => setRepayInFull(false)}>{t('RepayModal.RepayCustomAmount')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Close')}</Button>
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

    const NoSwapList =
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <IoInformationCircleSharp />
                    <div className={styles.text}>{t('SwapRepayModal.NoSwapList')}</div>
                </div>
            </div>
            <div className={styles.footer}>
                {WalletBalanceInfo}
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const needsApproval = swapAsset && !swapAsset.swapRepayApproved && firstApproval
    const RepayForm = () => confirmDeviation ? ConfirmDeviation : !repayInFull ? RepayCustom : confirmFullRepay ? ConfirmFullRepay : RepayOption
    const Loaded = () => !swapAsset ? NoSwapList : needsApproval ? ApproveRequest : RepayForm
    const Rendered = () => loading ? LoadingMessage : needsFurtherApproval ? ApproveFurtherRequest : Loaded

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
                    repayCompleted ? TxnSuccessMsg : repayFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default SwapRepayModal