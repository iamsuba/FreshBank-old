import React, { useState } from 'react'
import { Container, Button, Modal, Row, Col } from 'react-bootstrap'
import styles from './MarketsModal.module.scss'
import { FaExternalLinkAlt, FaTelegram, FaGithub  } from 'react-icons/fa'
import EthereumLogo from '../../images/markets/eth.svg'

const MarketsList = [
    'Ethereum',
    'USDT',
    'FilDA',
    'Huobi'
]

function MarketsModal(props) {

    const Markets = MarketsList.map(market => {
        return(
            <Row className={styles.marketRowItem}>
                <Col md={3} className={styles.nameContainer}>
                    <img
                        src={EthereumLogo}
                        width="auto"
                        height="18"
                        className="d-inline-block align-top"
                        alt="Logo"
                        />
                    <div className={styles.text}>{market}</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>137.36%</div>
                    <div className={styles.valueSmall}>137.36% + 0.00 %</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>218.84%</div>
                    <div className={styles.valueSmall}>218.84% + 0.00 %</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>$0</div>
                    <div className={styles.valueSmall}>0 ETH</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>$10.50 K</div>
                    <div className={styles.valueSmall}>4.39 ETH</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>$30.66 K</div>
                    <div className={styles.valueSmall}>11.34 ETH</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>54.11%</div>
                </Col>
                <Col md={3} className={styles.actionsContainer}>
                    <Button variant="secondary" size="sm" onClick={() => props.toggleModal('markets', 'deposit')}>Deposit</Button>
                    <Button variant="primary" size="sm">Borrow</Button>
                </Col>
            </Row>
        )
    })

    const MarketHeader = 
        <Row className={styles.marketHeader}>
            <Col md={3} className={styles.name}>Asset</Col>
            <Col md={1} className={styles.value}>Savings rate</Col>
            <Col md={1} className={styles.value}>Borrow cost</Col>
            <Col md={1} className={styles.value}>Liquidity</Col>
            <Col md={1} className={styles.value}>Total borrowed</Col>
            <Col md={1} className={styles.value}>Total supply</Col>
            <Col md={1} className={styles.value}>Utilization</Col>
            <Col md={3} className={styles.actions}>Actions</Col>
        </Row>

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            aria-labelledby="example-custom-modal-styling-title"
            dialogClassName={styles.markets}
            animation={true}>
            <Container className={styles.marketsContainer}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>Markets</div>
                    <div className={styles.closeButton} style={{ 'cursor': 'pointer' }} onClick={() => props.handleClose()}>x</div>
                </div>
                {MarketHeader}
                {Markets}
            </Container>
        </Modal>
    )
}

export default MarketsModal