import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import styles from './Disconnected.module.scss'
import { FaTwitter, FaTelegram, FaGithub  } from 'react-icons/fa'
import ConnectIcon from '../images/connect.svg'
import ConnectWhiteIcon from '../images/connectWhite.svg'

function Disconnected() {

    return (
        <div className={styles.disconnected}>
            <Container className={styles.disconnectedMsgContainer}>
                <img
                    src={ConnectIcon}
                    width="auto"
                    height="64"
                    alt="token logo"
                />
                <div className={styles.message}>Please connect your wallet to start using FreshBank</div>
                <Button variant="primary" className={styles.connectButton}>
                    <img
                        src={ConnectWhiteIcon}
                        width="auto"
                        height="16"
                        alt="token logo"
                    />
                    <div className={styles.text}>Connect Wallet</div>
                </Button>
            </Container>
        </div>
    )
}

export default Disconnected