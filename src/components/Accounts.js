import React, {useContext, useState, useRef} from 'react'
import {Container, Nav, Tab, Row, Col, Button, Form, Modal, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap'
import styles from './Accounts.module.scss'
import EthereumLogo from '../images/markets/eth.svg'
import { IoAddCircle } from 'react-icons/io5'
import { IoInformationCircleSharp } from 'react-icons/io5'
import MarketsModal from './Modals/MarketsModal'
import DepositModal from './Modals/DepositModal'
import BorrowModal from './Modals/BorrowModal'
import RepayModal from './Modals/RepayModal'
import WithdrawModal from './Modals/WithdrawModal'
import DepositSwapModal from './Modals/DepositSwapModal'
import { useTranslation } from 'react-i18next'
import ContentLoader from 'react-content-loader'
import FetchData from '../methods/FetchData'
import CoreData from '../methods/CoreData'
import { FaExternalLinkAlt } from 'react-icons/fa'
import log from '../utils/logger'
import { NetworkTypeContext, WalletAddressContext, Web3Context } from '../context'
import BigNumber from 'bignumber.js'
import Variables from '../variables.scss'
import SwapRepayModal from './Modals/SwapRepayModal'

function Accounts(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)
    const { web3 } = useContext(Web3Context)
    const [selectMarketData, setSelectMarketData] = useState(props.data[0])

    const [showMarketsModal, setShowMarketsModal] = useState(false)
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showBorrowModal, setShowBorrowModal] = useState(false)
    const [showRepayModal, setShowRepayModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showSwapRepayModal, setShowSwapRepayModal] = useState(false)
    const [showDepositSwapModal, setShowDepositSwapModal] = useState(false)

    let loading = props.data.loading === undefined ? true
                : connectedAddress === undefined ? true
                : props.data.loading

    const handleClose = (mode) => {
        console.log("closing", mode)
        switch(mode) {
          case 'markets':
            setShowMarketsModal(false)
            break;
          case 'deposit':
            setShowDepositModal(false)
            break;
        case 'borrow':
            setShowBorrowModal(false)
            break;
        case 'repay':
            setShowRepayModal(false)
            break;
        case 'withdraw':
            setShowWithdrawModal(false)
            break;
        case 'swapRepay':
            setShowSwapRepayModal(false)
            break;
        case 'depositSwap':
            setShowDepositSwapModal(false)
            break;
        }
      }

    const handleShow = (mode) => {
        switch(mode) {
          case 'markets':
            setShowMarketsModal(true)
            break;
          case 'deposit':
            setShowDepositModal(true)
            break;
        case 'borrow':
            setShowBorrowModal(true)
            break;
        case 'repay':
            setShowRepayModal(true)
            break;
        case 'withdraw':
            setShowWithdrawModal(true)
            break;
        case 'swapRepay':
            setShowSwapRepayModal(true)
            break;
        case 'depositSwap':
            setShowDepositSwapModal(true)
            break;
        }
      }

    const toggleModal = (closeMode, showMode, marketData) => {
        setSelectMarketData(marketData)
        handleClose(closeMode)
        handleShow(showMode)
    }

    const handleRepay = (marketIndex) => {
        setSelectMarketData(props.data[marketIndex])
        handleShow('repay')
    }

    const handleSwapRepay = (marketIndex) => {
        setSelectMarketData(props.data[marketIndex])
        handleShow('swapRepay')
    }

    const handleWithdraw = (marketIndex) => {
        setSelectMarketData(props.data[marketIndex])
        handleShow('withdraw')
    }

    const handleDepositSwap = (marketIndex) => {
        setSelectMarketData(props.data[marketIndex])
        handleShow('depositSwap')
    }

    const { t } = useTranslation()

    const SavingsEmpty = 
        <div className={styles.emptyContainer}>
            <IoInformationCircleSharp className={styles.icon} />
            <div className={styles.text}>You do not have any assets in your savings account</div>
            <div className={styles.subText}>Please add any asset to your savings account to interest</div>
            <Button variant="primary" className={styles.depositButton} onClick={() => handleShow('markets')}> <IoAddCircle /> Deposit asset</Button>
        </div>

    const AccountsLoading = 
        <ContentLoader
            height={400}
            width={"100%"}
            speed={1}
            backgroundColor={Variables.$White}
            foregroundColor="#EEF2F9">
            {/* Only SVG shapes */}
            <rect x="0" y="20" rx="4" ry="4" width="100%" height="40" />
            <rect x="0" y="80" rx="4" ry="4" width="100%" height="20" />
            <rect x="0" y="120" rx="4" ry="4" width="100%" height="300" />
        </ContentLoader>
    
    const DepositAsset =  
        <Col lg={3} md={4} sm={12} className={styles.accountCardContainer}>
            <div className={styles.accountCard}>
                <div className={styles.emptyMessage}>
                    <IoAddCircle className={styles.icon} />
                    <div className={styles.message} style={{ 'cursor': 'pointer' }} onClick={() => handleShow('markets')}>Deposit an asset</div>
                </div>
            </div>
        </Col>


    const handleCollateral = () => {
        alert('Handle collateral not implemented')
    }

    const SavingsAccounts = props.data.map((market,i) => {
        const excludeSwapPairs = ["NEO", "HXTZ", "HBSV", "htELA", "HELA"]
        return(
            market.savingsBalance > 0 ?
            <Col lg={3} md={4} sm={12} className={styles.accountCardContainer} key={i}>
                <div  className={styles.accountCard}>
                    <div className={styles.header}>
                        <img
                            src={market.logo}
                            width="auto"
                            height="24"
                            alt="token logo"
                        />
                        <div className={styles.assetTitle}>{market.name}</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <div className={styles.label}>Collateral</div>
                            <div className={styles.value}>
                                <Form className={styles.collateralWrap}>
                                    <Form.Check
                                        type="switch"
                                        id={market.symbol + '-switch'}
                                        label=''
                                        checked={market.collateralStatus}
                                        onChange={() => handleCollateral(market)} />
                                </Form>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.APY')}</div>
                            <div className={styles.value}>{parseFloat(market.savingsAPY).toFixed(2) + '%'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.MintAPY')}</div>
                            <div className={styles.value}>{parseFloat(market.isLPToken ? market.lpTotalAPY : market.savingsMintAPY).toFixed(2) + '%'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.SavingsBalance')}</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>{FetchData.getCurrencyFormatted(market.savingsBalanceFiat)}</div>
                                <div className={styles.subValue}>{parseFloat(market.savingsBalanceFormatted).toFixed(4) + ' ' + market.symbol}</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.CollateralValue')}</div>
                            <div className={styles.value}>{market.collateralStatus ? FetchData.getCurrencyFormatted(new BigNumber(market.savingsBalanceFiat).multipliedBy(new BigNumber(market.collateralFactor)).toString()) : '$0'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.WalletBalance')}</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>{FetchData.getCurrencyFormatted(market.walletBalanceFiat)}</div>
                                <div className={styles.subValue}>{parseFloat(market.savingsBalanceFormatted).toFixed(4) + ' ' + market.symbol}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <Button variant="primary" className={styles.footerButton} onClick={() => handleWithdraw(i)}>{t('Common.Withdraw')}</Button>
                        <Button variant="secondary" className={styles.footerButton} onClick={() => handleDepositSwap(i)}>{t('Common.DepositSwap')}</Button>
                    </div>
                </div>
            </Col> : ''
        )
    })

    const LoansEmpty = 
        <div className={styles.emptyContainer}>
            <IoInformationCircleSharp className={styles.icon} />
            <div className={styles.text}>You do not have any active loans</div>
            <div className={styles.subText}>Please deposit any asset to your savings account, enable them as collateral and get a loan on any asset</div>
            <Button variant="secondary" className={styles.depositButton} onClick={() => handleShow('markets')}><IoAddCircle /> Borrow asset</Button>
        </div>

    const LoansAccounts = props.data.map((market, i) => {
        return(
            market.loanBalance > 0 ?
            <Col lg={3} md={4} sm={12} className={styles.accountCardContainer} key={i}>
                <div  className={styles.accountCard}>
                    <div className={styles.header}>
                        <img
                            src={market.logo}
                            width="auto"
                            height="24"
                            alt="Logo"
                        />
                        <div className={styles.assetTitle}>{market.name}</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.APY')}</div>
                            <div className={styles.value}>{parseFloat(market.loanAPY).toFixed(2) + '%'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.MintAPY')}</div>
                            <div className={styles.value}>{parseFloat(market.loanMintAPY).toFixed(2) + '%'}</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.LoanBalance')}</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>{'$' + parseFloat(market.loanBalanceFiat).toFixed(2)}</div>
                                <div className={styles.subValue}>{parseFloat(market.loanBalanceFormatted).toFixed(4) + ' ' + market.symbol}</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>{t('Common.WalletBalance')}</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>{'$' + parseFloat(market.walletBalanceFiat).toFixed(2)}</div>
                                <div className={styles.subValue}>{parseFloat(market.walletBalanceFormatted).toFixed(4) + ' ' + market.symbol}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.loansFooter}>
                        <Button variant="primary" className={styles.footerButton} onClick={() => handleRepay(i)}>Repay</Button>
                        <div className={styles.footer}>
                            <Button variant="secondary" className={styles.footerButton}>Deposit Repay</Button>
                            <Button variant="secondary" className={styles.footerButton} onClick={() => handleSwapRepay(i)}>{t('Common.SwapRepay')}</Button>
                        </div>
                    </div>
                </div>
            </Col> : ''
        )
    })

    const BorrowAsset =  
            <Col lg={3} md={4} sm={12} className={styles.accountCardContainer}>
                <div className={styles.accountCard}>
                    <div className={styles.emptyMessage}>
                        <IoAddCircle className={styles.icon} />
                        <div className={styles.message} style={{ 'cursor': 'pointer' }} onClick={() => handleShow('markets')}>Borrow an asset</div>
                    </div>
                </div>
            </Col>


    return(
        <div className={styles.accounts}>
            <Container>
                <Tab.Container id="accountsTabs" defaultActiveKey="savings">
                    <Nav  variant="tabs" className={styles.tabsTitleContainer}>
                        <Nav.Item>
                            <Nav.Link className={styles.tabTitle} eventKey="savings">Savings</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.tabTitle} eventKey="loans">Loans</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane className={styles.tabContent} eventKey="savings">
                            <Row>
                                {
                                    loading ? AccountsLoading
                                    : props.data.totalSavingsBalance > 0 ? SavingsAccounts
                                    : SavingsEmpty
                                }
                                {props.data.totalSavingsBalance > 0 ? DepositAsset : ''}
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane className={styles.tabContent} eventKey="loans">
                            <Row>
                                {
                                    loading ? AccountsLoading
                                    : props.data.totalSavingsBalance > 0 ? LoansAccounts
                                    : LoansEmpty
                                }
                                {props.data.totalLoanBalance > 0 ? BorrowAsset : ''}
                            </Row>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
            <MarketsModal 
                show={showMarketsModal}
                handleClose={() => handleClose('markets')}
                toggleModal={(closeMode, showMode, marketData) => toggleModal(closeMode, showMode, marketData)}
                data={props.data}
            />
            <DepositModal 
                show={showDepositModal}
                handleClose={() => handleClose('deposit')}
                data={selectMarketData}
            />
            <BorrowModal 
                show={showBorrowModal}
                handleClose={() => handleClose('borrow')}
                data={selectMarketData}
                accountLiquidityInFiat={props.data.accountLiquidityInFiat}
                totalBorrowLimitFiat={props.data.totalBorrowLimitFiat}
                totalLoanBalance={props.data.totalLoanBalance}
            />
            <RepayModal
                show={showRepayModal}
                handleClose={() => handleClose('repay')}
                data={selectMarketData}
            />
            <WithdrawModal
                show={showWithdrawModal}
                handleClose={() => handleClose('withdraw')}
                data={selectMarketData}
                totalBorrowLimitFiat={props.data.totalBorrowLimitFiat}
                totalLoanBalance={props.data.totalLoanBalance}
                accountLiquidityInFiat={props.data.accountLiquidityInFiat}
                totalSavingsBalance={props.data.totalSavingsBalance}
            />

            {/* <SwapRepayModal 
                show={showSwapRepayModal}
                handleClose={() => handleClose('swapRepay')}
                data={selectMarketData}
                allData={props.data} /> */}

            {/* <DepositSwapModal
                data={selectMarketData}
                allData={props.data}
                show={showDepositSwapModal}
                handleClose={() => handleClose("depositSwap")}
            /> */}
        </div>
    )
}

export default Accounts