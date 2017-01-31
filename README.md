## Ropsten Sink
A sink to the [Ropsten Faucet](http://faucet.ropsten.be:3001/).  
RopstenSink will help recharge your test accounts on the [Ethereum testnet](testnet.etherscan.io). Under the hood it will create temporary accounts and ask for ethers from the Ropsten Faucet, and finally funnel the ethers to the address you specified.

### Caution
Please use at your own risk. And please show some respect to the Ropsten Faucet. Don't ask for an incredible amount of ethers.

### Installation
`npm install -g`

### Usage
1. Make sure you have an Ethereum client running on testnet.  
e.g. To run geth on testnet locally  
`geth --light --testnet --rpc --rpcapi="eth,net,web3,personal" console`

2. Run the sink  
`sink <address> <numEthers> <httpProvider, if you run geth locally, then it should be http://localhost:8545>`
