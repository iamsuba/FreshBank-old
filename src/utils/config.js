import eth from '../images/markets/eth.svg'
import ela from '../images/markets/ela.svg'
import usdt from '../images/markets/usdt.svg'
import hfil from '../images/markets/hfil.svg'
import ht from '../images/markets/ht.svg'
import bnb from '../images/markets/bnb.png'
import husd from '../images/markets/husd.svg'
import hbtc from '../images/markets/hbtc.svg'
import heth from '../images/markets/heth.svg'
import hdot from '../images/markets/hdot.svg'
import hbch from '../images/markets/hbch.svg'
import hltc from '../images/markets/hltc.svg'
import hbsv from '../images/markets/hbsv.svg'
import hxtz from '../images/markets/hxtz.svg'
import neo from '../images/markets/neo.svg'
import aave from '../images/markets/aave.svg'
import uni from '../images/markets/uni.svg'
import snx from '../images/markets/snx.svg'
import mdx from '../images/markets/mdx.png'
import link from '../images/markets/link.svg'
import depthFilda from '../images/markets/depth_filda.svg'
import usdc from '../images/markets/usdc.svg'
import dai from '../images/markets/dai.svg'
import tusd from '../images/markets/tusd.png'
import matic from '../images/markets/matic.svg'
import hmatic from '../images/markets/hmatic.png'
import WHT_USDT from '../images/markets/WHT-USDT.svg'
import HBTC_USDT from '../images/markets/HBTC_USDT.svg'
import ETH_USDT from '../images/markets/ETH_USDT.svg'
import ETH_HBTC from '../images/markets/ETH_HBTC.svg'
import contractABI from './contractABI.json'
import QsMdxLPDelegate from './QsMdxLPDelegate.json'

const rpcUrls = {
    // TODO: add others
    20: "https://testnet.elastos.io/eth",           // Elastos mainnet
    21: "https://api-testnet.elastos.io/eth",       // Elastos testnet
    128: "https://heconode.ifoobar.com"             // HECO mainnet
}

const blockExplorers = {
    "main": "https://etherscan.io/tx/",
    "ropsten": "https://ropsten.etherscan.io/",
    "rinkeby": "https://rinkeby.etherscan.io/",
    "private": "https://explorer.elaeth.io/",
    "elamain": "https://explorer.elaeth.io/",
    "elatest": "https://testnet.elaeth.io/",
    "hecotest": "https://testnet.hecoinfo.com/",
    "heco": "https://hecoinfo.com/",
    bscTestnet: "https://testnet.bscscan.com/",
    bsc: "https://bscscan.com/",
    "matic": "https://polygonscan.com/"
}

const mdexUrls = {
    'FHT': 'https://info.mdex.me/#/pair/0x55542f696a3fecae1c937bd2e777b130587cfd2d',
    'FHUSD': 'https://info.mdex.me/#/pair/0x7964e55bbdaecde48c2c8ef86e433ed47fecb519',
    'FELA': 'https://info.mdex.me/#/pair/0xa1c540cfa848928299cdf309a251ebbaf666ce64',
    'HMDX': 'https://info.mdex.me/#/pair/0x1c85dD9E5FeE4c40786bd6278255D977946A364b'
}

//Only include the networks that are supported.
//Example: COMP contract is not available for Rinkeby. So dont't include that in this list.
//Networks not included in this list are categorized as unsupported networks
const chainIdMap = {
    // "1": "main",
    // "3": "ropsten",
    "1337": "private",
    // "20": "elamain",
    "21": "elatest",
    "256": "hecotest",
    "128": "heco",
    "97": "bscTestnet",
    "56": "bsc",
    "137": "matic"
}

const markets = {
    "Matic": {
        "name": "Matic",
        "symbol": "Matic",
        "logo": matic,
        "qToken": {
            "name": "Filda Matic",
            "symbol": "fMatic",
            "contract": "QMatic",
            "ABI": contractABI.qETH,
            "network": {
                "matic": {
                    "address": "0x9d81f4554E717f7054C1bfbB2f7c323389b116a5"
                }
            }
        }
    },
    "HUSDT": {
        "uiName": "Tether",
        "uiSymbol": "HUSDT",
        "name": "USD Tether",
        "symbol": "USDT",
        "ABI": contractABI.ERC20,
        "network": {
            "main": {
                "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
            },
            "ropsten": {
                "address": "0x516de3a7A567d81737e3a46ec4FF9cFD1fcb0136"
            },
            "rinkeby": {
                "address": "0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02"
            },
            "private": {
                "address": "0x3ca0ed169f474E431D5f5889C824DE1343D6ab7a"
            },
            "elatest": {
                "address": "0xa7daaf45ae0b2e567eb563fb57ea9cfffdfd73dd"
            }
        },
        "logo": usdt,
        "qToken": {
            "name": "Filda USDT Tether",
            "symbol": "fUSDT",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "main": {
                    "address": "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9"
                },
                "ropsten": {
                    "address": "0x135669c2dcBd63F639582b313883F101a4497F76"
                },
                "rinkeby": {
                    "address": "0x2fB298BDbeF468638AD6653FF8376575ea41e768"
                },
                "private": {
                    "address": "0x73372D41CE2936C8891C90B273613677968147FC"
                },
                "elatest": {
                    "address": "0x1551F44753147071c585169C621f45E0af920f31"
                }
            }
        }
    },
    "USDT": {
        "name": "USDT",
        "symbol": "USDT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xa71edc38d189767582c38a3145b5873052c3e47a"
            },
            "hecotest": {
                "address": "0x04F535663110A392A6504839BEeD34E019FdB4E0"
            },
            bscTestnet: {
                address: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd"
            },
            bsc: {
                address: "0x55d398326f99059ff775485246999027b3197955"
            },
            matic: {
                address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
            }
        },
        "logo": usdt,
        "qToken": {
            "name": "Filda USDT",
            "symbol": "fUSDT",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xAab0C9561D5703e84867670Ac78f6b5b4b40A7c1"
                },
                "hecotest": {
                    "address": "0x9f76E988eE3a0d5F13c9bd693F72CF8c203E3b9c"
                },
                bscTestnet: {
                    address: "0x26bCC2f4ff24e321542505b23e721870Bb1F36CF"
                },
                bsc: {
                    address: "0x12a3fE0bd2B86333E34671E92A2E66E614013562"
                },
                matic: {
                    address: "0xAb55dB8E2F7505C2191E7dDB5de5e266994A95b6"
                }
            }
        }
    },
    "BUSD": {
        "name": "BUSD ",
        "symbol": "BUSD",
        "ABI": contractABI.ERC20,
        "network": {
            bscTestnet: {
                address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee"
            },
            bsc: {
                address: "0xe9e7cea3dedca5984780bafc599bd69add087d56"
            }
        },
        "logo": usdt,
        "qToken": {
            "name": "Filda BUSD",
            "symbol": "fBUSD",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                bscTestnet: {
                    address: "0x757764B3daEB5e73C05654Ea922b6Ad23a6e0648"
                },
                bsc: {
                    address: "0x2a2EF6d5EEF3896578fD0Cf070E38d55e734Aa8E"
                }
            }
        }
    },
    "HUSD": {
        "name": "HUSD",
        "symbol": "HUSD",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x0298c2b32eae4da002a15f36fdf7615bea3da047"
            },
            // "hecotest": {
            //     "address": "0x9893efec0c06a5c82ed76a726d12ee469fe449d8"
            // }
        },
        "logo": husd,
        "qToken": {
            "name": "Filda HUSD",
            "symbol": "fHUSD",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xB16Df14C53C4bcfF220F4314ebCe70183dD804c0"
                },
                // "hecotest": {
                //     "address": "0x3CDd62735E3282D07f8bcD6bc3B1a55B5D28eddA"
                // }
            }
        }
    },
    "HT": {
        "name": "Huobi Token",
        "symbol": "HT",
        "logo": ht,
        "qToken": {
            "name": "Filda HT",
            "symbol": "fHT",
            "contract": "QHT",
            "ABI": contractABI.qETH,
            "network": {
                "hecotest": {
                    "address": "0x5e7033E6910575D6cc3B388133662f6B47Ec04e4"
                },
                "heco": {
                    "address": "0x824151251B38056d54A15E56B73c54ba44811aF8"
                }
            }
        }
    },
    "BNB": {
        "name": "BNB",
        "symbol": "BNB",
        "logo": bnb,
        "qToken": {
            "name": "Filda BNB",
            "symbol": "fBNB",
            "contract": "QHT",
            "ABI": contractABI.qETH,
            "network": {
                bscTestnet: {
                    address: "0xa557859AD20ccEeE646469baccC37b22caC1299a"
                },
                bsc: {
                    address: "0x824151251B38056d54A15E56B73c54ba44811aF8"
                }
            }
        }
    },
    "HBTC": {
        "uiName": "Bitcoin",
        "name": "HBTC",
        "symbol": "HBTC",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x66a79d23e58475d2738179ca52cd0b41d73f0bea"
            }
        },
        "logo": hbtc,
        "qToken": {
            "name": "Filda HBTC on Heco",
            "symbol": "fHBTC",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xF2a308d3Aea9bD16799A5984E20FDBfEf6c3F595"
                }
            }
        }
    },
    "WBTC": {
        "uiName": "Bitcoin",
        "name": "WBTC",
        "symbol": "WBTC",
        "ABI": contractABI.ERC20,
        "network": {
            "matic": {
                "address": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6"
            }
        },
        "logo": hbtc,
        "qToken": {
            "name": "Filda WBTC",
            "symbol": "fHBTC",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "matic": {
                    "address": "0x9d63046BF361c2351bcc6e939039AB97fCdeB885"
                }
            }
        }
    },
    "BTCB": {
        "name": "BTCB",
        "symbol": "BTCB",
        "ABI": contractABI.ERC20,
        "network": {
            bsc: {
                address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"
            }
        },
        "logo": hbtc,
        "qToken": {
            "name": "Filda BTCB on BSC",
            "symbol": "fBTCB",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                bsc: {
                    address: "0xb6B9B25C18a7fa951379538a988605478B5C0940"
                }
            }
        }
    },
    "HETH": {
        "uiName": "Ethereum",
        "name": "ETH on Huobi",
        "symbol": "HETH",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x64ff637fb478863b7468bc97d30a5bf3a428a1fd"
            }
        },
        "logo": heth,
        "qToken": {
            "name": "Filda ETH on Heco",
            "symbol": "fHETH",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x033F8C30bb17B47f6f1f46F3A42Cc9771CCbCAAE"
                }
            }
        }
    },
    "WETH": {
        "uiName": "Ethereum",
        "name": "WETH",
        "symbol": "WETH",
        "ABI": contractABI.ERC20,
        "network": {
            "matic": {
                "address": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
            }
        },
        "logo": heth,
        "qToken": {
            "name": "Filda ETH",
            "symbol": "fHETH",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "matic": {
                    "address": "0x4A256E7ba0Fb46e4C7fC111e7aE8Bee8e7a9D811"
                }
            }
        }
    },
    "BETH": {
        "name": "ETH",
        "symbol": "ETH",
        "ABI": contractABI.ERC20,
        "network": {
            bscTestnet: {
                address: "0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378"
            },
            bsc: {
                address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
            }
        },
        "logo": heth,
        "qToken": {
            "name": "Filda ETH on BSC",
            "symbol": "fETH",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                bscTestnet: {
                    address: "0x9Ddd36Ee5FAcFb03dA93A69859DaaA5e633ecB75"
                },
                bsc: {
                    address: "0x0c9Ee555F2c639999B7c96aeD55ACb5cFF4d4ba5"
                }
            }
        }
    },
    "ETH": {
        "name": "Ether",
        "symbol": "ETH",
        "logo": eth,
        "qToken": {
            "name": "Filda Ether",
            "symbol": "fETH",
            "contract": "QEther",
            "ABI": contractABI.qETH,
            "network": {
                "main": {
                    "address": "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
                },
                "ropsten": {
                    "address": "0xBe839b6D93E3eA47eFFcCA1F27841C917a8794f3"
                },
                "rinkeby": {
                    "address": "0xd6801a1dffcd0a410336ef88def4320d6df1883e"
                }
            }
        }
    },
    "TUSD": {
        "uiName": "TrueUSD",
        "name": "TUSD",
        "symbol": "TUSD",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x5eE41aB6edd38cDfB9f6B4e6Cf7F75c87E170d98"
            }
        },
        "logo": tusd,
        "qToken": {
            "name": "Filda TUSD on Heco",
            "symbol": "qTUSD",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xF173F3897753692E7465E0932fe2285707E7E609"
                }
            }
        }
    },
    "USDC": {
        "uiName": "USD Coin",
        "name": "USDC",
        "symbol": "USDC",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x9362bbef4b8313a8aa9f0c9808b80577aa26b73b"
            },
            bsc: {
                address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
            },
            matic: {
                address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
            }
        },
        "logo": usdc,
        "qToken": {
            "name": "Filda USDC",
            "symbol": "qUSDC",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x8C86799D402CD6D5d05FBb271f5f421f277C230d"
                },
                bsc: {
                    address: "0xAb55dB8E2F7505C2191E7dDB5de5e266994A95b6"
                },
                matic: {
                    address: "0xEDE060556E7F3d4C5576494490c70217e9e57826"
                }
            }
        }
    },
    "DAI": {
        "uiName": "Dai",
        "uiSymbol": "HDAI",
        "name": "DAI",
        "symbol": "DAI",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x3d760a45d0887dfd89a2f5385a236b29cb46ed2a"
            },
            matic: {
                "address": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"
            }
        },
        "logo": dai,
        "qToken": {
            "name": "Filda DAI on Heco",
            "symbol": "qDAI",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x3D7a2A68D00F117e9c3cFCfA9c1c1f73cB52baFc"
                },
                "matic": {
                    "address": "0x770318C1cFbe92B23ac09ef40B056d11Eb2d6b22"
                }
            }
        }
    },
    "MDX": {
        "uiName": "Mdex",
        "name": "MDX",
        "symbol": "MDX",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c"
            }
        },
        "logo": mdx,
        "qToken": {
            "name": "Filda MDX on Heco",
            "symbol": "fMDX",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x5788C014D41cA706DE03969E283eE7b93827B7B1"
                }
            }
        }
    },
    "HFIL": {
        "uiName": "Filecoin",
        "name": "Huobi FIL",
        "symbol": "HFIL",
        "ABI": contractABI.ERC20,
        "network": {
            "private": {
                "address": "0xE2f2C6119cFeAd4BDdBA64E7f876487ee1300d9A"
            },
            "elatest": {
                "address": "0xd3f1be7f74d25f39184d2d0670966e2e837562e3"
            },
            "heco": {
                "address": "0xae3a768f9ab104c69a7cd6041fe16ffa235d1810"
            }
        },
        "logo": hfil,
        "qToken": {
            "name": "Filda HFIL on Elastos",
            "symbol": "fHFIL",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "private": {
                    "address": "0x35508edCEc4b0bdC11f15fdf360dfbf8624F69AE"
                },
                "elatest": {
                    "address": "0x33B1B094360E5b5a3a7649Bed8145fb230898DB2"
                },
                "heco": {
                    "address": "0x043aFB65e93500CE5BCbf5Bbb41FC1fDcE2B7518"
                }
            }
        }
    },
    "HPT": {
        "name": "Huobi Pool Token",
        "symbol": "HPT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xe499ef4616993730ced0f31fa2703b92b50bb536"
            }
        },
        "logo": ht,
        "qToken": {
            "name": "Filda HPT on Heco",
            "symbol": "fHPT",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x749E0198f12559E7606987F8e7bD3AA1DE6d236E"
                }
            }
        }
    },
    "ELA": {
        "name": "Elastos",
        "symbol": "ELA",
        "logo": ela,
        "qToken": {
            "name": "Filda Elastos",
            "symbol": "fELA",
            "contract": "QElastos",
            "ABI": contractABI.qETH,
            "network": {
                "private": {
                    "address": "0x7b37C836A439661ce212Ac2EC096aE2582C52233"
                },
                "elatest": {
                    "address": "0x7eBEeAcaf6Dec5C85D992E4d15f18227E3695d97"
                }
            }
        }
    },
    "elaETH": {
        "name": "ETH on Elastos",
        "symbol": "elaETH",
        "ABI": contractABI.ERC20,
        "network": {
            "elatest": {
                "address": "0x23f1528e61d0af04faa7cff8c7ce9046d9130789"
            }
        },
        "logo": eth,
        "qToken": {
            "name": "Filda elaETH",
            "symbol": "felaETH",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "elatest": {
                    "address": "0x403AB093EB21Ae2C73bc1Eb23CCDB5a7c0bb1C80"
                }
            }
        }
    },
    "HDOT": {
        "uiName": "Polkadot",
        "name": "HDOT",
        "symbol": "HDOT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3"
            }
        },
        "logo": hdot,
        "qToken": {
            "name": "Filda HDOT on Heco",
            "symbol": "fHDOT",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xCca471B0d49c0d4835a5172Fd97ddDEA5C979100"
                }
            }
        }
    },
    "HBCH": {
        "uiName": "Bitcoin Cash",
        "name": "HBCH",
        "symbol": "HBCH",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xef3cebd77e0c52cb6f60875d9306397b5caca375"
            }
        },
        "logo": hbch,
        "qToken": {
            "name": "Filda HBCH on Heco",
            "symbol": "fHBCH",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x09e3d97A7CFbB116B416Dae284f119c1eC3Bd5ea"
                }
            }
        }
    },
    "HLTC": {
        "uiName": "Litecoin",
        "name": "HLTC",
        "symbol": "HLTC",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4"
            }
        },
        "logo": hltc,
        "qToken": {
            "name": "Filda HLTC on Heco",
            "symbol": "fHLTC",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x4937A83Dc1Fa982e435aeB0dB33C90937d54E424"
                }
            }
        }
    },
    "htELA": {
        "uiName": "Elastos",
        "uiSymbol": "ELA",
        "name": "ELA on Huobi",
        "symbol": "htELA",
        "ABI": contractABI.ERC20,
        "network": {
            "hecotest": {
                "address": "0x874f0618315fafd23f500b3a80a8a72148936f8e"
            },
            "heco": {
                "address": "0xa1ecfc2bec06e4b43ddd423b94fef84d0dbc8f5c"
            }
        },
        "logo": ela,
        "qToken": {
            "name": "Filda ELA",
            "symbol": "fELA",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "hecotest": {
                    "address": "0xDfca3136a4d7713Bb2ED3430a0611599d5cB53C5"
                },
                "heco": {
                    "address": "0x0AD0bee939E00C54f57f21FBec0fBa3cDA7DEF58"
                }
            }
        }
    },
    "HELA": {
        "uiName": "Elastos",
        "uiSymbol": "HELA",
        "name": "HELA",
        "symbol": "HELA",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x102A56E6c2452bcee99dF8f61167E3e0f0749dbE"
            }
        },
        "logo": ela,
        "qToken": {
            "name": "Filda ELA",
            "symbol": "fHELA",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xD14333706810Ba2a19Fc11aaE3931c09a6308ccd"
                }
            }
        }
    },
    "NEO": {
        "uiName": "Neo",
        "name": "NEO",
        "symbol": "NEO",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x6514a5ebff7944099591ae3e8a5c0979c83b2571"
            }
        },
        "logo": neo,
        "qToken": {
            "name": "Filda PNEO on Heco",
            "symbol": "fPNEO",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x92701DA6A28Ca70aA5Dfca2B8Ae2b4B8a22a0C11"
                }
            }
        }
    },
    "HBSV": {
        "uiName": "Bitcoin SV",
        "name": "HBSV",
        "symbol": "HBSV",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xc2cb6b5357ccce1b99cd22232942d9a225ea4eb1"
            }
        },
        "logo": hbsv,
        "qToken": {
            "name": "Filda HBSV on Heco",
            "symbol": "fHBSV",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x74F8D9B701bD4d8ee4ec812AF82C71EB67B9Ec75"
                }
            }
        }
    },
    "HXTZ": {
        "uiName": "Tezos",
        "name": "HXTZ",
        "symbol": "HXTZ",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x45e97dad828ad735af1df0473fc2735f0fd5330c"
            }
        },
        "logo": hxtz,
        "qToken": {
            "name": "Filda HXTZ on Heco",
            "symbol": "fHXTZ",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xfEA846A1284554036aC3191B5dFd786C0F4Db611"
                }
            }
        }
    },
    "AAVE": {
        "uiName": "Aave",
        "name": "AAVE",
        "symbol": "AAVE",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x202b4936fe1a82a4965220860ae46d7d3939bb25"
            },
            "matic": {
                "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B"
            }
        },
        "logo": aave,
        "qToken": {
            "name": "Filda AAVE on Heco",
            "symbol": "fAAVE",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x73Fa2931e060F7d43eE554fd1De7F61115fE1751"
                },
                "matic": {
                    "address": "0xd8DA16c621C75070786b205a28F3C0eCc29CD0cf"
                }
            }
        }
    },
    "UNI": {
        "uiName": "Uniswap",
        "uiSymbol": "HUNI",
        "name": "UNI",
        "symbol": "UNI",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x22c54ce8321a4015740ee1109d9cbc25815c46e6"
            }
        },
        "logo": uni,
        "qToken": {
            "name": "Filda UNI on Heco",
            "symbol": "fUNI",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0xAc9E3AE0C188eb583785246Fef37AEF9ea159fb7"
                }
            }
        }
    },
    "SNX": {
        "uiName": "Synthetix",
        "uiSymbol": "HSNX",
        "name": "SNX",
        "symbol": "SNX",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x777850281719d5a96c29812ab72f822e0e09f3da"
            }
        },
        "logo": snx,
        "qToken": {
            "name": "Filda SNX on Heco",
            "symbol": "fSNX",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x88962975FDE8C7805fE0f38b7c91C18f4d55bb40"
                }
            }
        }
    },
    "LINK": {
        "uiName": "Chainlink",
        "uiSymbol": "HLINK",
        "name": "LINK",
        "symbol": "LINK",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x9e004545c59d359f6b7bfb06a26390b087717b42"
            }
        },
        "logo": link,
        "qToken": {
            "name": "Filda LINK on Heco",
            "symbol": "qLINK",
            "contract": "QErc20",
            "ABI": contractABI.qERC20,
            "network": {
                "heco": {
                    "address": "0x9E6f8357bae44C01ae69df807208c3f5E435BbeD"
                }
            }
        }
    },
    "WHT-USDT": {
        "isLPToken": true,
        "name": "WHT-USDT",
        "symbol": "WHT-USDT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x499B6E03749B4bAF95F9E70EeD5355b138EA6C31"
            }
        },
        "logo": WHT_USDT,
        "qToken": {
            "name": "Filda WHT-USDT on Heco",
            "symbol": "qWHT-USDT",
            "contract": "QErc20",
            "ABI": QsMdxLPDelegate.abi,
            "network": {
                "heco": {
                    "address": "0x0c81DC01D4886ACeE14D0a0506C26D4B3525B0B1"
                }
            }
        }
    },
    "HBTC-USDT": {
        "isLPToken": true,
        "name": "HBTC-USDT",
        "symbol": "HBTC-USDT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0xfbe7b74623e4be82279027a286fa3a5b5280f77c"
            }
        },
        "logo": HBTC_USDT,
        "qToken": {
            "name": "Filda HBTC-USDT on Heco",
            "symbol": "qHBTC-USDT",
            "contract": "QErc20",
            "ABI": QsMdxLPDelegate.abi,
            "network": {
                "heco": {
                    "address": "0x5C7550bAf1E7373BD4965f2CF13dA2820CEbfe37"
                }
            }
        }
    },
    "ETH-USDT": {
        "isLPToken": true,
        "name": "ETH-USDT",
        "symbol": "ETH-USDT",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x78C90d3f8A64474982417cDB490E840c01E516D4"
            }
        },
        "logo": ETH_USDT,
        "qToken": {
            "name": "Filda ETH-USDT on Heco",
            "symbol": "qETH-USDT",
            "contract": "QErc20",
            "ABI": QsMdxLPDelegate.abi,
            "network": {
                "heco": {
                    "address": "0x8177CE98623a6f15939c4aDf02eA81852C7f3287"
                }
            }
        }
    },
    "ETH-HBTC": {
        "isLPToken": true,
        "name": "ETH-HBTC",
        "symbol": "ETH-HBTC",
        "ABI": contractABI.ERC20,
        "network": {
            "heco": {
                "address": "0x793c2a814e23ee38ab46412be65e94fe47d4b397"
            }
        },
        "logo": ETH_HBTC,
        "qToken": {
            "name": "Filda ETH-HBTC on Heco",
            "symbol": "qETH-HBTC",
            "contract": "QErc20",
            "ABI": QsMdxLPDelegate.abi,
            "network": {
                "heco": {
                    "address": "0xAfBFCbF4D52030CD9AB582d29182E706c0Cc7879"
                }
            }
        }
    },
}

//price feed contract not deployed on rinkeby
//We will be using an arbitrary price value
const priceOracle = {
    "ABI": contractABI.PriceOracle,
    "network": {
        "main": {
            "address": "0x922018674c12a7F0D394ebEEf9B58F186CdE13c1"
        },
        "ropsten": {
            "address": "0xe23874df0276AdA49D58751E8d6E088581121f1B"
        },
        "rinkeby": {
            "address": "0x5722A3F60fa4F0EC5120DCD6C386289A4758D1b2"
        },
        "private": {
            "address": "0xb833Cc1B7222022e473af358e35fcf339533d20B"
        },
        "elatest": {
            "address": "0x916dAbC2544287E6b1145DEe7976CF085E5EEa5b"
        },
        "hecotest": {
            "address": "0x0a6a06003417dA7BCF1C2bdc27e2A30C38EfF4Ad"
        },
        "heco": {
            "address": "0x0DDD1956278d80165051805f3B688EF3C4C288A3"
            //"address": "0xcaffe113e75efe0e12ac7a15d90b170726241b61" // The price oracle without link
        },
        bscTestnet: {
            address: "0xa9F16D95eE92167E27BD6171989Ec39a9d30031D"
        },
        bsc: {
            address: "0xe6ceCb03376443cec0CA4c1ABa2209e7a53C9352"
        },
        matic: {
            address: "0x2a2EF6d5EEF3896578fD0Cf070E38d55e734Aa8E"
        }
    }
}

const comptroller = {
    "ABI": contractABI.Comptroller,
    "network": {
        "main": {
            "address": "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
        },
        "ropsten": {
            "address": "0x54188bBeDD7b68228fa89CbDDa5e3e930459C6c6"
        },
        "rinkeby": {
            "address": "0x2EAa9D77AE4D8f9cdD9FAAcd44016E746485bddb"
        },
        "private": {
            "address": "0x0866c12B85AD8fca53f0f0918B5AA30286d39D62"
        },
        "elatest": {
            "address": "0x9bCDf73B28F9214f51f8722a32Bd96bfe4f16Fa6"
        },
        "hecotest": {
            "address": "0xAC75D749C1D0822ADCeB4a7d18DDEc4613C85EdA"
        },
        "heco": {
            "address": "0xb74633f2022452f377403B638167b0A135DB096d"
        },
        bscTestnet: {
            address: "0xB16Df14C53C4bcfF220F4314ebCe70183dD804c0"
        },
        bsc: {
            address: "0xb74633f2022452f377403B638167b0A135DB096d"
        },
        matic: {
            address: "0x0AD0bee939E00C54f57f21FBec0fBa3cDA7DEF58"
        }

    }
}

const COMP = {
    "ABI": contractABI.COMP,
    "network": {
        "main": {
            "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888"
        },
        "ropsten": {
            "address": "0x1fe16de955718cfab7a44605458ab023838c2793"
        },
        "private": {
            "address": "0x6d335bC74cE06722445eD534A1C5E63ed0dA8A6e"
        },
        "elatest": {
            "address": "0xd9e18828f29ac768ab3e1eebd3c3037efdef9e92"
        },
        "hecotest": {
            "address": "0x9d81f4554e717f7054c1bfbb2f7c323389b116a5"
        },
        "heco": {
            "address": "0xE36FFD17B2661EB57144cEaEf942D95295E637F0"
        }
    }
}

const governorAlpha = {
    "ABI": contractABI.GovernorAlpha,
    "network": {
        "main": {
            "address": "0xc0dA01a04C3f3E0be433606045bB7017A7323E38"
        },
        "ropsten": {
            "address": "0x93ACbA9ecaCeC21BFA09b0C4650Be3596713d747"
        }
    }
}

const compoundLens = {
    "ABI": contractABI.CompoundLens,
    "network": {
        "elatest": {
            "address": "0xFe6a82ddAfb400d734ccf57D5d7D1866fd97601f"
        },
        "hecotest": {
            "address": "0x46F27679e96CABEcb6d20A0332F6Aab19685E733"
        },
        "heco": {
            // "address": "0x350ccd36924fb6f0f5fd23e286206c95e6437280"
            "address": "0x49B12972b64E3E7a2CC579430A430fc06225aB1b"
        },
        bscTestnet: {
            // address: "0x9B861dc6a67Fe428B31D9A64471883e7E0EE1998"
            address: "0xe2724763C02Da7b2933ec8490D99Ae598bdb96d3"
        },
        bsc: {
            // address: "0xc5a806487e694D0eea9B413AD23EE37519b8cbAf"
            address: "0xd45e15f35cef6b7f97dbe03fc2c405359161c175"
        },
        matic: {
            address: "0xbd124869e76c94E74b7F24c5dFE5Ae7a77da8eba"
        }
    }
}

const maximillion = {
    "ABI": contractABI.Maximillion,
    "network": {
        "ropsten": {
            "address": "0xE0a38ab2951B6525C33f20D5E637Ab24DFEF9bcB"
        },
        "elatest": {
            "address": "0x39BB80913D2aeB0b1402A5566BdB6811217D4Fd1"
        },
        "hecotest": {
            "address": "0x32fbB9c822ABd1fD9e4655bfA55A45285Fb8992d"
        },
        "heco": {
            "address": "0x32fbB9c822ABd1fD9e4655bfA55A45285Fb8992d"
        },
        bscTestnet: {
            address: "0x80066F46552a8DeF13249FFF82085b4B6B748F59"
        },
        bsc: {
            address: "0x32fbB9c822ABd1fD9e4655bfA55A45285Fb8992d"
        },
        matic: {
            address: "0xE36FFD17B2661EB57144cEaEf942D95295E637F0"
        }
    }
}

const poolManager = {
    "ABI": contractABI.PoolManager,
    "network": {
        "elatest": {
            "address": "0x4cE5B72361262F852b434C8257EE079E7dD10bC7"
        },
        "heco": {
            "address": "0x0492E6060e71F5bED30B35D5238934066e31Bfc9"
        }
    }
}

const noMintRewardPool = {
    ABI: contractABI.NoMintRewardPool,
    dividendERC20ABI: contractABI.DividendERC20
}

const interestRateModel = {
    "ABI": contractABI.InterestRateModel
}

const mdex = {
    "ABI": contractABI.hecoPool,
    "address": "0xFB03e11D93632D97a8981158A632Dd5986F5E909",
    "factory": "0xb0b670fc1f7724119963018db0bfa86adb22d941",
    "hecoPoolPair": contractABI.hecoPoolPair,
    "reward": {
        "name": "MDX Token",
        "symbol": "MDX",
        "address": "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c"
    }
}

const dogeSwap = {
    "ABI": contractABI.dogeSwapPool,
    "address": "0xff58c937343d4fcf65c9c1aaf25f49559d95488e",
    "factory": "",
    "hecoPoolPair": contractABI.hecoPoolPair,
}

const pilot = {
    website: "https://p.td",
    "ABI": contractABI.pilotBank,
    "address": "0xD42Ef222d33E3cB771DdA783f48885e15c9D5CeD",
    "pTokenABI": contractABI.pTokenABI,
    "stakingRewardsFactory": {
        "ABI": contractABI.stakingRewardsFactory,
        "address": "0x2b5Fa4d7BDDE20227Fb5094973DbC67962D226C7"
    },
    "stakingRewards": {
        "ABI": contractABI.stakingRewardsABI,
        // "address": "0x2FB0487DC92e6E769F85ee159B4Cc7468Ce2D86f",
        "address": {
            // pToken -> staking rewards token
            "0xf0ff90029518909414914EF70de6E8E85bCBEba4": "0x86ffc35a3cd6f03A96558783fFA2e08C9D01cf05",
            "0x0a07E9Fa14a84406E75CE78ac814FDC106F00A97": "0x0a7a576fbe70a3E825d5271498Cc1F1fd812d84b",
            "0xFD52a2AB38dd92E61a615Fc1C40c2E841A4e8579": "0x4393b79828cFA6b3092B5539b514ba4325f21743",
            "0x72d4751991983B561Aa0e8003BA2e3eB07e9999C": "0x9CF14E13bAE5E22810915d573D795E0775085E19",
            "0xB8E9af54758BfDf0C686998AD59860268266Db73": "0x239354B34Ee43C38a7422Fb68db3734717305a8D"
        },
        "pairs": [
            {
                "pool": "HT",
                "token": {
                    "symbol": "HT",
                    "address": "0x0000000000000000000000000000000000000000",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHT v2",
                    "address": "0xBE36E5f7226A328dC1Fa899D8FfeC1ea216B8c98",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": ht
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x15F342232657208a17d09C99Bb7A758165145D7B"
                }
            },
            {
                "pool": "USDT",
                "token": {
                    "symbol": "USDT",
                    "address": "0xa71edc38d189767582c38a3145b5873052c3e47a",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pUSDT",
                    "address": "0x38C499dd2a14Af3b695901bcEC76961008BBC227",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": usdt
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x3a5B6EcD6174731E5D781794613E0f2F52eDbDD0"
                }
            },
            {
                "pool": "HBTC",
                "token": {
                    "symbol": "HBTC",
                    "address": "0x66a79d23e58475d2738179ca52cd0b41d73f0bea",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHBTC",
                    "address": "0xf0ff90029518909414914EF70de6E8E85bCBEba4",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": hbtc
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x86ffc35a3cd6f03A96558783fFA2e08C9D01cf05"
                }
            },
            {
                "pool": "MDX",
                "token": {
                    "symbol": "MDX",
                    "address": "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pMDX",
                    "address": "0x21AaF2b4973e8f437e45941b093b4149aB2513A6",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": mdx
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x2FB0487DC92e6E769F85ee159B4Cc7468Ce2D86f"
                }
            },
            {
                "pool": "HPT",
                "token": {
                    "symbol": "HPT",
                    "address": "0xe499ef4616993730ced0f31fa2703b92b50bb536",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHPT",
                    "address": "0x0a07E9Fa14a84406E75CE78ac814FDC106F00A97",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": ht
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x0a7a576fbe70a3E825d5271498Cc1F1fd812d84b"
                }
            },
            {
                "pool": "HUSD",
                "token": {
                    "symbol": "HUSD",
                    "address": "0x0298c2b32eae4da002a15f36fdf7615bea3da047",
                    "decimals": 8,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHUSD",
                    midToken: {
                        address: "0xFD52a2AB38dd92E61a615Fc1C40c2E841A4e8579",
                        ABI: contractABI.pTokenABI
                    },
                    realToken: {
                        address: "0x4d9EFcb0C28522fF736e76a6c6B1F795882b3d74",
                        ABI: contractABI.pTokenABI
                    },
                    address: "0x5Ee5Dbce6e1a7d0692DA579cC2594B0F5a8f56a1",
                    ABI: contractABI.HUSDConverter,
                    "decimals": 18,
                    "logo": husd
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    address: "0x28789379DEBc7b32892d6A5a0446BA355CfD56e5"
                }
            },
            {
                "pool": "HUSD",
                isHiddenFromInvest: true,
                "token": {
                    "symbol": "HUSD",
                    "address": "0x0298c2b32eae4da002a15f36fdf7615bea3da047",
                    "decimals": 8,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "xHUSD",
                    "address": "0xFD52a2AB38dd92E61a615Fc1C40c2E841A4e8579",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": husd
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x4393b79828cFA6b3092B5539b514ba4325f21743"
                }
            },
            {
                "pool": "HDOT",
                "token": {
                    "symbol": "HDOT",
                    "address": "0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHDOT",
                    "address": "0x72d4751991983B561Aa0e8003BA2e3eB07e9999C",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": hdot
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x9CF14E13bAE5E22810915d573D795E0775085E19"
                }
            },
            {
                "pool": "HLTC",
                "token": {
                    "symbol": "HLTC",
                    "address": "0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4",
                    "decimals": 18,
                    "ABI": contractABI.ERC20
                },
                "pToken": {
                    "symbol": "pHLTC",
                    "address": "0xB8E9af54758BfDf0C686998AD59860268266Db73",
                    ABI: contractABI.pTokenABI,
                    "decimals": 18,
                    "logo": hltc
                },
                "stakingRewards": {
                    "ABI": contractABI.stakingRewardsABI,
                    "address": "0x239354B34Ee43C38a7422Fb68db3734717305a8D"
                }
            }
        ]
    },
    "rewardToken": {
        "ABI": contractABI.ERC20,
        "decimals": 18,
        symbol: "PTD",
        "address": "0x52Ee54dd7a68e9cf131b0a57fd6015C74d7140E2"
    }
}

const solo = {
    website: "https://solo.top",
    "poolContract": {
        "ABI": contractABI.ISoloPool,
        "address": "0x1cF73836aE625005897a1aF831479237B6d1e4D2"
    },
    "reward": {
        "name": "MDX Token",
        "symbol": "MDX",
        "ABI": contractABI.ERC20,
        "decimals": 18,
        "address": "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c"
    },
    "pools": [
        {
            "name": "Heco-Peg HBTC Token",
            "alias": "HBTC",
            "symbol": "HBTC",
            "indexOfPool": 0,
            "decimals": 18,
            "logo": hbtc,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa"
        },
        {
            "name": "Heco-Peg ETH Token",
            "alias": "HETH",
            "symbol": "ETH",
            "indexOfPool": 1,
            "decimals": 18,
            "logo": eth,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0x64FF637fB478863B7468bc97D30a5bF3A428a1fD"
        },
        {
            "name": "Heco-Peg HDOT Token",
            "alias": "HDOT",
            "symbol": "HDOT",
            "indexOfPool": 2,
            "decimals": 18,
            "logo": hdot,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3"
        },
        {
            "name": "Heco-Peg USDT Token",
            "alias": "USDT",
            "symbol": "USDT",
            "indexOfPool": 3,
            "decimals": 18,
            "logo": usdt,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0xa71EdC38d189767582C38A3145b5873052c3e47a"
        },
        {
            "name": "MDX Token",
            "alias": "MDX",
            "symbol": "MDX",
            "indexOfPool": 5,
            "decimals": 18,
            "logo": mdx,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c"
        },
        {
            "name": "Wrapped HT",
            "alias": "HT",
            "symbol": "WHT",
            "indexOfPool": 6,
            "decimals": 18,
            "logo": ht,
            "ABI": contractABI.ERC20,
            "for": "MDX",
            "address": "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F"
        }
    ]
}

const soloBXH = {
    "poolContract": {
        "ABI": contractABI.ISoloPool,
        "address": "0xE1f39a72a1D012315d581c4F35bb40e24196DAc8"
    },
    "reward": {
        "name": "BXHToken",
        "symbol": "BXH",
        "ABI": contractABI.ERC20,
        "decimals": 18,
        "address": "0xcBD6Cb9243d8e3381Fea611EF023e17D1B7AeDF0"
    },
    "pools": [
        {
            "name": "BXHToken",
            "alias": "BXH",
            "symbol": "BXH",
            "indexOfPool": 0,
            "decimals": 18,
            "logo": usdt,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xcBD6Cb9243d8e3381Fea611EF023e17D1B7AeDF0"
        },
        {
            "name": "Heco-Peg USDTHECO Token",
            "alias": "USDT",
            "symbol": "USDTHECO",
            "indexOfPool": 1,
            "decimals": 18,
            "logo": usdt,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xa71EdC38d189767582C38A3145b5873052c3e47a"
        },
        {
            "name": "Heco-Peg HUSD Token",
            "alias": "HUSD",
            "symbol": "HUSD",
            "indexOfPool": 2,
            "decimals": 8,
            "logo": husd,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047"
        },
        {
            "name": "Heco-Peg ETH Token",
            "alias": "ETH",
            "symbol": "ETH",
            "indexOfPool": 3,
            "decimals": 18,
            "logo": eth,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0x64FF637fB478863B7468bc97D30a5bF3A428a1fD"
        },
        {
            "name": "Heco-Peg HBTC Token",
            "alias": "BTC",
            "symbol": "HBTC",
            "indexOfPool": 4,
            "decimals": 18,
            "logo": hbtc,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa"
        },
        {
            "name": "Heco-Peg HDOT Token",
            "alias": "DOT",
            "symbol": "HDOT",
            "indexOfPool": 5,
            "decimals": 18,
            "logo": hdot,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3"
        },
        {
            "name": "Heco-Peg HLTC Token",
            "alias": "HLTC",
            "symbol": "HLTC",
            "indexOfPool": 6,
            "decimals": 18,
            "logo": hltc,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4"
        },
        {
            "name": "Heco-Peg HFIL Token",
            "alias": "HFIL",
            "symbol": "HFIL",
            "indexOfPool": 7,
            "decimals": 18,
            "logo": hfil,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xae3a768f9aB104c69A7CD6041fE16fFa235d1810"
        },
        {
            "name": "Heco-Peg HPT Token",
            "alias": "HPT",
            "symbol": "HPT",
            "indexOfPool": 8,
            "decimals": 18,
            "logo": hfil,
            "ABI": contractABI.ERC20,
            "for": "BXH",
            "address": "0xE499Ef4616993730CEd0f31FA2703B92B50bB536"
        }
    ]
}

const depthFi = {
    pools: [
        {
            name: "HUSD - USDT",
            alias: "HUSD",
            logo: depthFilda,
            deposit: {
                address: "0xa7a0ea0c5d2257e44ad87d10db90158c9c5c54b3",//DepthFi V2
                ABI: contractABI.depthFiSwap,
                LENDING_PRECISION: 1e18,
                coins: [
                    {
                        address: "0xB16Df14C53C4bcfF220F4314ebCe70183dD804c0",
                        ABI: contractABI.depthFiERC20Delegator
                    },
                    {
                        address: "0xAab0C9561D5703e84867670Ac78f6b5b4b40A7c1",
                        ABI: contractABI.depthFiERC20Delegator
                    }
                ],
                tokens: [
                    {
                        symbol: "HUSD",
                        ABI: contractABI.ERC20,
                        decimals: 8,
                        indexOfPool: 0,
                        address: "0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047"
                    },
                    {
                        symbol: "USDT",
                        ABI: contractABI.ERC20,
                        decimals: 18,
                        indexOfPool: 1,
                        address: "0xa71EdC38d189767582C38A3145b5873052c3e47a"
                    }
                ]
            },
            staking: {
                poolContract: {
                    address: "0x59F8AD2495236B25BA95E3161154F0024fbDBDCe",
                    ABI: contractABI.depthFiStaking
                },
                LPToken: {
                    indexOfPool: 20,
                    symbol: "LP", //"DEP+fHUSD+fUSDT"
                    alias: "LP",
                    decimals: 18,
                    ABI: contractABI.ERC20,
                    address: "0xbB57158893F283972eB5bD093D715AbC7dd253A8"
                },
                reward: {
                    name: "Depth Token",
                    symbol: "DEP",
                    decimals: 18,
                    address: "0x48C859531254F25e57D1C1A8E030Ef0B1c895c27"
                },
            }
        }
    ]
}

const booster = {
    website: "https://booster.farm",
    actionPools: {
        ABI: contractABI.boosterActionPools,
        address: "0xf80af22dfE727842110AE295a08CDc9b4344430F"
    },
    staking: {
        address: "0xBa92b862ac310D42A8a3DE613dcE917d0d63D98c",
        ABI: contractABI.boosterBooPools
    },
    rewardToken: {
        symbol: "BOO",
        address: "0xff96dccf2763D512B6038Dc60b7E96d1A9142507",
        ABI: contractABI.ERC20,
        decimals: 18
    },
    fildaAsReward: {
        address: "0xE36FFD17B2661EB57144cEaEf942D95295E637F0",
        ABI: contractABI.ERC20,
        decimals: 18,
        symbol: "FILDA"
    },
    pools: [
        {
            name: "HBTC",
            symbol: "bofHBTC",
            logo: hbtc,
            indexOfPool: 0,
            address: "0x8aee98bC67777d220bD5DBE2d3ECb22d765dCD91",
            ABI: contractABI.boosterBox,
            decimals: 18,
            baseToken: {
                symbol: "HBTC",
                decimals: 18,
                ABI: contractABI.ERC20,
                address: "0x66a79d23e58475d2738179ca52cd0b41d73f0bea"
            }
        },
        {
            name: "HETH",
            symbol: "bofETH",
            logo: eth,
            indexOfPool: 1,
            address: "0xDD51428f162dcd92264b510D05B7c8bD276416Ba",
            ABI: contractABI.boosterBox,
            decimals: 18,
            baseToken: {
                symbol: "HETH",
                decimals: 18,
                ABI: contractABI.ERC20,
                address: "0x64FF637fB478863B7468bc97D30a5bF3A428a1fD"
            }
        },
        // {
        //     name: "WHT",
        //     symbol: "bofWHT",
        //     logo: ht,
        //     indexOfPool: 2,
        //     address: "0x53A83C2d5D3725dAe285EC85B58dD564d586F6b7",
        //     ABI: contractABI.boosterBox,
        //     decimals: 18,
        //     baseToken: {
        //         symbol: "HT",
        //         decimals: 18,
        //         ABI: contractABI.ERC20,
        //         address: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F",
        //         borrowingDisabled: true
        //     }
        // },
        {
            name: "USDT",
            symbol: "bofUSDT",
            logo: usdt,
            indexOfPool: 3,
            address: "0x0e908182AA6989be3Fe452DcF625127873f9231e",
            ABI: contractABI.boosterBox,
            decimals: 18,
            baseToken: {
                symbol: "USDT",
                decimals: 18,
                ABI: contractABI.ERC20,
                address: "0xa71EdC38d189767582C38A3145b5873052c3e47a"
            }
        },
        {
            name: "HUSD",
            symbol: "bofHUSD",
            logo: husd,
            indexOfPool: 4,
            ABI: contractABI.boosterBox,
            address: "0x485e75ed3083cc1c3016d08ea049538b24094620",
            decimals: 18,
            baseToken: {
                symbol: "HUSD",
                decimals: 8,
                ABI: contractABI.ERC20,
                address: "0x0298c2b32eae4da002a15f36fdf7615bea3da047"
            }
        },
        {
            name: "MDX",
            symbol: "bofMDX",
            logo: mdx,
            indexOfPool: 9,
            ABI: contractABI.boosterBox,
            address: "0xf6892A3F27ECeC71563dBD346E59d1FAB465336A",
            decimals: 18,
            baseToken: {
                symbol: "MDX",
                decimals: 18,
                ABI: contractABI.ERC20,
                address: "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c"
            }
        },
        {
            name: "HFIL",
            symbol: "bofHFIL",
            logo: hfil,
            indexOfPool: 8,
            ABI: contractABI.boosterBox,
            address: "0x71e64B55eB76c9c325952380219114AF52406Ca9",
            decimals: 18,
            baseToken: {
                symbol: "HFIL",
                decimals: 18,
                ABI: contractABI.ERC20,
                address: "0xae3a768f9aB104c69A7CD6041fE16fFa235d1810"
            }
        }
    ]
}

const uniswapPair = {
    "ABI": contractABI.IUniswapV2Pair,
    "network": {
        "heco": {
            "address": "0x7964E55BBdAECdE48c2C8ef86E433eD47FEcB519"
        }
    }
}

const multiCall = {
    "network": {
        "heco": {
            "address": "0x6Bd3A85Dfc401e81D31717EFf0b67D7931c265d2"
        },
        "hecotest": {
            "address": "0x8065392FC4c02B2aBf883FdDeC5545cEd0dd5f5c"
        },
        bscTestnet: {
            address: "0x83ABD561d9bad5c83d1329A08A6B2B13A1Efc506"
            // address: "0x65F1D649DF8B6DFe8b37c6138102Ff871e8FF3ee"
        },
        bsc: {
            address: "0xEDE060556E7F3d4C5576494490c70217e9e57826"
        },
        matic: {
            address: "0x8013bf6cA194d5160bdE9AA31f27D534edC8f950"
        }
    }
}

const erc20 = {
    "ABI": contractABI.ERC20
}

//These are temporary testnet addresses. Ideally these lists should be fetched from pool manager
const pools = {
    heco: {
        // "0x20dd3972824a0b010e476f31b497b3685d086d21": {
        //     "lpTokenName": "FilDA",
        //     "lpTokenSymbol": "Token",
        //     "lpTokenId": "FilDA-Airdrop"
        // },
        "0x7964E55BBdAECdE48c2C8ef86E433eD47FEcB519": {
            "pool": {
                "ABI": mdex.ABI,
                "address": "0xFB03e11D93632D97a8981158A632Dd5986F5E909"
            },
            "reward": {
                "name": "MDX Token",
                "symbol": "MDX",
                "address": "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c"
            },
            "lpTokenName": "Earn MDX with FilDA-HUSD",
            "lpTokenShortName": "FilDA-HUSD",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "FHUSD",
            "uiLpTokenId": "HUSD",
            "indexOfPool": 21,
            "isShortcut": true
        },
        "0xE1F2a76D1262a82bF3898c4ae72d9349eE58BACE": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0x2c241Cc053C88aB087651e251dD7bb54aF2b7EF6"
            },
            "lpTokenName": "FilDA-MDX",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "MDXFILDA",
            "uiLpTokenId": "MDX",
        },
        "0x2e9b38515c92A59C0d285b2213C474FE0eA33f33": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0xA1c540cFa848928299CDf309A251ebBaf666cE64"
            },
            "lpTokenName": "FilDA-ELA for MDEX",
            "uiLpTokenName": "FilDA-ELA",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "FELA",
            "uiLpTokenId": "ELA",
        },
        "0xB90CcE5307f0bE45ade28F45554e07A9a791A16F": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0x7964E55BBdAECdE48c2C8ef86E433eD47FEcB519"
            },
            "lpTokenName": "FilDA-HUSD for MDEX",
            "uiLpTokenName": "FilDA-HUSD",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "FHUSD",
            "uiLpTokenId": "HUSD"
        },
        "0xb0349442E12B6D8c91A3dB925F24e6E1f70E8d27": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0x55542f696a3fEcaE1C937Bd2e777B130587cFD2d"
            },
            "lpTokenName": "FilDA-HT for MDEX",
            "uiLpTokenName": "FilDA-HT",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "FHT",
            "uiLpTokenId": "HT",
        },
        "0xD27BC305eb29153509Ceb394A9F3553E468e5448": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0xda9a17507693a868ef4605e302687abbb485d3f0"
            },
            "lpTokenName": "FilDA-TUSD for HSWAP",
            "uiLpTokenName": "FilDA-TUSD",
            "lpTokenSymbol": "LP Token",
            "lpTokenId": "FTUSD",
            "uiLpTokenId": "TUSD",
        },
        // ELK
        "0xc29d038cdd513c6d73fb7dd144de951cbacac310": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0xE36FFD17B2661EB57144cEaEf942D95295E637F0"
            },
            "lpTokenName": "FilDA",
            "lpTokenSymbol": "Token",
            "lpTokenId": "FilDA",
            "airdropToken": "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c",
            "lpPairAddress": "0x8B36aAF955A2cf71C714Bf1a7b12345B3d0e41E5"
        },
        // "0xd94Bd9186162658AF5910D5584AB8f008a6931b1": {
        //     "lpTokenName": "TUSD",
        //     "lpTokenSymbol": "Token",
        //     "lpTokenId": "FilDA-Airdrop"
        // },
        "0x248e9080d1f0979b23b5ca5D8686B00eb0D88CfE": {
            "lpTokenName": "FilDA",
            "lpTokenSymbol": "Token",
            "lpTokenId": "FilDA",
            "airdropToken": "0xe36ffd17b2661eb57144ceaef942d95295e637f0",
            "isAirdrop": true
        },
        "0x73CB0A55Be009B30e63aD5830c85813414c66367": {
            "lpToken": {
                "ABI": erc20.ABI,
                "address": "0xE36FFD17B2661EB57144cEaEf942D95295E637F0"
            },
            "lpTokenName": "FilDA",
            "lpTokenSymbol": "Token",
            "lpTokenId": "FILDA",
            "hasLockPeriod": true
        }
    }
}

const voteProposal = {
    "ABI": contractABI.voteProposal,
    "MultipleABI": contractABI.voteMultiProposal,
    "network": {
        "heco":
            [{ "address": "0x39EebeD78817Fad1fA891a5840FfC71619efFEF7" },
            { "address": "0x92d737DC7d6141416768949596a7ABBd2ae246Fd" },
            { "address": "0xaFfD84fb3C1B2e3eD88d07300F1b3bAF8D18906a" },
            { "address": "0x20771E1BC3bF598FEa8a6A992Bda817a9E8de8dB" },
            { "address": "0xcd5DEaaB1a75F6939E3e1E6E87A44b488ffd17B9" },
            {
                "address": "0x2Fab287f8F3e223e8440044Eb44d45452423cD5f",
                isMultiple: true
            },
            { "address": "0x758b49B5d7c7a58a6368a9f11A0aD8e804b81189" },
            { "address": "0xf2A9A50E94bDeC234a3CAd96c9f796d5724276E9" },
            { "address": "0x144084F43CfC53bfAE7A6BeBC6F059dba1e06c54" }
            ]
    }
}

const errorCodes = {
    "0": {
        "name": "NO_ERROR",
        "desc": "Not a failure."
    },
    "1": {
        "name": "UNAUTHORIZED",
        "desc": "The sender is not authorized to perform this action."
    },
    "2": {
        "name": "BAD_INPUT",
        "desc": "An invalid argument was supplied by the caller."
    },
    "3": {
        "name": "COMPTROLLER_REJECTION",
        "desc": "The action would violate the comptroller policy."
    },
    "4": {
        "name": "COMPTROLLER_CALCULATION_ERROR",
        "desc": "An internal calculation has failed in the comptroller."
    },
    "5": {
        "name": "INTEREST_RATE_MODEL_ERROR",
        "desc": "The interest rate model returned an invalid value."
    },
    "6": {
        "name": "INVALID_ACCOUNT_PAIR",
        "desc": "The specified combination of accounts is invalid."
    },
    "7": {
        "name": "INVALID_CLOSE_AMOUNT_REQUESTED",
        "desc": "The amount to liquidate is invalid."
    },
    "8": {
        "name": "INVALID_COLLATERAL_FACTOR",
        "desc": "The collateral factor is invalid."
    },
    "9": {
        "name": "MATH_ERROR",
        "desc": "A math calculation error occurred."
    },
    "10": {
        "name": "MARKET_NOT_FRESH",
        "desc": "Interest has not been properly accrued."
    },
    "11": {
        "name": "MARKET_NOT_LISTED",
        "desc": "The market is not currently listed by its comptroller."
    },
    "12": {
        "name": "TOKEN_INSUFFICIENT_ALLOWANCE",
        "desc": "ERC-20 contract must allow Money Market contract to call transferFrom. The current allowance is either 0 or less than the requested supply, repayBorrow or liquidate amount."
    },
    "13": {
        "name": "TOKEN_INSUFFICIENT_BALANCE",
        "desc": "Caller does not have sufficient balance in the ERC-20 contract to complete the desired action."
    },
    "14": {
        "name": "TOKEN_INSUFFICIENT_CASH",
        "desc": "The market does not have a sufficient cash balance to complete the transaction. You may attempt this transaction again later."
    },
    "15": {
        "name": "TOKEN_TRANSFER_IN_FAILED",
        "desc": "Failure in ERC-20 when transfering token into the market."
    },
    "16": {
        "name": "TOKEN_TRANSFER_OUT_FAILED",
        "desc": "Failure in ERC-20 when transfering token out of the market."
    }
}

const WHT = "0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f"
const SwapRepayContract = "0xE1A3B85686920aa0450F36f06efBC21050d15C55"
const MDEXRouter = "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300"
const LiquidateContract = "0x67f9FE06B109559602250b89845BBD792349E939"
const DepositSwapContract = "0xEbc6Ed7Cc09907C6331Ab01146dfAdA1fAFfD356"  // 存款交换，LiquiditySwap address
const FlashLoanContract = {
    heco: "0x0078E7712Af18997E7aA3FdB48Cd97F6b8077831"
}
const DepositRepayContract = "0x7fb6a4Ebe618eC24CcaD635c79438436429aC5aE" // 存款还借款
const FeeManagerContract = {
    heco: "0x319EBfD62dD279297582ea06d34aB514d8C55e07"
}



const apiUrls = {
    "allMarkets": "https://us.filda.io/data/heco/allmarkets.json",
    "accountsLiquidity": "https://lq.ifoobar.com/api/accountsliquidity?status=shortfall",
    "accountDetail": "https://lq.ifoobar.com/api/account"
}

const walletConnect = {
    rpc: rpcUrls,
    //bridge: "http://192.168.31.114:5001"
    bridge: "https://bridge.walletconnect.org",

    // Good wallet integrations such as metamask mobile are able to detect if we don't send
    // a chainId manually and automatically return the network selected by users in the wallet.
    // Though, most other wallets such as TokenPocket consider that if no chainId is given by us,
    // they simply return chainId 1 (ethereum mainnet) which is not what we want.
    // Our solution is therefore to force the chainId to HECO for now.
    chainId: 128,

    clientMeta: {
        name: "FilDA.io",
        description: "FilDA - A DeFi app powered by FilDA Team",
        url: "https://www.filda.io",
        icons: [
            "https://www.filda.io/favicon.png"
        ]
    }
}

const thirdMarkets = {
    "PTD": {
        "url": "https://p.td",
        "data": "https://p.td/api/public",
    },
    "Booster": {
        network: {
            "heco": "0xa61A4F9275eF62d2C076B0933F8A9418CeC8c670"
        }
    }
}

const LanguageList = [
    {
        key: "en",
        name: "Eng",
    },
    {
        key: "ru",
        name: "русский",
    },
    {
        key: "zh-CN",
        name: "中文",
    }
]

const exchangeTitles = {
    sushiSwap: 0,
    quickSwap: 1,
    paraSwap: 2
}

const exchanges = [
    { id: exchangeTitles.sushiSwap, title: "SUSHISWAP", icon: "https://www.sushi.com/static/media/logo.dec926df.png" },
    { id: exchangeTitles.quickSwap, title: "QUICKSWAP", icon: "/images/quicklogo.jpg" }
];

const leveragePools = {
    heco: {},
    hecotest: {},
    matic: {
        ChainlinkAdapterOracle: "0xa258bfFD5F6814303a718d2B9D34B40E14C66289",
        CoreOracle: {
            address: "0x71180944e4288d9191Bc3A2dF94f80ba06D01eC3",
            ABI: "/abis/CoreOracle.json"
        },
        UniswapV2Oracle: {
            address: "0xFD0c6b70C4dA159F24Ffa64f209CfdbbA9595A79",
            ABI: "/abis/UniswapV2Oracle.json"
        },
        ProxyOracle: {
            address: "0x1B5eC540A4BA9db5655F36e8F3372C5551DA9fb6",
            ABI: "/abis/ProxyOracle.json"
        },
        HomoraBank: {
            address: "0xf9d6d1AC0A7eBF7AFdc3503354a66102627038B9",
            ABI: "/abis/HomoraBank.json"
        },
        HomoraBankProxy: {
            address: "0xAeE67519049092AB91EFD033f7d350D62b9f166B",
            ABI: "/abis/HomoraBank.json"
        },
        UniswapV2SpellV1: {
            address: "0x940913158A59a7aE71C76A6D09fc75E957050442",
            ABI: "/abis/UniswapV2SpellV1.json"
        },
        cErc20AdaptorInstanceForMatic: "0x28347DA75a26955995738B6dB54aEAa6321a807d",
        denomination: 10000,
        cryptoDecimals: 18,
        pairs: {
            "ETH-MATIC": {
                tokenA: {
                    symbol: "Matic",
                    logo: hmatic,
                    address: "0x0000000000000000000000000000000000000000",
                    ABI: "/abis/ERC20.json",
                    decimals: 18,
                    wrapped: {
                        address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
                        ABI: "/abis/ERC20.json"
                    }
                },
                tokenB: {
                    symbol: "WETH",
                    logo: heth,
                    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                    ABI: "/abis/ERC20.json",
                    decimals: 18
                },
                lp: {
                    symbol: "UNI-V2",
                    address: "0xadbF1854e5883eB8aa7BAf50705338739e558E5b",
                    decimals: 18,
                    ABI: "/abis/UniswapV2Pair.json"
                },
                factory: {
                    address: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
                    ABI: "/abis/UniswapV2Factory.json"
                },
                WStakingRewards: {
                    address: "0xdB82850b0d28Fbc3e00DEd5b309cf13Fa0165cfb",
                    ABI: "/abis/ERC20.json"
                },
                StakingRewards: {
                    address: "0x8FF56b5325446aAe6EfBf006a4C1D88e4935a914",
                    ABI: "/abis/StakingRewards.json"
                },
                reward: {
                    address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
                    ABI: "/abis/Reward.json",
                    decimals: 18,
                    pairForPrice: {
                        address: "0x7641F96A2B7b4708bc9E8F4D7ca08E232C31A3Dd",
                        ABI: "/abis/UniswapV2Pair.json",
                        decimalsAnother: 6
                    },
                    poolRate: 39
                },
                exchange: exchangeTitles.quickSwap,
                leverageTimes: 5
            },
            "WETH-USDT": {
                tokenA: {
                    symbol: "WETH",
                    logo: heth,
                    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                    ABI: "/abis/ERC20.json",
                    decimals: 18
                },
                tokenB: {
                    symbol: "USDT",
                    logo: usdt,
                    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                    ABI: "/abis/ERC20.json",
                    decimals: 6
                },
                lp: {
                    symbol: "UNI-V2",
                    address: "0xF6422B997c7F54D1c6a6e103bcb1499EeA0a7046",
                    decimals: 18,
                    ABI: "/abis/UniswapV2Pair.json"
                },
                factory: {
                    address: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
                    ABI: "/abis/UniswapV2Factory.json"
                },
                WStakingRewards: {
                    address: "0x3D58966A119AbAa6f61cb4656125dAeDFF069eC5",
                    ABI: "/abis/ERC20.json"
                },
                StakingRewards: {
                    address: "0xB26bfcD52D997211C13aE4C35E82ced65AF32A02",
                    ABI: "/abis/StakingRewards.json"
                },
                reward: {
                    address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
                    ABI: "/abis/Reward.json",
                    decimals: 18,
                    pairForPrice: {
                        address: "0x7641F96A2B7b4708bc9E8F4D7ca08E232C31A3Dd",
                        ABI: "/abis/UniswapV2Pair.json",
                        decimalsAnother: 6
                    },
                    poolRate: 17
                },
                exchange: exchangeTitles.quickSwap,
                leverageTimes: 5
            },
        }
    }
}

export default {
    LanguageList,
    markets,
    priceOracle,
    comptroller,
    errorCodes,
    blockExplorers,
    chainIdMap,
    COMP,
    governorAlpha,
    compoundLens,
    maximillion,
    poolManager,
    interestRateModel,
    mdex,
    dogeSwap,
    pilot,
    solo,
    soloBXH,
    depthFi,
    booster,
    pools,
    noMintRewardPool,
    erc20,
    uniswapPair,
    voteProposal,
    mdexUrls,
    rpcUrls,
    apiUrls,
    WHT,
    SwapRepayContract,
    MDEXRouter,
    LiquidateContract,
    FlashLoanContract,
    DepositRepayContract,
    DepositSwapContract,
    multiCall,
    walletConnect,
    thirdMarkets,
    FeeManagerContract,
    exchangeTitles,
    exchanges,
    leveragePools
}
