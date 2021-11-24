import React, { useState, useEffect, useContext } from 'react'
import { Container, Button, Modal, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import styles from './TxnModal.module.scss'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import CoreMethod from '../../methods/CoreMethod'
import CoreData from '../../methods/CoreData'
import FetchData from '../../methods/FetchData'
import log from '../../utils/logger'
import FlashLoan from '../../lib/FlashLoan'
import SwapRouter from '../../lib/SwapRouter'
import Config from '../../utils/config'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../../context'
import { formatBigNumber } from '../../utils/numberFormat'
import { useDebounce } from '../../hooks'
import { sleep } from '../../utils/promise'
import LoadingIcon from '../../images/loading.svg'

const FeeManager = require('../../lib/FeeManager.json')

const warnPercent = 85
const maxPercent = 90

function DepositSwapModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)

    const { t } = useTranslation();

    const [swapValue, setSwapValue] = useState('')
    const [repayValue, setRepayValue] = useState('')
    const [serviceValue, setServiceValue] = useState('')
    const [daoValue, setDaoValue] = useState('')
    const [showDao, setShowDao] = useState(false)
    const [swapAsset, setSwapAsset] = useState()
    const [swapData, setSwapData] = useState([])
    const [swapPath, setSwapPath] = useState([])
    const [showAssetSelect, setShowAssetSelect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [initDone, setInitDone] = useState(false)

    const [invalidInput, setInvalidInput] = useState(false)
    const [calculating, setCalculating] = useState(false)
    const [lowBalance, setLowBalance] = useState(false)
    const [noSwapRoute, setNoSwapRoute] = useState(false)
    const [largeDeviation, setLargeDeviation] = useState(false)
    const [firstApproval, setFirstApproval] = useState(true)
    const [needsFurtherApproval, setNeedsFurtherApproval] = useState(false)
    const [allowanceFormatted, setAllowanceFormatted] = useState('')

    const [confirmFullRepay, setConfirmFullRepay] = useState(false)

    const [confirmDeviation, setConfirmDeviation] = useState(false)
    const [deviationAmount, setDeviationAmount] = useState('')
    const [checkedDeviation, setCheckedDeviation] = useState(false)

    const [repayCompleted, setRepayCompleted] = useState(false)
    const [repayFailed, setRepayFailed] = useState(false)
    const [txnHash, setTxnHash] = useState('')
    const [isMax, setIsMax] = useState(false)
    const [rate, setRate] = useState(0)

    const [btnDisabled, setBtnDisabled] = useState(false)
    const [swapCheck, setSwapCheck] = useState(false)
    const [percent, setPercent] = useState(0)

    const [collateralModal, setCollateralModal] = useState(false)
    const [reApproveFtoken, setReApproveFtoken] = useState('')

    const [aboveLimit, setAboveLimit] = useState(false)

    const fetchRate = async (amount) => {
        const theFeeManagerContract = Config.FeeManagerContract[networkType]
        if (!theFeeManagerContract) {
            return "0"
        }

        const myContract = new web3.eth.Contract(FeeManager.abi, theFeeManagerContract)
        const molecular = await myContract.methods.FEE_MOLECULAR().call()
        const denominator = await myContract.methods.FEE_DENOMINATOR().call()
        return new BigNumber(molecular).div(denominator).toString()
    }


    useEffect(() => {
        if (props.show) {
            const getRate = async () => {
                const rate = await fetchRate();
                setRate(rate)
            }
            getRate();
        }
    }, [props.show]);


    useEffect(() => {
        const getPercent = async () => {
            await calculatePercent()
        }
        if (props.show === true) {
            const excludeSwapPairs = ["NEO", "HXTZ", "HBSV", "htELA", "HELA", "WHT-USDT","HBTC-USDT","ETH-USDT","ETH-HBTC"]
            const data = props.allData.filter((d) => !excludeSwapPairs.includes(d.symbol) && d.symbol !== props.data.symbol)
            setSwapData(data)
            getPercent()
        }
    }, [props.allData, props.data, props.show])

    useEffect(() => {
        if ((swapData || []).length === 0) {
            setSwapAsset(undefined)
        } else if (!swapAsset || (swapData.findIndex((d) => d.symbol === swapAsset.symbol) < 0)) {
            const asset = swapData[0]
            setSwapAsset(asset)
            if (asset && !asset.collateralStatus && props.allData.totalLoanBalance > 0) {
                setCollateralModal(true)
            }
        }
        setInitDone(true)
    }, [swapData])

    function numberFromString(s) {
        return CoreData.fixedNaN(parseFloat(s))
    }

    const getRawValue = async (symbol, value) => {
        return CoreData.getRawValue(web3, networkType, symbol, value)
    }

    const getQTokenRawValue = async (symbol, value) => {
        const contract = await CoreData.getQTokenContract(web3, networkType, symbol)
        let decimals = await contract.methods.decimals().call()
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })
        return BigNumber(value).shiftedBy(parseInt(decimals)).toFixed(0)
    }

    // 大===>小
    const fromWei = async (market, amount) => {
        if (CoreData.isNativeToken(market.symbol, networkType)) {
            return await web3.utils.fromWei(amount.toString(), 'ether')
        }
        const decimals = await FetchData.getDecimals(web3, networkType, market);
        return BigNumber(amount).shiftedBy(-parseInt(decimals))
    }

    const getTokenAddress = (symbol) => {
        if (symbol === 'HT') return Config.WHT

        const theNetwork = Config.markets[symbol].network[networkType]
        if (!theNetwork) {
            return ""
        }

        return theNetwork.address
    }

    const getQTokenAddress = (symbol) => {
        return Config.markets[symbol].qToken.network[networkType].address
    }

    const newFlashLoan = () => {
        return new FlashLoan(web3, Config.FlashLoanContract[networkType], Config.DepositSwapContract, onTransactionHash);
    }

    const newSwapRouter = () => {
        return new SwapRouter(web3, getTokenAddress('USDT'), getTokenAddress('HUSD'), Config.WHT, Config.MDEXRouter);
    }


    const calculateOutAmount = async (amountIn) => {
        const swapRouter = newSwapRouter();
        const res = await swapRouter.getAmountInRouter(amountIn, getTokenAddress(props.data.symbol), getTokenAddress(swapAsset.symbol))
        setNoSwapRoute(res.path.length === 0)
        setSwapPath(res.path)
        return res
    }


    const onTransactionHash = (hash) => {
        setTxnHash(hash) // we use this only for the modal's state
    }

    const verifyFurtherApproval = async (txnValue) => {
        const { allowance, allowanceFormatted } = await FetchData.getDepositSwapAllowance(web3, connectedAddress, networkType, props.data)
        if (allowance && allowance < Number(txnValue)) {
            setNeedsFurtherApproval(true)
            setAllowanceFormatted(allowanceFormatted)
            return Promise.resolve(false)
        }

        setNeedsFurtherApproval(false)
        setAllowanceFormatted('')
        return Promise.resolve(true)
    }

    const getQTokenAmount = async (amount) => {
        const ctoken = await CoreData.getQTokenContract(web3, networkType, props.data.symbol)
        const exrate = await ctoken.methods.exchangeRateCurrent().call();

        return BigNumber(amount).times(Math.pow(10, 18)).div(exrate).toFixed(0);
    }

    const fetchServiceCharge = async (amount) => {
        const theFeeManagerContract = Config.FeeManagerContract[networkType]
        if (!theFeeManagerContract) {
            return new BigNumber(0)
        }

        const myContract = new web3.eth.Contract(FeeManager.abi, theFeeManagerContract)
        if (!myContract) {
            return new BigNumber(0)
        }

        return await myContract.methods.getFee(connectedAddress, amount).call()
    }


    const calculateDao = async (amount, serviceAmount) => {
        setShowDao(false)
        setDaoValue('')

        const thousandAmount = BigNumber(amount).multipliedBy(rate)
        const thousandAmountInt = thousandAmount.integerValue(BigNumber.ROUND_DOWN).toString()
        if (thousandAmountInt !== serviceAmount) {
            // log.info('dao持仓优惠')
            const daoValue = thousandAmount.minus(serviceAmount).toFixed(0)
            const daoUIValue = await fromWei(swapAsset, daoValue)
            const daoUIDecimals6 = numberFromString(daoUIValue.toString()).toFixed(6)

            if (parseFloat(daoUIDecimals6) !== 0) {
                // log.info('优惠取6位')
                setShowDao(true)
                setDaoValue(daoUIDecimals6)
            }
        }
    }

    // 总借贷额度
    const getAllMarkData = async (marketsObj) => {
        let marketsArr = []
        for (let [key, value] of Object.entries(marketsObj)) {
            if (!isNaN(parseFloat(key))) {
                marketsArr.push(value)
            }
        }
        return await FetchData.getTotalBorrowLimit(marketsArr)
            .then(response => {
                return response
            })
    }


    const getMarketData = async (web3, networkType, connectedAddress, market) => {
        await FetchData.getBorrowLimit(web3, networkType, market)
            .then(response => {
                market.borrowLimit = response.borrowLimit
                market.borrowLimitFormatted = response.borrowLimitFormatted
                market.borrowLimitFiat = response.borrowLimitFiat
                market.collateralFactor = response.collateralFactor
            })
    }


    const setSavingBalance = async (savingsBalance, market) => {
        market.savingsBalance = savingsBalance;
    }



    const changeAllData = async (swapAmount, repayAmount, max = false) => {
        let newMarket = {};
        for (let [key, value] of Object.entries(props.allData)) {
            if (isNaN(parseFloat(key))) {
                newMarket[key] = value
            } else {
                const market = { ...value }
                newMarket[key] = market
                if (market.symbol === swapAsset?.symbol) {
                    const savingsBalance = BigNumber(newMarket[key].savingsBalance).plus(repayAmount).toString()
                    setSavingBalance(savingsBalance, newMarket[key])
                    await getMarketData(web3, networkType, connectedAddress, newMarket[key])
                }

                if (market.symbol === props.data.symbol) {
                    const savingsBalance = max ? '0' : BigNumber(newMarket[key].savingsBalance).minus(swapAmount).toString()
                    setSavingBalance(savingsBalance, newMarket[key])
                    await getMarketData(web3, networkType, connectedAddress, newMarket[key])
                }
            }

        }
        return newMarket
    }


    const initPercent = (swapV = swapValue, repayV = repayValue) => {
        let percent = 0
        percent = ((props.allData.totalLoanBalance / props.allData.totalBorrowLimitFiat) * 100).toFixed(2)
        if (percent === "NaN" || percent === "Infinity") {
            percent = "0"
        }
        setBtnDisabled(true)
        setPercent(percent)
        return percent;
    }


    const calculatePercent = async (swapV = swapValue, repayV = repayValue, max) => {
        let percent;
        if (invalidInput || swapV === '' || repayV === '') {
            percent = initPercent(swapV, repayV)
            setPercent(percent)
            return percent;
        }
        let swapAmount = await getRawValue(props.data.symbol, swapV)
        let repayAmount = await getRawValue(swapAsset.symbol, repayV)
        const newMarket = await changeAllData(swapAmount, repayAmount, max)
        const totalBorrowLimitFiat = await getAllMarkData(newMarket)
        const percentD = (props.allData.totalLoanBalance / totalBorrowLimitFiat) * 100
        percent = percentD.toFixed(2)

        if (percent === "NaN" || percent === "Infinity") {
            percent = "0"
        }

        if (percent < warnPercent) {
            setBtnDisabled(false)
        } else if (percent > warnPercent && percent <= maxPercent) {
            setBtnDisabled(!swapCheck)
        } else {
            setBtnDisabled(true)
        }

        if (percentD < 0 || percent > maxPercent) {
            setPercent(100)
        } else {
            setPercent(percent)
        }

        return percent;
    }

    useEffect(() => {
        setBtnDisabled(!swapCheck)
    }, [swapCheck])

    const debounceSwapValue = useDebounce(swapValue, 500)


    useEffect(() => {
        const swapUpdate = async (value) => {

            let newValue = new BigNumber(value)

            if (numberFromString(newValue) === 0) {
                setRepayValue('')
                setServiceValue('')
                setDaoValue('')
                initPercent(value)
                return
            }

            setCalculating(true)

            const txnValue = await getRawValue(
                props?.data?.symbol,
                numberFromString(newValue)
            )
            const res = await calculateOutAmount(txnValue)
            const outAmount = BigNumber(res.amount).multipliedBy(BigNumber(1).minus(rate)).toFixed(0)
            const amount = await fromWei(swapAsset, outAmount)
            setRepayValue(amount.toString())

            const serviceValue = await fetchServiceCharge(outAmount)
            const serviceUIValue = await fromWei(swapAsset, serviceValue)
            setServiceValue(serviceUIValue.toString())

            calculateDao(outAmount, serviceValue)

            setAboveLimit(newValue.times(props.data.price).gt(BigNumber(getTransactionLimit())))
            setLowBalance(new BigNumber(props.data.savingsBalance).isLessThan(txnValue))
            
            await calculatePercent(value, amount.toString())

            setCalculating(false)
        }
        if (!isMax) {
            swapUpdate(swapValue)
        }

    }, [debounceSwapValue, isMax])


    const onSwapValueUpdate = async(value) => {
        resetTipsError()
        setIsMax(false)
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

    }


    const setMaximum = async () => {
        resetTipsError()
        setCalculating(true)
        setIsMax(true)

        const inputValue = props.data.savingsBalanceFormatted.toString()

        setSwapValue(inputValue)

        const res = await calculateOutAmount(props.data.savingsBalance)
        const outAmount = BigNumber(res.amount).multipliedBy(BigNumber(1).minus(rate)).toFixed(0)
        let tipsValue = await fromWei(swapAsset, outAmount)
        tipsValue = tipsValue.toString()
        setRepayValue(tipsValue)

        const serviceValue = await fetchServiceCharge(outAmount)
        const serviceUIValue = await fromWei(swapAsset, serviceValue)
        setServiceValue(serviceUIValue.toString())

        calculateDao(outAmount, serviceValue)

        await calculatePercent(inputValue, tipsValue, true)

        setAboveLimit(BigNumber(props.data.savingsBalanceFiat).gt(BigNumber(getTransactionLimit())))
        setCalculating(false)

        return [inputValue, tipsValue]
    }

    const handleRepay = async() => {
        const gtagParams = {
            url: window.location.href,
            from: props.data.symbol,
            to: swapAsset.symbol,
        }
        setFirstApproval(true)
                if (swapAsset.symbol !== props.data.symbol) {
                    // bad price check
                    const warningLevel = 2 // (%) - show warnings
                    const criticalLevel = 10 // (%) - stop repay

                    const bPrice = new BigNumber(repayValue).multipliedBy(swapAsset.price) // 转换的价格
                    const aPrice = new BigNumber(swapValue).multipliedBy(props.data.price) // 实际的价格
                    const deviation = bPrice.minus(aPrice)
                    setDeviationAmount(deviation.toFixed(6))
                    if (deviation > bPrice.multipliedBy(criticalLevel / 100.0)) {
                        setConfirmFullRepay(false)
                        setLargeDeviation(true)
                        return
                    }

                    if (deviation > bPrice.multipliedBy(warningLevel / 100.0) && !confirmDeviation) {
                        setConfirmDeviation(true)
                        setCheckedDeviation(false)
                        return
                    }
                }

                if (lowBalance || invalidInput) {
                    setLoading(false)
                    return
                }

                setConfirmDeviation(false)

                setLoading(true)
                setConfirmFullRepay(true)
                const flashLoan = newFlashLoan()

                const tokenA = getTokenAddress(props.data.symbol)
                const ftokenA = getQTokenAddress(props.data.symbol)
                const amountA = await getRawValue(props.data.symbol, swapValue)

                const tokenB = getTokenAddress(swapAsset.symbol)
                const ftokenB = getQTokenAddress(swapAsset.symbol)
                const amountB = await getRawValue(swapAsset.symbol, repayValue)

                try {
                    // Pay up to 2% more
                    let minOut = BigNumber(amountB).multipliedBy(0.98).toFixed(0)
                    
                    const ftokenAmount = isMax ? await getMaxTokenAmount() : await getQTokenAmount(amountA)

                    setReApproveFtoken(ftokenAmount)

                    const isValidAllowance = await verifyFurtherApproval(ftokenAmount)
                    if (!isValidAllowance) {
                        setLoading(false)
                        return
                    }

                    let response = await flashLoan.depositSwapLoan({
                        swapPath,
                        tokenB,
                        ftokenB,
                        tokenA,
                        ftokenA,
                        ftokenAmount,
                        minOut,
                        accounts: connectedAddress
                    })


                    if (props.show === false) {
                        return
                    }

                    if (response.events.Failure) {
                        window.gtag('event', 'deposit_swap', {
                            ...gtagParams,
                            error: 'response event fail'
                        })
                        setRepayFailed(true)
                    } else {
                        window.gtag('event', 'deposit_swap', gtagParams)
                        setRepayCompleted(true)
                        setIsMax(false)
                    }
                    setLoading(false)

                } catch (error) {
                    console.log(error)
                    if (error.code === 4001) {
                        window.gtag('event', 'deposit_swap', {
                            ...gtagParams,
                            error: 'user rejected'
                        })
                        handleClose()
                    } else {
                        window.gtag('event', 'deposit_swap', {
                            ...gtagParams,
                            error: 'other error'
                        })
                        setRepayFailed(true)
                    }
                }

            }

            const resetTipsError = () => {
                setInvalidInput(false)
                setLowBalance(false)
                setNoSwapRoute(false)
                setLargeDeviation(false)
                setShowDao(false)
                setAboveLimit(false)
            }

            const getMaxTokenAmount = async () => {
                const address = getQTokenAddress(props.data.symbol)
                const myContract = new web3.eth.Contract(props.data.qToken.ABI, address)
                return await myContract.methods.balanceOf(connectedAddress).call()
            }

            const handleApprove = async (first = true) => {
                setLoading(true)
                await CoreMethod.approveDepositSwapERC20(web3, connectedAddress, networkType, props.data)
                    .then(async response => {
                        if (response) {
                            if (first) {
                                setFirstApproval(false)
                            } else {
                                await sleep()
                                const isValidAllowance = await verifyFurtherApproval(reApproveFtoken)
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


    const restAssetData = async() => {
                setNoSwapRoute(false)
                setLowBalance(false)
                setLargeDeviation(false)
                setSwapValue('')
                setRepayValue('')
                setServiceValue('')
                setDaoValue('')
                setShowDao(false)
                setFirstApproval(true)
                setIsMax(false)
                setBtnDisabled(false)
                setSwapCheck(false)
                initPercent()
                setReApproveFtoken('')
                setAboveLimit(false)
            }

            const handleCollateral = async (market = swapAsset) => {
                setLoading(true)
                setConfirmFullRepay(true)
                market.collateralInProgress = true
                market.swapCollateralLoading = true

                const gasInfo = await CoreData.getGasInfo(web3)
                const comptroller = await CoreData.getComptroller(web3, networkType)
                const marketAddress = market.qToken.network[networkType].address

                return await comptroller.methods.enterMarkets([marketAddress]).send({
                    from: connectedAddress,
                    gasLimit: web3.utils.toHex(gasInfo.gasLimit),     // posted at compound.finance/developers#gas-costs
                    gasPrice: web3.utils.toHex(gasInfo.gasPrice) // use ethgasstation.info (mainnet only)
                })
                    .on('transactionHash', function (hash) {
                        log.info(hash)
                        setTxnHash(hash)
                    })
                    .then(response => {
                        log.info(response)
                        market.collateralStatus = true
                        market.collateralInProgress = false
                        market.swapCollateralLoading = false
                    })
                    .catch(error => {
                        console.log(error)
                        setLoading(false)
                        setConfirmFullRepay(false)
                        market.collateralInProgress = false
                        if (error.code === 4001) {
                            handleClose()
                        }
                    })

            }

            useEffect(() => {
                if (swapAsset && swapAsset.swapCollateralLoading !== undefined) {
                    if (swapAsset.swapCollateralLoading === false) {
                        setLoading(false)
                        setTxnHash('')
                        setCollateralModal(false)
                        restAssetData()
                        setConfirmFullRepay(false)
                    }
                    if (swapAsset.collateralStatus) {
                        restAssetData()
                    }
                }
            }, [swapAsset?.swapCollateralLoading, swapAsset?.collateralStatus])


            const handleSelectAsset = async (asset) => {
                setShowAssetSelect(false)
                setSwapAsset(asset)

                if (asset && !asset.collateralStatus && props.allData.totalLoanBalance > 0) {
                    setCollateralModal(true)
                } else {
                    setCollateralModal(false)
                    restAssetData()
                }
            }

            const handleClose = async () => {
                setInvalidInput(false)
                setLowBalance(false)
                setLargeDeviation(false)
                setNoSwapRoute(false)

                setLoading(false)
                setCalculating(false)
                setInitDone(false)

                setSwapAsset()
                setSwapValue('')
                setRepayValue('')
                setServiceValue('')
                setDaoValue('')
                setShowDao(false)
                setRepayCompleted(false)
                setRepayFailed(false)
                setTxnHash('')

                setNeedsFurtherApproval(false)
                setConfirmFullRepay(false)
                setConfirmDeviation(false)
                setShowAssetSelect(false)
                setFirstApproval(true)
                setIsMax(false)
                setBtnDisabled(false)
                setSwapCheck(false)
                setCollateralModal(false)
                setReApproveFtoken('')
                setAboveLimit(false)
                props.handleClose()

                delete (swapAsset.swapCollateralLoading)
            }


    const getTransactionLimit =  () => {
                let result = '0'
                if (props?.allData?.transactionLimit?.amountFiat) {
                    result = props.allData.transactionLimit.amountFiat.toFixed(0)
                }
                return result
            }


    // UI rendering

    const RepayButton =
        (calculating || invalidInput || aboveLimit || btnDisabled || lowBalance || isNaN(parseFloat(swapValue)) || isNaN(parseFloat(repayValue)) || parseFloat(swapValue) <= 0 || parseFloat(repayValue) <= 0 )?
            <Button variant="secondary" disabled>{t('Common.Swap')}</Button> :
            <Button variant="secondary" onClick={() => handleRepay()}>{t('Common.Swap')}</Button>

    const ApproveRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.DepositSwapAssets')}</div>
                <div className={styles.description}>{t('DepositSwapModal.ApprovalMsg')}</div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleApprove(true)}>{t('Common.Approve')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const ApproveFurtherRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.DepositSwapAssets')}</div>
                <div className={styles.description}>{t('Common.ReApprovalMsg')}</div>
            </div>
            <div className={styles.footer}>
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

    const RepayCustom = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>{t('Common.DepositSwapAssets', { curSymbol: props?.data?.symbol, swapSymbol: swapAsset?.symbol })}</div>
                <div className={styles.description}>{t('DepositSwapModal.InfoText')}</div>
                <div className={styles.description}>{t('Common.DepositRepayAssetsLimitTips')} <span className={styles.value}>${formatBigNumber(getTransactionLimit())}</span></div>
                <div className={styles.description}>{`${props?.data?.symbol} ${t('Common.SavingsBalance')}`} <span className={styles.value}>{`${props?.data?.savingsBalanceFormatted} ${props?.data?.symbol}`}</span></div>
                <div className={styles.description}>{t('Common.EstExchange')} <span className={styles.value}>{`${numberFromString(repayValue)} ${swapAsset?.symbol} `}</span></div>
                <div className={styles.description}>{t('Common.MaximumSlippage')} <span className={styles.value}>2%</span></div>
                <div className={styles.description}>{t('Common.MDEXHandlingFee')} <span className={styles.value}>0.3%</span></div>
                <div className={styles.description}>{t('Common.HandlingFee')} <span className={styles.value}>{`${numberFromString(serviceValue).toFixed(6)} ${swapAsset?.symbol}`}</span></div>
                {
                    showDao &&
                    <div className={styles.description}>${t('Common.DAOHoldingDiscount')} <span className={styles.value}>{` ( ${daoValue} ${swapAsset?.symbol} )`}</span></div>
                }
                <div className={styles.description}>{t('BorrowModal.LoanPercentageUsed')} <span className={styles.value}>{percent} %</span></div>
                <Form >
                    <Form.Group controlId="formSwapValue" className={styles.inputContainer}>
                        <Form.Control
                            className={styles.txnValue}
                            type="number"
                            placeholder={"0.00 " + props?.data?.symbol}
                            autoComplete="off"
                            value={swapValue}
                            min="0"
                            width="200px"
                            onChange={e => onSwapValueUpdate(e.target.value)} />
                        <Button variant="outline-darkgrey" onClick={() => setMaximum()}>{t('Common.Maximum')}</Button>
                    </Form.Group>
                </Form>
                {invalidInput ? (
                    <div className={styles.txnError}>{t('DepositSwapModal.InvalidInput')}</div>
                ) : aboveLimit ? (
                    <div className={styles.txnError}>{t('DepositSwapModal.AboveTransactionLimit')}</div>
                ) : lowBalance ? (
                    <div className={styles.txnError}>{t('DepositRepayModal.LowBalanceError')}</div>
                ) : noSwapRoute ? (
                    <div className={styles.txnError}>{t('SwapRepayModal.NoSwapRouteError')}</div>
                ) : largeDeviation ? (
                    <div className={styles.txnError}>{t('SwapRepayModal.LargeDeviationError')}</div>
                ) : ''}
                {
                    (Number(percent) > warnPercent && Number(percent) <= maxPercent) &&
                    <div className={styles.checkTips}>
                        <Form.Label className={styles.txnCheckTips}>{t('BorrowModal.BorrowCheckTips')}</Form.Label>
                        <Form.Check
                            type="switch"
                            id="borrowSwitch"
                            label=""
                            checked={swapCheck}
                            onChange={() => setSwapCheck(v => !v)}
                        />
                    </div>
                }
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    {RepayButton}
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>
    
    const ConfirmDeviation = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <div className={styles.text}>{t('SwapRepayModal.DeviationWarning', { value: deviationAmount })}</div>
                    <Form.Check
                        className={styles.checkBox}
                        type="checkbox"
                        label={t('Common.IUnderstand')}
                        onChange={() => { setCheckedDeviation(v => !v) }}
                        checked={checkedDeviation}
                    />
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleRepay()} disabled={!checkedDeviation}>{t('Common.Swap')}</Button>
                    <Button variant="outline-black" onClick={() => setConfirmDeviation(false)}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const CollateralRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    {/* TODO */}
                    {/* <div className={styles.text}>{t('DepositSwapModal.CollateralApprovalMsg', { symbol: swapAsset.symbol })}</div> */}
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleCollateral()}>{t('Common.Approve')}</Button>
                    <Button variant="outline-black" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
                </div>
            </div>
        </div>

    const NoSwapList = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <div className={styles.text}>{t('SwapRepayModal.NoSwapList')}</div>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Cancel')}</Button>
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
                <div className={styles.buttonsContainer}>
                    <Button variant="secondary" onClick={() => handleClose()}>{t('Common.Close')}</Button>
                </div>
            </div>
        </div>

    const needsApproval = props.data && !(props.data.depositSwapApproved) && firstApproval
    const RepayForm = confirmDeviation ? ConfirmDeviation : collateralModal ? CollateralRequest : RepayCustom
    const Loaded = !swapAsset ? NoSwapList : needsApproval ? ApproveRequest : RepayForm
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
                    repayCompleted ? TxnSuccessMsg :
                    repayFailed ? TxnErrorMsg : Rendered
                }
            </Container>
        </Modal>
    )
}

export default DepositSwapModal