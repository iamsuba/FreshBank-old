import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal, Nav, Tab, Form } from 'react-bootstrap'
import styles from './Accounts.module.scss'
import EthereumLogo from '../images/markets/eth.svg'
import { IoAddCircle } from 'react-icons/io5'
import { IoInformationCircleSharp } from 'react-icons/io5'
import MarketsModal from './Modals/MarketsModal'
import DepositModal from './Modals/DepositModal'

//Temporary
const SavingsAccountsList = [
    'Ethereum',
    'USDT',
    'FilDA',
    'Huobi'
]
const LoansAccountsList = [
    'Ethereum',
    'USDT',
    'FilDA'
]

function Accounts() {

    const [showMarketsModal, setShowMarketsModal] = useState(false)
    const [showDepositModal, setShowDepositModal] = useState(false)

    const handleClose = (mode) => {
        switch(mode) {
          case 'markets':
            setShowMarketsModal(false)
            break;
          case 'deposit':
            setShowDepositModal(false)
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
        }
      }

    const toggleModal = (closeMode, showMode) => {
        handleClose(closeMode)
        handleShow(showMode)
    }

    const SavingsEmpty = 
        <div className={styles.emptyContainer}>
            <IoInformationCircleSharp className={styles.icon} />
            <div className={styles.text}>You do not have any assets in your savings account</div>
            <div className={styles.subText}>Please add any asset to your savings account to interest</div>
            <Button variant="primary" className={styles.depositButton} onClick={() => handleShow('markets')}> <IoAddCircle /> Deposit asset</Button>
        </div>

    const SavingsAccounts = SavingsAccountsList.map(account => {
        return(
            <Col lg={3} md={4} sm={12} className={styles.accountCardContainer}>
                <div  className={styles.accountCard}>
                    <div className={styles.header}>
                        <img
                            src={EthereumLogo}
                            width="auto"
                            height="24"
                            alt="token logo"
                        />
                        <div className={styles.assetTitle}>{account}</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <div className={styles.label}>Collateral</div>
                            <div className={styles.value}>
                                <Form>
                                    <Form.Switch
                                        id="custom-switch"
                                    />
                                </Form>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>FilDA APY</div>
                            <div className={styles.value}>8.37%</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Interest APY</div>
                            <div className={styles.value}>17.99%</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Savings balance</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>$2,573.87</div>
                                <div className={styles.subValue}>0.75 ETH</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Wallet balance</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>$15483.84</div>
                                <div className={styles.subValue}>2.75 ETH</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <Button variant="primary" className={styles.footerButton}>Withdraw</Button>
                        <Button variant="secondary" className={styles.footerButton}>Deposit Swap</Button>
                    </div>
                </div>
            </Col>
        )
    })

    const LoansEmpty = 
        <div className={styles.emptyContainer}>
            <IoInformationCircleSharp className={styles.icon} />
            <div className={styles.text}>You do not have any active loans</div>
            <div className={styles.subText}>Please deposit any asset to your savings account, enable them as collateral and get a loan on any asset</div>
            <Button variant="secondary" className={styles.depositButton} onClick={() => handleShow('markets')}><IoAddCircle /> Borrow asset</Button>
        </div>

    const LoansAccounts = LoansAccountsList.map(account => {
        return(
            <Col lg={3} md={4} sm={12} className={styles.accountCardContainer}>
                <div  className={styles.accountCard}>
                    <div className={styles.header}>
                        <img
                            src={EthereumLogo}
                            width="auto"
                            height="24"
                            alt="token logo"
                        />
                        <div className={styles.assetTitle}>{account}</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <div className={styles.label}>FilDA APY</div>
                            <div className={styles.value}>8.37%</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Interest APY</div>
                            <div className={styles.value}>17.99%</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Loan balance</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>$2,573.87</div>
                                <div className={styles.subValue}>0.75 ETH</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Collateral value</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>$125.00</div>
                                <div className={styles.subValue}>0.05 ETH</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Wallet balance</div>
                            <div className={styles.valueContainer}>
                                <div className={styles.value}>$15483.84</div>
                                <div className={styles.subValue}>2.75 ETH</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.loansFooter}>
                        <Button variant="primary" className={styles.footerButton}>Repay</Button>
                        <div className={styles.footer}>
                            <Button variant="secondary" className={styles.footerButton}>Deposit Repay</Button>
                            <Button variant="secondary" className={styles.footerButton}>Swap Repay</Button>
                        </div>
                    </div>
                </div>
            </Col>
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

    const DepositAsset =  
        <Col lg={3} md={4} sm={12} className={styles.accountCardContainer}>
            <div className={styles.accountCard}>
                <div className={styles.emptyMessage}>
                    <IoAddCircle className={styles.icon} />
                    <div className={styles.message} style={{ 'cursor': 'pointer' }} onClick={() => handleShow('markets')}>Deposit an asset</div>
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
                                {/* {SavingsEmpty} */}
                                {SavingsAccounts}
                                {DepositAsset}
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane className={styles.tabContent} eventKey="loans">
                            <Row>
                                {/* {LoansEmpty} */}
                                {LoansAccounts}
                                {BorrowAsset}
                            </Row>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
            <MarketsModal 
                show={showMarketsModal}
                handleClose={() => handleClose('markets')}
                toggleModal={(closeMode, showMode) => toggleModal(closeMode, showMode)}
            />
            <DepositModal 
                show={showDepositModal}
                handleClose={() => handleClose('deposit')}
                toggleModal={(closeMode, showMode) => toggleModal(closeMode, showMode)}
            />
        </div>
    )
}

export default Accounts