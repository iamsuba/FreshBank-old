import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal, Nav } from 'react-bootstrap'
import styles from './Dashboard.module.scss'
import { PieChart } from 'react-minimal-pie-chart'

const defaultLabelStyle = {
    fontSize: '0.4em',
    fill: '#797992'
}

function Dashboard() {

    return (
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
                            {title: 'Used', value: 12.5, color: '#1B56D0'},
                        ]}
                        labelStyle={defaultLabelStyle}
                        label={({ dataEntry }) => dataEntry.value + '% Loan used'}
                        labelPosition={0}
                    />
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.netApyContainer}>
                        <div className={styles.value}>9.28%</div>
                        <div className={styles.label}>NET APY</div>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.rewardsContainer}>
                        <div className={styles.label}>Filda Earned</div>
                        <div className={styles.value}>153.89337599 FIL</div>
                        <Button className={styles.collectButton} variant="primary" size="sm">Collect</Button>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.savingsContainer}>
                        <div className={styles.label}>Savings Balance</div>
                        <div className={styles.value}>$8473.89</div>
                        <div className={styles.apy}>Interest APY 8.33%</div>
                    </div>
                </div>
                <div className={styles.dashboardItem}>
                    <div className={styles.loanContainer}>
                        <div className={styles.label}>Loan Balance</div>
                        <div className={styles.value}>$8473.89</div>
                        <div className={styles.apy}>Interest APY 8.33%</div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Dashboard