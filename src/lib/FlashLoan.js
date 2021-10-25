import Config from '../utils/config';
const FlashLoanTool = require('./FlashLoan.json')

export default class FlashLoan {

    constructor(_web3, _flashLoan, _receiverAddress, _onTransactionHash) {
        this.web3 = _web3

        this.receiverAddress = _receiverAddress
        this.flashLoanTool = new this.web3.eth.Contract(FlashLoanTool.abi, _flashLoan)
        this.onTransactionHash = _onTransactionHash
    }


    async depositRepayLoan({path, ftokenB, tokenB, ftokenA, tokenA, ftokenAmount, account, mode, slippage, amount}) {
        if (tokenB !== tokenA && path.length === 0) {
            return
        }
      
        let assets = [tokenB]
        let amounts = [amount]
      
        const params = this.web3.eth.abi.encodeParameters(
                ['address', 'address', 'uint256', 'uint8', 'address[]', 'uint256'],
                [ftokenA, ftokenB, ftokenAmount, mode, path, slippage]
            );
      
        // 估算gas费
        let gasEstimate = await this.flashLoanTool.methods.flashLoan(
            this.receiverAddress,
            assets,
            amounts,
            params
        ).estimateGas({from: account})
      
        // 调用合约方法
        let ret = await this.flashLoanTool.methods.flashLoan(
            this.receiverAddress,
            assets,
            amounts,
            params
        ).send({from: account, gasLimit: gasEstimate*2}).on('transactionHash', this.onTransactionHash)
        return ret
    }

    async depositSwapLoan({swapPath, tokenB, ftokenB, tokenA, ftokenA, ftokenAmount, minOut, accounts}) {

        const assets = [tokenB]  // B
        const amounts = [minOut]

        // 构造还款参数
        const params = this.web3.eth.abi.encodeParameters(
            ['address', 'address', 'uint256', 'address[]', 'uint256'], [ftokenA, ftokenB, ftokenAmount, swapPath, minOut]);


        // 估算gas费
        let gasEstimate = await this.flashLoanTool.methods.flashLoan(
            this.receiverAddress,
            assets,
            amounts,
            params
        ).estimateGas({from: accounts});

        // 调用合约方法
        let ret = await this.flashLoanTool.methods.flashLoan(
            this.receiverAddress,
            assets,
            amounts,
            params
        ).send({from: accounts, gasLimit: gasEstimate*2}).on('transactionHash', this.onTransactionHash)

        return ret
    }
}
