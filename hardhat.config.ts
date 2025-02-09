import dotenv from "dotenv";
import { type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

dotenv.config();

if (!process.env.SEPOLIA_RPC_URL) {
  throw new Error("Missing environment variable SEPOLIA_RPC_URL in .env file");
}

if (!process.env.PRIVATE_KEY) {
  throw new Error("Missing environment variable PRIVATE_KEY in .env file");
}

const config = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config as HardhatUserConfig;
