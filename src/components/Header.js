import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Button, Modal, Nav } from 'react-bootstrap'
import { icons } from 'react-icons'
import logo from '../images/logo.svg'
import metamask from '../images/metamask.svg'
import walletconnectlogo from '../images/walletconnect.svg'
import banking from '../images/banking.svg'
import staking from '../images/staking.svg'
import styles from './Header.module.scss'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { FaExclamationCircle } from 'react-icons/fa'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { WalletAddressContext, WalletTypeContext, NetworkTypeContext } from '../context'
import { useTranslation } from 'react-i18next'
import truncateMiddle from 'truncate-middle'
import { switchToWallet } from '../methods/Wallet';
import EthereumLogo from '../images/markets/eth.svg'
import LoadingIcon from '../images/loading.svg'
import ConnectModal from './Modals/ConnectModal'

function Header() {
    const { connectedAddress } = useContext(WalletAddressContext)
    const { walletType } = useContext(WalletTypeContext)
    const { networkType } = useContext(NetworkTypeContext)
    const [show, setShow] = useState(false);

    const { t, i18n } = useTranslation()

    const { pathname } = useLocation()

    const handleClose = () => setShow(false)
    const handleShow = () => {
        setShow(true)
    }

    const handleMetaMask = async () => {
        switchToWallet("metamask");
        handleClose()
    }

    const handleWalletConnect = async () => {
        switchToWallet("walletconnect");
        handleClose()
    }

    const testnetWarningMessage = !networkType ? (
        ''
    ) : (
        <div className={styles.networkStatus}>
            <IoInformationCircleSharp /> {t('Header.YouAreConnectedTo')}{' '}
            {networkType.replace(/^\w/, (c) => c.toUpperCase())} Network
        </div>
    )


    const noConnectedAccountsMessage = (
        <div className={styles.networkStatus}>
            <IoInformationCircleSharp /> {t('Header.ConnectWalletWarningMsg')}
        </div>
    )

    const renderConnectAddress = () => {
        return (
            <>
                {!connectedAddress || connectedAddress === '0x0000000000000000000000000000000000000000'
                    ? noConnectedAccountsMessage
                    : networkType !== 'main'
                        ? testnetWarningMessage
                        : ''}
            </>
        )
    }

    const renderConnectedLogo = () => {
        if (walletType === "metamask")
            return (<img src={metamask} className={styles.connectedLogo} />);
        else if (walletType === "walletconnect")
            return (<img src={walletconnectlogo} className={styles.connectedLogo} />);
    }

    const renderBtn = () => {
        return (
            <div>
                <Button variant="primary" onClick={handleShow}>
                    {
                        connectedAddress && connectedAddress !== '0x0000000000000000000000000000000000000000'
                        ? t('Header.ConnectedTo', {
                            address: truncateMiddle(
                                connectedAddress,
                                4,
                                3,
                                '...'
                            ),
                        })
                        : t('Header.ConnectYourWallet')
                    }
                </Button>
                {renderConnectedLogo()}
            </div>
        )
    }

    const renderNav = () => {
        return (
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
                        {t('Header.Nav.Lend')}
                    </NavLink>
                    <NavLink to="/staking" exact activeClassName={styles.active} className={styles.menuItem}>
                        <img
                            src={staking}
                            width="30"
                            height="auto"
                            className={styles.menuIcon}
                            alt="Staking"
                            />
                        {t('Header.Nav.Stake')}
                    </NavLink>
                </Nav>
            </div>
        )
    }

    return (
        <div className={styles.header}>
            <Container>
                <div className={styles.top}>
                    <Link to="/welcome">
                        <img
                            src={logo}
                            width="163"
                            height="auto"
                            className="d-inline-block align-top"
                            alt="Filda Logo"
                        />
                    </Link>
                    {renderConnectAddress()}
                    {renderBtn()}
                </div>
                {renderNav()}
            </Container>
            <ConnectModal
                show={show}
                handleClose={() => handleClose()}
                handleWalletConnect={() => handleWalletConnect()}
                handleMetaMask={() => handleMetaMask()}
            />
        </div>
    )
}

export default Header