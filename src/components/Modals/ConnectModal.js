import React, { useState } from 'react'
import { Container, Button, Modal, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import styles from './ConnectModal.module.scss'
import { FaCheckCircle, FaTelegram, FaGithub  } from 'react-icons/fa'
import LoadingIcon from '../../images/loading.svg'
import Logo from '../../images/logo.svg'
import metamask from '../../images/metamask.svg'
import walletconnectlogo from '../../images/walletconnect.svg'

function connectModal(props) {

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            aria-labelledby="example-custom-modal-styling-title"
            dialogClassName={styles.connectModal}
            animation={true}>
            <Container className={styles.connectModalContainer}>
                <div className={styles.headerContainer}>
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>
                            <img
                                src={Logo}
                                width="auto"
                                height="40"
                                className="d-inline-block align-top"
                                alt="Logo"
                                />
                        </div>
                        <div className={styles.description}>Please connect your wallet</div>
                    </div>
                    <div className={styles.closeButton} style={{ 'cursor': 'pointer' }} onClick={() => props.handleClose()}>x</div>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <Button
                            variant="light"
                            className={styles.tile}
                            onClick={props.handleMetaMask}>
                            <img
                                src={metamask}
                                width="auto"
                                height="72px"
                                className="d-inline-block align-top"
                                alt="Metamask Logo"
                            />
                            <div className={styles.title}>
                                MetaMask
                            </div>
                        </Button>
                        <Button
                            variant="light"
                            className={styles.tile}
                            onClick={props.handleWalletConnect}>
                            <img
                                src={walletconnectlogo}
                                width="auto"
                                height="72px"
                                className="d-inline-block align-top"
                                alt="Wallet Connect Logo"
                            />
                            <div className={styles.title}>
                                Wallet Connect
                            </div>
                        </Button>
                    </div>
                </div>
            </Container>
        </Modal>
    )
}

export default connectModal