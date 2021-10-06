import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal, Nav } from 'react-bootstrap'
import { icons } from 'react-icons'
import logo from '../images/logo.svg'
import banking from '../images/banking.svg'
import staking from '../images/staking.svg'
import styles from './Header.module.scss'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { NavLink, useLocation } from 'react-router-dom'

function Header() {
    return (
        <div className={styles.header}>
            <Container>
                <div className={styles.top}>
                    <a href="/">
                        <img
                            src={logo}
                            width="163"
                            height="auto"
                            className="d-inline-block align-top"
                            alt="Filda Logo"
                        />
                    </a>
                    <div className={styles.networkStatus}>
                        <IoInformationCircleSharp /> You are not connected to any network at the moment
                    </div>
                    <Button variant="primary">
                        Connect Wallet
                    </Button>
                </div>
                <div className={styles.bottom}>
                    <Nav defaultActiveKey="/banking">
                        <NavLink to="/" exact activeClassName={styles.active} className={styles.menuItem}>
                            <img
                                src={banking}
                                width="30"
                                height="auto"
                                className={styles.menuIcon}
                                alt="Banking"
                                />
                            Banking
                        </NavLink>
                        <NavLink to="/staking" exact activeClassName={styles.active} className={styles.menuItem}>
                            <img
                                src={staking}
                                width="30"
                                height="auto"
                                className={styles.menuIcon}
                                alt="Staking"
                                />
                            Staking
                        </NavLink>
                    </Nav>
                </div>
            </Container>
        </div>
    )
}

export default Header