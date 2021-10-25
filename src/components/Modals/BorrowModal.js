import React, { useState } from 'react'
import { Container, Button, Modal, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import styles from './BorrowModal.module.scss'
import { FaCheckCircle, FaTelegram, FaGithub  } from 'react-icons/fa'
import EthereumLogo from '../../images/markets/eth.svg'
import LoadingIcon from '../../images/loading.svg'

function BorrowModal(props) {

    const [inputValue, setInputValue] = useState('')

    const ApproveRequest = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>Deposit to savings account</div>
                <div className={styles.description}>All HRC20 tokens need an one time approval to allow deposits and repay</div>
            </div>
            <div className={styles.footer}>
                <Button variant="secondary">Approve</Button>
                <Button variant="outline-black" onClick={() => props.handleClose('deposit')}>Cancel</Button>
            </div>
        </div>

    const ApproveLoading = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>Deposit to savings account</div>
                <div className={styles.description}>All HRC20 tokens need an one time approval to allow deposits and repay</div>
            </div>
            <div className={styles.footer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>Approval in progress</div>
            </div>
        </div>

    const DepositForm = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>Deposit to savings account</div>
                <div className={styles.description}>Enter the amount to be deposited to your savings account</div>
                <Form >
                    <Form.Group controlId="formDeposit" className={styles.inputContainer}>
                        <Form.Control
                            className={styles.txnValue}
                            type="number"
                            placeholder={"0.00 " + 'ETH'}
                            autoComplete="off"
                            value={inputValue} />
                        <ToggleButtonGroup name="default-value-list" type="radio" className="default-value-btn-list">
                            <ToggleButton variant="outline-darkgrey" value={0.25} className="default-value-btn">25%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={0.5} className="default-value-btn">50%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={0.75} className="default-value-btn">75%</ToggleButton>
                            <ToggleButton variant="outline-darkgrey" value={1} className="default-value-btn" >100%</ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>
                </Form>
            </div>
            <div className={styles.footer}>
                <Button variant="secondary">Deposit</Button>
                <Button variant="outline-black" onClick={() => props.handleClose('deposit')}>Cancel</Button>
            </div>
        </div>

    const DepositLoading = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.title}>Deposit to savings account</div>
                <div className={styles.description}>The following amount will be deposited into your savings account</div>
                <div className={styles.finalValue}>5.00 ETH</div>
            </div>
            <div className={styles.footer}>
                <img
                    src={LoadingIcon}
                    width="auto"
                    height="18"
                    className="d-inline-block align-top"
                    alt="loading"
                    />
                <div className={styles.text}>Deposit in progress</div>
            </div>
        </div>
    
    const TxnSuccessMsg = 
        <div className={styles.contentContainer}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <FaCheckCircle />
                    <div className={styles.text}>Successfully deposited to your savings account</div>
                </div>
            </div>
            <div className={styles.footer}>
                <Button variant="secondary" onClick={() => props.handleClose('deposit')}>Close</Button>
            </div>
        </div>
    

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            aria-labelledby="example-custom-modal-styling-title"
            dialogClassName={styles.depositModal}
            animation={true}>
            <Container className={styles.depositModalContainer}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>
                        <img
                            src={EthereumLogo}
                            width="auto"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Logo"
                            />
                        <div className={styles.text}>Ethereum</div>
                    </div>
                    <div className={styles.closeButton} style={{ 'cursor': 'pointer' }} onClick={() => props.handleClose()}>x</div>
                </div>
                {/* {ApproveRequest} */}
                {/* {ApproveLoading} */}
                {/* {DepositForm} */}
                {/* {DepositLoading} */}
                {TxnSuccessMsg}
            </Container>
        </Modal>
    )
}

export default BorrowModal