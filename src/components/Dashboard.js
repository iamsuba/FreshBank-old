import React, { useContext, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import styles from './Dashboard.module.scss'
import { PieChart } from 'react-minimal-pie-chart'
import { useTranslation } from 'react-i18next'
import ContentLoader from 'react-content-loader'
import FetchData from '../methods/FetchData'
import Config from '../utils/config'
//import ClaimModal from '../components/subComponents/ClaimModal'
import logo from '../images/logo.svg'
import { NetworkTypeContext, WalletAddressContext } from '../context'
import Variables from '../variables.scss'

const defaultLabelStyle = {
    fontSize: '0.4em',
    fill: '#797992'
}

function fixedNaN(number) {
    if (isNaN(number)) {
      return 0
    }
    return number
  }

function Dashboard(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const { networkType } = useContext(NetworkTypeContext)

    let loading = props.data.loading == undefined ? true
        : connectedAddress == undefined ? true
        : props.data.loading

    const { t } = useTranslation()
    let loanUsedPercent = ((parseFloat(props.data.totalLoanBalance) / parseFloat(props.data.totalBorrowLimitFiat)) * 100).toFixed(2)

    const [showClaimModal, setShowClaimModal] = useState(false)

    //TODO: Claim modal design pending
    const handleClaimClose = () => {
        setShowClaimModal(false)
    }
    const handleClaimShow = () => {
        setShowClaimModal(true)
    }

    const dashboardContent =
        <div className={styles.dashboard}>
            <Container className={styles.dashboardContainer}>
                <div className={styles.dashboardItem}>
                    <PieChart
                        className={styles.loanUsed}
                        viewBoxSize={[100, 100]}
                        startAngle={-90}
                        animate={true}
                        totalValue={100}
                        lineWidth={30}
                        background={'#DDDDE2'}
                        data={[
                            {title: 'Used', value: fixedNaN(loanUsedPercent).toString(), color: '#1B56D0'},
                        ]}
                        labelStyle={defaultLabelStyle}
                        label={({ dataEntry }) => dataEntry.value + '% Loan used'}
                        labelPosition={0}
                    />
                </div>

                {/* TODO: Not sure if net apy calculation is working */}
                <div className={styles.dashboardItem}>
                    <div className={styles.netApyContainer}>
                        <div className={styles.value}>{fixedNaN(parseFloat(props.data.totalNetAPY).toFixed(2))}%</div>
                        <div className={styles.label}>{t('Common.NetAPY')}</div>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.rewardsContainer}>
                        <div className={styles.label}>{t('Common.Unclaimed')}</div>
                        <div className={styles.value}>{parseFloat(props.data.compAccrued).toFixed(4)} {props.data.compSymbol ? (props.data.compSymbol).toUpperCase() : ''}</div>
                        {Number(props.data.compAccrued) === 0 ? (
                            <Button className={styles.collectButton} variant="primary" size="sm" disabled>{t('Header.Collect')}</Button>
                            ) : (
                            <Button className={styles.collectButton} variant="primary" size="sm" onClick={handleClaimShow}>{t('Header.Collect')}</Button>
                        )}
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.savingsContainer}>
                        <div className={styles.label}>{t('Common.SavingsBalance')}</div>
                        <div className={styles.value}>{FetchData.getCurrencyFormatted(props.data.totalSavingsBalance, 4)}</div>
                        <div className={styles.apy}>{t('Common.APY')} {fixedNaN(parseFloat(props.data.totalSavingsAPY).toFixed(2))}%</div>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.loanContainer}>
                        <div className={styles.label}>{t('Common.LoanBalance')}</div>
                        <div className={styles.value}>{FetchData.getCurrencyFormatted(props.data.totalLoanBalance, 4)}</div>
                        <div className={styles.apy}>{t('Common.APY')} {fixedNaN(parseFloat(props.data.totalLoanAPY).toFixed(2))}%</div>
                    </div>
                </div>
            </Container>
        </div>

    const dashboardLoading = 
        <div className={styles.dashboard}>
            <Container className={styles.dashboardContainer}>
                <div className={styles.dashboardItem}>
                    <ContentLoader
                        height={100}
                        speed={1}
                        width={150}
                        backgroundColor={Variables.$LightGrey}
                        foregroundColor={Variables.$MediumGrey}>
                            {/* Only SVG shapes */}
                            <rect x="0" y="15" rx="4" ry="4" width="150" height="40" />
                            <rect x="0" y="60" rx="3" ry="3" width="100" height="20" />
                    </ContentLoader>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.netApyContainer}>
                        <ContentLoader
                            height={70}
                            speed={1}
                            width={100}
                            backgroundColor={Variables.$LightGrey}
                            foregroundColor={Variables.$MediumGrey}>
                                {/* Only SVG shapes */}
                                <rect x="0" y="15" rx="4" ry="4" width="100" height="40" />
                        </ContentLoader>
                        <div className={styles.label}>NET APY</div>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.rewardsContainer}>
                        <div className={styles.label}>Filda Earned</div>
                        <ContentLoader
                            height={100}
                            speed={1}
                            width={150}
                            backgroundColor={Variables.$LightGrey}
                            foregroundColor={Variables.$MediumGrey}>
                                {/* Only SVG shapes */}
                                <rect x="0" y="15" rx="4" ry="4" width="150" height="40" />
                                <rect x="0" y="60" rx="3" ry="4" width="100" height="20" />
                        </ContentLoader>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.savingsContainer}>
                        <div className={styles.label}>Savings Balance</div>
                        <ContentLoader
                            height={100}
                            speed={1}
                            width={150}
                            backgroundColor={Variables.$LightGrey}
                            foregroundColor={Variables.$MediumGrey}>
                                {/* Only SVG shapes */}
                                <rect x="0" y="15" rx="4" ry="4" width="150" height="40" />
                                <rect x="0" y="60" rx="3" ry="4" width="100" height="20" />
                        </ContentLoader>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.loanContainer}>
                        <div className={styles.label}>Loan Balance</div>
                        <ContentLoader
                            height={100}
                            speed={1}
                            width={150}
                            backgroundColor={Variables.$LightGrey}
                            foregroundColor={Variables.$MediumGrey}>
                                {/* Only SVG shapes */}
                                <rect x="0" y="15" rx="4" ry="4" width="150" height="40" />
                                <rect x="0" y="60" rx="3" ry="4" width="100" height="20" />
                        </ContentLoader>
                    </div>
                </div>
            </Container>
        </div>

    return (
        loading ? dashboardLoading : dashboardContent
    )
}

export default Dashboard