import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import { config } from "dotenv";
import { type HardhatUserConfig, task } from "hardhat/config";

config();

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.27",
  paths: {
    artifacts: "./src/artifacts"
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
    externalArtifacts: []
  },
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_PROVIDER_URL ?? "",
      accounts: [process.env.PRIVATE_KEY ?? ""].filter(Boolean)
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default hardhatConfig;
