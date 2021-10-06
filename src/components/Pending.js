import React, { useState } from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import styles from './Pending.module.scss'
import { FaExternalLinkAlt, FaTelegram, FaGithub  } from 'react-icons/fa'
import EthereumLogo from '../images/markets/eth.svg'
import LoadingIcon from '../images/loading.svg'

function Pending() {

    const PendingTransactionsTitle = 
        <div className={styles.title}>Pending transactions</div>

    const PendingDeposits = 
        <Row className={styles.pendingItemRow}>
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
            <div className={styles.text}>Deposit in progress</div>
            </Col>
            <Col md={4} className={styles.actionContainer}>
                <FaExternalLinkAlt className={styles.icon} />
                <a className={styles.text} target="_blank">
                    View transaction
                </a>
            </Col>
        </Row>
    
    const PendingWithdrawals = 
        <Row className={styles.pendingItemRow}>
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
              <div className={styles.text}>Deposit in progress</div>
            </Col>
            <Col md={4} className={styles.actionContainer}>
                <FaExternalLinkAlt className={styles.icon} />
                <a className={styles.text} target="_blank">
                    View transaction
                </a>
            </Col>
          </Row>

    return (
        <div className={styles.pending}>
            <Container className={styles.pendingContainer}>
                {PendingTransactionsTitle}
                {PendingDeposits}
                {PendingWithdrawals}
            </Container>
        </div>
    )
}

export default Pending