import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.ETHEREUM_SEPOLIA_RPC_URL !== undefined ? process.env.ETHEREUM_SEPOLIA_RPC_URL : '', // replace with your Infura project ID
        blockNumber: 4721700, // replace with the block number you want to fork from
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
    },
    ethereumSepolia: {
      url: process.env.ETHEREUM_SEPOLIA_RPC_URL !== undefined ? process.env.ETHEREUM_SEPOLIA_RPC_URL : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: 12000000
    },
    polygonMumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL !== undefined ? process.env.POLYGON_MUMBAI_RPC_URL : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    },
    optimismGoerli: {
      url: process.env.OPTIMISM_GOERLI_RPC_URL !== undefined ? process.env.OPTIMISM_GOERLI_RPC_URL : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 420,
    },
    arbitrumTestnet: {
      url: process.env.ARBITRUM_TESTNET_RPC_URL !== undefined ? process.env.ARBITRUM_TESTNET_RPC_URL : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 421613
    },
    avalancheFuji: {
      url: process.env.AVALANCHE_FUJI_RPC_URL !== undefined ? process.env.AVALANCHE_FUJI_RPC_URL : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 43113
    }
  },
};

export default config;
