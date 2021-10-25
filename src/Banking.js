import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
//Local functions
import FetchData from './methods/FetchData'
import GovernanceData from './methods/GovernanceData'
import CoreData from './methods/CoreData'
import log from './utils/logger'
import { WalletAddressContext, NetworkTypeContext, Web3Context, ReadonlyWeb3Context } from './context'
import { promiseWithTimeout } from './utils/promise'
//Styles, images and icons
import logo from './images/logo.svg';
import './Banking.module.scss';
//Components
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts'
import Disconnected from './components/Disconnected';
import Pending from './components/Pending'

export async function loadAllMarketData(web3, networkType, connectedAddress, marketsArr, mainNetWeb3, onlyPrice) {
    const startTime = new Date().getTime()
    log.info(`load all market data|start`)
    log.info(`muticall|start`)
    await FetchData.callContract(web3, connectedAddress, networkType, mainNetWeb3)
    log.info(`muticall|end|${(new Date().getTime() - startTime) / 1000}秒`)
    FetchData.clearMarketDataCache()
    await FetchData.cacheAllMarketData(web3, networkType, connectedAddress, marketsArr)
    const promises = []
    for (let market of marketsArr) {
        promises.push(loadMarketData(web3, networkType, connectedAddress, market, onlyPrice))
    }
    const dataTree = await Promise.all(promises)

    if (!onlyPrice) {
        await Promise.all([
        FetchData.getTotalSavingsBalance(web3, connectedAddress, networkType, marketsArr)
            .then(async (response) => {
            dataTree.totalSavingsBalance = response
            }),
        FetchData.getTotalBorrowLimit(marketsArr)
            .then(response => {
            dataTree.totalBorrowLimitFiat = response
            }),
        FetchData.getTotalBizSize(marketsArr)
            .then(response => {
            dataTree.totalBizSize = response.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            }),
        FetchData.getTotalTVL(marketsArr)
            .then(response => {
            dataTree.totalTVLFiat = response.totalTVLFiat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            }),
        FetchData.getTotalLoanBalance(web3, connectedAddress, networkType, marketsArr)
            .then(response => {
            dataTree.totalLoanBalance = response
            }),
        FetchData.getTotalSavingsAPY(web3, connectedAddress, networkType, marketsArr)
            .then(response => {
            dataTree.totalSavingsAPY = response
            }),
        FetchData.getTotalLoanAPY(web3, connectedAddress, networkType, marketsArr)
            .then(response => {
            dataTree.totalLoanAPY = response
            }),
        FetchData.getAccountLiquidity(web3, connectedAddress, networkType)
            .then(response => {
            dataTree.accountLiquidity = response.inETH
            dataTree.accountLiquidityInFiat = response.inFiat
            }),
        FetchData.getTransactionLimit(web3, connectedAddress, networkType, mainNetWeb3)
            .then(response => {
            dataTree.transactionLimit = response
            }),
        GovernanceData.getCompBalanceWithAccrued(web3, connectedAddress, networkType)
            .then(response => {
            dataTree.compBalance = response.balance
            dataTree.compSymbol = response.symbol
            dataTree.compAccrued = response.accrued
            })
        ]);
    }

    const endTime = new Date().getTime()
    log.info(`load all market data|end|${(endTime - startTime) / 1000}秒`)
    return dataTree
}

async function loadMarketData(web3, networkType, connectedAddress, market, onlyPrice) {
    const startTime = new Date().getTime()
    log.info(`${market.name}|start`)

    let requests = null;
    if (onlyPrice) {
        requests = [FetchData.getPrice(web3, networkType, market).then(response => {
        market.price = response
        })];
    } else {
        requests = [
        FetchData.getApyRate(web3, networkType, market)
            .then(response => {
            market.savingsAPY = response.savingsAPY
            market.loanAPY = response.loanAPY
            market.savingsMintAPY = response.savingsMintAPY
            market.loanMintAPY = response.loanMintAPY
            }),
        FetchData.getWalletBalance(web3, connectedAddress, networkType, market)
            .then(response => {
            market.walletBalance = response.walletBalance
            market.walletBalanceFormatted = response.walletBalanceFormatted
            market.walletBalanceFiat = response.walletBalanceFiat
            }),
        FetchData.getLiquidityBalance(web3, networkType, market)
            .then(response => {
            market.liquidity = response.liquidity
            market.liquidityFormatted = response.liquidityFormatted
            market.liquidityFiat = response.liquidityFiat
            }),
        FetchData.getTotalBorrowed(web3, networkType, market)
            .then(response => {
            market.totalBorrowed = response.totalBorrowed
            market.totalBorrowedFormatted = response.totalBorrowedFormatted
            market.totalBorrowedFiat = response.totalBorrowedFiat
            }),
        FetchData.getTotalSupply(web3, networkType, market)
            .then(response => {
            market.totalSupply = response.totalSupply
            market.totalSupplyFormatted = response.totalSupplyFormatted
            market.totalSupplyFiat = response.totalSupplyFiat
            market.utilRate = response.utilRate
            }),
        FetchData.getSavingsBalance(web3, connectedAddress, networkType, market)
            .then(response => {
            market.savingsBalance = response.savingsBalance
            market.savingsBalanceFormatted = response.savingsBalanceFormatted
            market.savingsBalanceFiat = response.savingsBalanceFiat
            market.savingsCTokenBalance = response.savingsCTokenBalance
            }),
        FetchData.getLoanBalance(web3, connectedAddress, networkType, market)
            .then(response => {
            market.loanBalance = response.loanBalance
            market.loanBalanceFormatted = response.loanBalanceFormatted
            market.loanBalanceFiat = response.loanBalanceFiat
            }),
        FetchData.checkMembership(web3, connectedAddress, networkType, market)
            .then(response => {
            market.isAssetMember = response
            }),
        FetchData.checkMintPaused(web3, networkType, market).then(response => {
            market.isMintPaused = response
        }),
        FetchData.checkBorrowPaused(web3, networkType, market).then(response => {
            market.isBorrowPaused = response
        }),
        FetchData.getPrice(web3, networkType, market).then(response => {
            market.price = response
        }),
        FetchData.getAccountAllowance(web3, connectedAddress, networkType, market).then(response => {
            if (CoreData.isNativeToken(market.symbol, networkType)) {
            market.approved = true
            } else {
            market.approved = response.allowance !== 0
            }
        }),
        FetchData.getSwapRepayAllowance(web3, connectedAddress, networkType, market).then(response => {
            if (CoreData.isNativeToken(market.symbol, networkType)) {
            market.swapRepayApproved = true
            } else {
            market.swapRepayApproved = response.allowance !== 0
            }
        }),
        FetchData.getDepositRepayAllowance(web3, connectedAddress, networkType, market).then(response => {
            market.depositRepayApproved = response.allowance !== 0
        }),
        FetchData.getDepositSwapAllowance(web3, connectedAddress, networkType, market).then(response => {
            market.depositSwapApproved = response.allowance !== 0
        }),
        FetchData.getCollateralStatus(web3, connectedAddress, networkType, market).then(response => {
            market.collateralStatus = response
        })
        ];
    }
    await Promise.all(requests);

    await FetchData.getBorrowLimit(web3, networkType, market)
        .then(response => {
        market.borrowLimit = response.borrowLimit
        market.borrowLimitFormatted = response.borrowLimitFormatted
        market.borrowLimitFiat = response.borrowLimitFiat
        market.collateralFactor = response.collateralFactor
        })
    await FetchData.getLPData(web3, connectedAddress, networkType, market)
        .then(response => {
        market.mdxReward = response.mdxReward
        market.fildaReward = response.fildaReward
        market.mdxAPY = response.mdxAPY
        market.fildaAPY = response.fildaAPY
        market.lpTotalAPY = response.lpTotalAPY
        })
    const endTime = new Date().getTime()
    log.info(`${market.name}|end|${(endTime - startTime) / 1000}秒`)
    return market
}


function Banking() {
    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3, readonlyWeb3, hecoMainNetWeb3 } = useContext(Web3Context)

    let marketsArr = FetchData.getNetworkMarkets(networkType)
    const [data, setData] = useState(marketsArr)
    const [showLoadAlertModal, setShowLoadAlertModal] = useState(false)
    const { t } = useTranslation()

    const handleClose = () => {
        setShowLoadAlertModal(false)
    }

    useEffect(() => {
        let pollTimer = null
        let isUnMounted = false
    
        async function initialLoad() {
          let fetching = false
          async function loadData() {
            if (!fetching && connectedAddress && networkType && networkType !== "unsupported" && readonlyWeb3 && marketsArr) {
              try {
                fetching = true
                const dataTree = await loadAllMarketData(readonlyWeb3, networkType, connectedAddress, marketsArr, hecoMainNetWeb3)
                dataTree.loading = false
    
                if (!isUnMounted) {
                  setData(data => dataTree)
                }
              } catch (e) {
                log.error('Error to load markets data:', e)
              } finally {
                fetching = false
              }
            }
          }
    
    
          const polling = () => {
            if (!isUnMounted) {
              clearTimeout(pollTimer)
              pollTimer = setTimeout(() => {
                loadData()
                polling()
              }, 5000)
            }
          }
    
          try {
            const { promiseOrTimeout, timeoutId } = promiseWithTimeout(loadData())
            await promiseOrTimeout.then(() => {
              polling()
            }).finally(() => {
              clearTimeout(timeoutId)
            })
          } catch (e) {
            setShowLoadAlertModal(true)
            isUnMounted = true
            clearTimeout(pollTimer)
          }
        }
    
        initialLoad()
    
        return () => {
          isUnMounted = true
          setData(data => marketsArr)
          clearTimeout(pollTimer)
        }
    }, [connectedAddress, networkType])

  return (
    <div className="Banking">
      <BrowserRouter>
        {/* <Disconnected /> */}
        <Dashboard data={data} />
        {
            data.length > 0 ? (
                <div>
                    <Accounts data={data} />
                    <Pending data={data} />
                </div>
            ) : ''
        }
      </BrowserRouter>
    </div>
  );
}

export default Banking;
