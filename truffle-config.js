/*
@Dev:The values below are used to deploy to a testnet.

@Dev: HD Wallet-enabled Web3 provider. Use it to sign transactions for addresses derived from a 12 or 24 word mnemonic.

const HDWalletProvider = require('@truffle/hdwallet-provider');

@Dev: Below are needed input values for deployment. You can get a mnemonic from metamask or your wallet of choice. This is used to access your wallet.
@notice: if real funds are in your wallet do not push directly to github. Use an environment variable.
@dev: Infrua id can be retrieved from `https://infura.io/` this is used to connect to the testnet/blockchain.

//const mnemonic = '';
// const infura_id = 'your infura ID';

@Dev: Below are needed input values for deployment. You can get a mnemonic from metamask or your wallet of choice. This is used to access your wallet.
@notice: if real funds are in your wallet do not push directly to github. Use an environment variable.
@dev: Infrua id can be retrieved from `https://infura.io/` this is used to connect to the testnet/blockchain.

@Dev uncomment to access rinkeby or ropsten. */

module.exports = {
  plugins: ["solidity-coverage"],
  networks: {
      development: {
          host: "127.0.0.1",
          port: 9545,
          gasLimit: 9000000,
          network_id: 5777
      }
  },
  mocha: {
      useColors: true,
      reporter: "eth-gas-reporter",
      reporterOptions: {
          currency: "USD",
          gasPrice: 5
      }
  },
  compilers: {
      solc: {
          version: "^0.8.16",
          settings: {
              optimizer: {
                  enabled: true,
                  runs: 200
              },
          }
      }
  }
};
