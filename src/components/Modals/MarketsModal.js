import React, { useState, useContext, useCallback } from 'react'
import { Container, Button, Modal, Row, Col } from 'react-bootstrap'
import styles from './MarketsModal.module.scss'
import { FaExternalLinkAlt  } from 'react-icons/fa'
import ContentLoader from 'react-content-loader'
import { useTranslation } from 'react-i18next'
import FetchData from '../../methods/FetchData'
import log from '../../utils/logger'
import {useHistory} from 'react-router-dom';
import { WalletAddressContext } from '../../context'
import Variables from '../../variables.scss'
import SearchSuggest from '../../searchSuggest'

function MarketsModal(props) {

    const { connectedAddress } = useContext(WalletAddressContext)
    const [curList, setCurList] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [searchInputValue, setSearchInputValue] = useState('')

    let loading = props.data.loading === undefined ? true
                : connectedAddress === undefined ? true
                : props.data.loading
    
    const { t } = useTranslation();

    const setCurListData = (index, list=props.data) => {
        switch(index) {
          case 0:
            setCurList(list)
            break;
          case 1:
            setCurList(list.filter(item => !item?.isLPToken))
            setSearchInputValue('')
            break;
          case 2:
            setCurList(list.filter(item => item?.isLPToken))
            setSearchInputValue('')
            break;
          default:
            setCurList(list)
        }
      }
    
    const tabHandler = (index) => {
        setTabIndex(index)
        setCurListData(index)
    }

    const filterResult = (list, inputValue) => {
        if (inputValue !== '') {
          for (let [key, value] of Object.entries(props.data)) {
            if (isNaN(parseInt(key))) {
              list[key] = value
            }
          }
    
          setCurListData(0, list)
          setTabIndex(0)
        } else {
          setCurListData(tabIndex)
        }
    
        setSearchInputValue(inputValue)
    }

    const MarketsLoading = 
        <ContentLoader
            height={200}
            width={"100%"}
            speed={1}
            backgroundColor={Variables.$LightGrey}
            foregroundColor={Variables.$MediumGrey}>
            {/* Only SVG shapes */}
            <rect x="0" y="20" rx="4" ry="4" width="100%" height="40" />
            <rect x="0" y="80" rx="4" ry="4" width="100%" height="40" />
            <rect x="0" y="140" rx="4" ry="4" width="100%" height="40" />
        </ContentLoader>

    const Markets = curList.map((market, i) => {
        return(
            <Row className={styles.marketRowItem} key={i}>
                <Col md={3} className={styles.nameContainer}>
                    <img
                        src={market.logo}
                        width="auto"
                        height="18"
                        className="d-inline-block align-top"
                        alt="Logo"
                        />
                    <div className={styles.text}>{market.name}</div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>
                        {(parseFloat(market.savingsAPY) + parseFloat(market.isLPToken ? market.lpTotalAPY : market.savingsMintAPY)).toFixed(2) + '%'}
                    </div>
                    <div className={styles.valueSmall}>
                        {parseFloat(market.savingsAPY).toFixed(2) + '%'} + {parseFloat(market.isLPToken ? market.lpTotalAPY : market.savingsMintAPY).toFixed(2) + '%'}
                    </div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>
                        {(parseFloat(market.loanAPY) - parseFloat(market.loanMintAPY)).toFixed(2) + '%'}
                    </div>
                    <div className={styles.valueSmall}>
                        {parseFloat(market.loanAPY).toFixed(2) + '%'} - {parseFloat(market.loanMintAPY).toFixed(2) + '%'}
                    </div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>
                        {FetchData.getCurrencyFormatted(market.liquidityFiat)}
                    </div>
                    <div className={styles.valueSmall}>
                        {parseFloat(market.liquidityFormatted).toFixed(2) + ' ' + market.symbol}
                    </div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>
                        {FetchData.getCurrencyFormatted(market.totalBorrowedFiat)}
                    </div>
                    <div className={styles.valueSmall}>
                        {parseFloat(market.totalBorrowedFormatted).toFixed(2) + ' ' + market.symbol}
                    </div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>
                        {FetchData.getCurrencyFormatted(market.totalSupplyFiat)}
                    </div>
                    <div className={styles.valueSmall}>
                        {parseFloat(market.totalSupplyFormatted).toFixed(2) + ' ' + market.symbol}                        
                    </div>
                </Col>
                <Col md={1} className={styles.valueContainer}>
                    <div className={styles.value}>54.11%</div>
                </Col>
                <Col md={3} className={styles.actionsContainer}>
                    <Button variant="secondary" size="sm" disabled={market.isMintPaused} onClick={(e) => props.toggleModal('markets', 'deposit', market, e)}>{t('Common.Deposit')}</Button>
                    <Button variant="primary" size="sm" disabled={market.isBorrowPaused || market.isLPToken} onClick={(e) => props.toggleModal('markets', 'borrow', market, e)}>{t('Common.Borrow')}</Button>
                </Col>
            </Row>
        )
    })

    const MarketHeader = 
        <Row className={styles.marketHeader}>
            <Col md={3} className={styles.name}>{t('Common.Assets')}</Col>
            <Col md={1} className={styles.value}>{t('Common.SavingsAPY')}</Col>
            <Col md={1} className={styles.value}>{t('Common.BorrowAPY')}</Col>
            <Col md={1} className={styles.value}>{t('Common.Liquidity')}</Col>
            <Col md={1} className={styles.value}>{t('Common.TotalBorrowed')}</Col>
            <Col md={1} className={styles.value}>{t('Common.TotalSupply')}</Col>
            <Col md={1} className={styles.value}>{t('Common.UtilRate')}</Col>
            <Col md={3} className={styles.actions}>Actions</Col>
        </Row>

    const renderSuggestion = suggestion => (
        <div className={styles.suggList}>
        <img
            className={styles.suggLogo}
            src={suggestion.logo}
            width={suggestion.isLPToken ? 36 : 18}
            height={18}
            alt={`${suggestion.symbol} logo`}
        />
        <span className={styles.suggName}>{suggestion.name}</span>
        </div>
    );

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
                <div className={styles.controlsContainer}>
                    <div className={styles.statsContainer}>
                        <div className={styles.item}>
                            <div className={styles.label}>Deposit & Loan</div>
                            <div className={styles.value}>$82.82</div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>Total value locked</div>
                            <div className={styles.value}>$81.36</div>
                        </div>
                    </div>
                    <div className={styles.filtersContainer}>
                        <div className={styles.tabsContainer}>
                            <Button variant="primary" size="sm" className={{[styles.isActive]: tabIndex === 0}} onClick={() => tabHandler(0)}>{t('Markets.AllAsset')}</Button>
                            <Button variant="primary" size="sm" className={{[styles.isActive]: tabIndex === 1}} onClick={() => tabHandler(1)}>{t('Markets.SingleAsset')}</Button>
                            <Button variant="primary" size="sm" className={{[styles.isActive]: tabIndex === 2}} onClick={() => tabHandler(2)}>{t('Markets.MDEXLP')}</Button>
                        </div>
                        <div className={styles.searchContainer}>
                            <SearchSuggest 
                                data={props.data} 
                                filterResult={filterResult}
                                placeholder={t('Common.SearchAssets')}
                                renderSuggestion={renderSuggestion}
                                searchInputValue={searchInputValue} />
                        </div>
                    </div>
                </div>
                {MarketHeader}
                {loading ? MarketsLoading : Markets}
            </Container>
        </Modal>
    )
}

export default MarketsModal