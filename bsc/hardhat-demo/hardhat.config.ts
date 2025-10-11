import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// 在 ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量文件，.env.local 优先于 .env
// 先加载 .env，再加载 .env.local（覆盖相同的键）
dotenv.config({ path: path.resolve(__dirname, ".env") });
if (fs.existsSync(path.resolve(__dirname, ".env.local"))) {
  dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: true });
}

const config = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    bscTestnet: {
      type: "http",
      chainType: "l1",
      url: process.env.BSC_TESTNET_RPC_URL || "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: process.env.BSC_TESTNET_PRIVATE_KEY ? [process.env.BSC_TESTNET_PRIVATE_KEY] : [],
      chainId: 97,
    },
  },
  // 配置区块链浏览器 API（用于合约验证）
  // 使用 Etherscan Multichain API - 一个 Key 支持 60+ 链
  etherscan: {
    apiKey: {
      // Ethereum 网络
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      // BSC 网络（优先使用 Multichain API Key）
      bscTestnet: process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY || "",
    },
    chainDescriptors: {
      97: {
        name: "bscTestnet",
        blockExplorerUrl: {
          etherscan: {
            name: "bscTestnet", 
            url: "https://testnet.bscscan.com",
            apiURL: "https://api-testnet.bscscan.com/api",
          }
        }
      }
    },
  },
};

export default config as HardhatUserConfig;
