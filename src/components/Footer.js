import React, { useState } from 'react'
import { Container, Row, Col, DropdownButton, Modal, Nav } from 'react-bootstrap'
import { icons } from 'react-icons'
import logo from '../images/logo.svg'
import styles from './Footer.module.scss'
import { FaTwitter, FaTelegram, FaGithub  } from 'react-icons/fa'
import { NavLink, useLocation } from 'react-router-dom'

function Footer() {

    let title = 'English'
    const items = [
        'French'
    ]

    return (
        <div className={styles.footer}>
            <Container>
                <Row>
                    <Col md={4} sm={12} className={styles.footerLeft}>
                        <DropdownButton
                            className={styles.dropdown}
                            key="up"
                            id="language-selector"
                            drop="up"
                            variant="savings"
                            title={title}>
                            {items}
                        </DropdownButton>
                        <div className={styles.links}>
                            <a href="" target="_blank">About</a>
                            <a href="" target="_blank">Forums</a>
                            <a href="" target="_blank">Protocol</a>
                        </div>
                    </Col>

                    <Col md={4} sm={12} className={styles.footerCenter}>
                        <FaTwitter className={styles.socialIcon} />
                        <FaTelegram className={styles.socialIcon} />
                        <FaGithub className={styles.socialIcon} />
                    </Col>

                    <Col md={4} sm={12} className={styles.footerRight}>
                        <div className="footerText">made by FilDA Team</div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer