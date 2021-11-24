import React, { useContext, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import styles from './Pending.module.scss'
import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt, FaTelegram, FaGithub  } from 'react-icons/fa'
import EthereumLogo from '../images/markets/eth.svg'
import LoadingIcon from '../images/loading.svg'
import CoreData from '../methods/CoreData'
import { NetworkTypeContext } from '../context'

function Pending(props) {

    const { networkType } = useContext(NetworkTypeContext)

    const { t } = useTranslation()

    const PendingDeposits = props.data.map((market, i) => {
        return (
            market.depositTxnHash == null ? '' : 
            <Row className={styles.pendingItemRow} key={market.symbol}>
                <Col md={3} className={styles.nameContainer}>
                <img
                    src={market.logo}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                <div className={styles.text}>{market.name}</div>
                </Col>
                <Col md={5} className={styles.loadingContainer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>{t('Pending.DepositInProgress')}</div>
                </Col>
                <Col md={4} className={styles.actionContainer}>
                    <FaExternalLinkAlt className={styles.icon} />
                    <a className={styles.text} href={CoreData.getExplorerUrl(market.depositTxnHash, networkType)} target="_blank">
                        {t('Pending.ViewTransaction')}
                    </a>
                </Col>
            </Row>
        )
    })
    
    const PendingWithdrawals = props.data.map((market, i) => {
        return(
            market.withdrawTxnHash == null ? '' : 
            <Row className={styles.pendingItemRow} key={market.symbol}>
                <Col md={3} className={styles.nameContainer}>
                <img
                    src={EthereumLogo}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                <div className={styles.text}>Ethereum</div>
                </Col>
                <Col md={5} className={styles.loadingContainer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>{t('Pending.WithdrawInProgress')}</div>
                </Col>
                <Col md={4} className={styles.actionContainer}>
                    <FaExternalLinkAlt className={styles.icon} />
                    <a className={styles.text} target="_blank">
                        View transaction
                    </a>
                </Col>
            </Row>
        )
    })

    const PendingBorrow = props.data.map((market, i) => {
        return (
            market.borrowTxnHash == null ? '' : 
            <Row className={styles.pendingItemRow} key={market.symbol}>
                <Col md={3} className={styles.nameContainer}>
                <img
                    src={market.logo}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                <div className={styles.text}>{market.name}</div>
                </Col>
                <Col md={5} className={styles.loadingContainer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>{t('Pending.BorrowInProgress')}</div>
                </Col>
                <Col md={4} className={styles.actionContainer}>
                    <FaExternalLinkAlt className={styles.icon} />
                    <a className={styles.text} href={CoreData.getExplorerUrl(market.borrowTxnHash, networkType)} target="_blank">
                        {t('Pending.ViewTransaction')}
                    </a>
                </Col>
            </Row>
        )
    })

    const PendingRepay = props.data.map((market, i) => {
        return (
            market.repayTxnHash == null ? '' : 
            <Row className={styles.pendingItemRow} key={market.symbol}>
                <Col md={3} className={styles.nameContainer}>
                <img
                    src={market.logo}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                <div className={styles.text}>{market.name}</div>
                </Col>
                <Col md={5} className={styles.loadingContainer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>{t('Pending.RepayInProgress')}</div>
                </Col>
                <Col md={4} className={styles.actionContainer}>
                    <FaExternalLinkAlt className={styles.icon} />
                    <a className={styles.text} href={CoreData.getExplorerUrl(market.repayTxnHash, networkType)} target="_blank">
                        {t('Pending.ViewTransaction')}
                    </a>
                </Col>
            </Row>
        )
    })

    const PendingLPRewards = props.data.map((market, i) => {
        return (
            market.isLPToken && market.lpRewardTxnHash && 
            <Row className={styles.pendingItemRow} key={market.symbol}>
                <Col md={3} className={styles.nameContainer}>
                <img
                    src={market.logo}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                <div className={styles.text}>{market.name}</div>
                </Col>
                <Col md={5} className={styles.loadingContainer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>{t('Pending.LPRewardInProgress')}</div>
                </Col>
                <Col md={4} className={styles.actionContainer}>
                    <FaExternalLinkAlt className={styles.icon} />
                    <a className={styles.text} href={CoreData.getExplorerUrl(market.lpRewardTxnHash, networkType)} target="_blank">
                        {t('Pending.ViewTransaction')}
                    </a>
                </Col>
            </Row>
        )
    })

    return (
        <div className={styles.pending}>
            <Container className={styles.pendingContainer}>
                {PendingDeposits}
                {PendingWithdrawals}
                {PendingBorrow}
                {PendingRepay}
                {PendingLPRewards}
            </Container>
        </div>
    )
}

export default Pending