import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Web3 from 'web3'
import { walletTypeChangeRequest, createWalletConnectWeb3Provider, getActiveWalletType, setActiveWalletType } from './methods/Wallet';
import { LanguageContext, WalletAddressContext, WalletTypeContext, NetworkTypeContext, Web3Context, ReadonlyWeb3Context } from './context'
import log from './utils/logger'
import detectEthereumProvider from '@metamask/detect-provider'
import Config from './utils/config'
import { useTranslation } from 'react-i18next'
import logo from './images/logo.svg';
import './App.scss';
import Header from './components/Header'
import Footer from './components/Footer';
import Banking from './Banking';

function App() {

  const [connectedAddress, setConnectedAddress] = useState()
  const [walletType, setWalletType] = useState()
  const [networkType, setNetworkType] = useState()
  const [readonlyWeb3, setReadonlyWeb3] = useState()
  let [web3, setWeb3] = useState()
  const [language, setLanguage] = useState('en')
  const { t } = useTranslation();
  const [debug, setDebug] = useState();

  let hecoMainNetWeb3 = null;

  useEffect(() => {
    // Listen to new "connect with wallet xxx" requests from users.
    walletTypeChangeRequest.subscribe((walletKey) => {
        log.info("User wants to use another wallet:", walletKey);
        // Rebuild the web3 environment with that target wallet (metamask, wallet connect)
        updateWeb3Environment(walletKey);
    })

    setTimeout(async () => {
        updateWeb3Environment()
    }, 1500);

    // Get UI ready from persistent storage
    setWalletType(getActiveWalletType());
  }, []);

  /**
     * Tips to test the different wallets:
     * - With wallet connect:
     *      - Huobi wallet always shows white pages difficult to debug i ncase of error. Alpha Wallet shows better errors, easier to debug.
     * - force networkId to 296 in handleNetworkChanged, to simulate wrong network IDs returns by wallets sometimes and avoid crashes.
     */

    // If forcedWalletType is defined, this means we are switching to another wallet.
    // Otherwise, we are just restoring the web3 context.
    const updateWeb3Environment = async (forcedWalletType) => {
      try {
          log.info("Updating Web3 environment. Forced wallet type:", forcedWalletType);

          let walletType = forcedWalletType || getActiveWalletType();

          //console.log("walletType=", walletType);
          //console.log("Current web3:", web3);

          // Switching wallet type: force disconnecting the current wallet first.
          /* if (forcedWalletType && web3 && web3.currentProvider && web3.currentProvider.isWalletConnect) {
              log.info("Checking if a wallet connect session has to be disconnected first:", web3);
              // Kill wallet connect session
              if (web3.currentProvider.wc && web3.currentProvider.wc.connected) {
                  //log.info("Disconnecting from wallet connect with current web3 provider:", web3);
                  await web3.currentProvider.disconnect();
                  await web3.currentProvider.wc.killSession();
                  //log.info("Wallet connect disconnection complete");
              }

              setConnectedAddress(undefined);
          } */

          let provider, newWeb3;
          if (!walletType || walletType === "metamask") {
              log.info("Preparing to use wallet type: metamask");
              provider = await detectEthereumProvider({ /* mustBeMetaMask: true, */  silent: true, timeout: 5000 });
              if (provider) {
                  log.info("Detected metamask ethereum provider:", provider);
                  newWeb3 = new Web3(provider);
              }
              else {
                  log.info("No ethereum provider detected");
              }
          }
          else if (walletType === "walletconnect") {
              log.info("Preparing to use wallet type: walletconnect");
              provider = await createWalletConnectWeb3Provider();
              if (provider) {
                  newWeb3 = new Web3(provider);
                  log.info("Created web3 instance for wallet connect", newWeb3);

                  provider.on("disconnect", () => {
                      log.info("Wallet connect disconnection event from the wallet");
                      /* setActiveWalletType(null);
                      setWalletType(null);
                      handleAccountsChanged(['0x0000000000000000000000000000000000000000']); */
                      handleNotConnected();
                  });

                  // Small hack recommended by the wallet connect team
                  // to force custom client meta instead of html page title/description
                  provider.connector._clientMeta = Config.walletConnect.clientMeta;
              }
          }
          else {
              log.error("Unsupported wallet in use! " + walletType);

              // Try to repair the stored wallet - reset to nothing
              setActiveWalletType(null);
              setWalletType(null);
          }

          // Provider can be null in case there is no metamask plugin or wallet available.
          if (provider) {
              log.info("Using provider:", provider);

              web3 = newWeb3;
              setWeb3(newWeb3);

              log.info("Using Web3:", web3);

              let readonlyWeb3 = new Web3(newWeb3.currentProvider)
              setReadonlyWeb3(readonlyWeb3)

              provider.on('chainChanged', handleNetworkChanged)
              provider.on('accountsChanged', handleAccountsChanged)
              //provider.on('connected', ()=>{ console.log("PROVIDER CONNECTED") })
              //provider.on('disconnected', ()=>{ console.log("PROVIDER DISCONNECTED") })
              //provider.on('networkChanged', handleNetworkChanged)

              // Metamask has to be enabled only to request accounts permissions, the first time.
              // Wallet connect needs to be called every time to re-initialize the websocket connectivity.
              if (forcedWalletType && walletType === "metamask") {
                  log.info("Enabling Metamask provider");
                  await provider.request({ method: "eth_requestAccounts" });
              }
              else if (walletType === "walletconnect") {
                  log.info("Enabling Wallet connect provider");
                  await provider.enable();
              }

              await checkProviderChanges(newWeb3, provider);

              // After a successful connection initiated by user, save this choice to storage
              if (forcedWalletType) {
                  let accounts = await provider.request({ method: 'eth_accounts' });
                  if (accounts && accounts.length > 0) {
                      // Successfully connected
                      setActiveWalletType(forcedWalletType);
                      setWalletType(forcedWalletType);
                  }
              }
          }
          else {
              handleNotConnected();
          }
      } catch (e) {
          // Silently catch weird "User closed modal" exception from wallet connect
          if (e.message === "User closed modal") {
              console.warn(e.message);
          }
          else {
              throw e;
          }
      }
  }

  const handleNotConnected = async () => {
      // Use HECO as default network to query current data from chain (read only)
      // This way, visitors can see filda stats without a wallet.
      let web3 = getHecoMainNetWeb3();
      setWeb3(web3);
      setReadonlyWeb3(new Web3(web3.currentProvider));
      handleNetworkChanged(128)
      // No account connected:
      handleAccountsChanged(['0x0000000000000000000000000000000000000000']);
  }

  const handleNetworkChanged = (networkId) => {
      //networkId = 296 // TMP DEBUG
      const networkType = Config.chainIdMap[parseInt(networkId)] // parseInt() because the network sometimes comes as base-10, sometimes hex
      log.info("Network changed", Config.chainIdMap, networkId, networkType)
      if (networkType) {
          setNetworkType(networkType)
      } else {
          setNetworkType(t('App.Unsupported'))
      }
  }

  const handleAccountsChanged = (accounts) => {
      log.info("Accounts changed", accounts);
      if (!accounts || accounts.length === 0) {
          log.info('Please connect to your wallet.')
          // Possibly disconnecting from the active wallet - forget the active wallet type in local storage
          setActiveWalletType(null);
          setWalletType(null);

          handleNotConnected();
      } else if (accounts[0] !== connectedAddress) {
          setConnectedAddress(accounts[0])
      }
  }

  const checkProviderChanges = async (web3, provider) => {
      log.info("Checking provider changes");
      try {
          const [accounts, networkId] = await Promise.all([
              provider.request({ method: 'eth_accounts' }),
              provider.request({ method: 'eth_chainId' })
          ]);
          //setDebug("net change "+networkId)

          log.info("Checked provider changes and got accounts / chainID:", accounts, networkId);
          handleNetworkChanged(Number(networkId))
          let viewAccount = window.location.hash.substr(1)
          if (web3.utils.isAddress(viewAccount)) {
              accounts[0] = viewAccount
          }
          handleAccountsChanged(accounts)
      } catch (err) {
          log.error('handleEthereum error:', err)
          const accounts = await provider.enable()
          handleAccountsChanged(accounts)
          // setConnectedAddress('0x8d14592bfaC956eaa81919A21652045F846056Db')
      }
  }

  const getHecoMainNetWeb3 = _ => {
      if (!hecoMainNetWeb3) {
          let provider = new Web3.providers.HttpProvider(Config.rpcUrls[128]); // Heco mainnet
          hecoMainNetWeb3 = new Web3(provider);
      }

      return hecoMainNetWeb3;
  }

  return (

    <Web3Context.Provider value={{ web3, readonlyWeb3, hecoMainNetWeb3: getHecoMainNetWeb3() }}>
        <WalletTypeContext.Provider value={{ walletType }}>
            <NetworkTypeContext.Provider value={{ networkType }}>
                <WalletAddressContext.Provider value={{ connectedAddress }}>
                    <LanguageContext.Provider value={{ language, setLanguage }}>
                        <BrowserRouter>
                            <Header />
                            <div style={{ 'color': 'white' }}>{debug}</div>
                            <Switch className="appContent">
                                <Route exact path="/">
                                    <Banking />
                                </Route>
                                {/* <Route exact path="/staking">
                                    <Staking />
                                </Route> */}
                                <Suspense fallback={<div></div>}>
                                    <Route exact path="/welcome">
                                        <Banking />
                                    </Route>
                                </Suspense>
                            </Switch>
                            <Footer />
                        </BrowserRouter>
                    </LanguageContext.Provider>
                </WalletAddressContext.Provider>
            </NetworkTypeContext.Provider>
        </WalletTypeContext.Provider>
    </Web3Context.Provider>
  );
}

export default App;
