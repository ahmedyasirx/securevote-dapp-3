import { ethers } from "hardhat";

async function main() {
  const SecureVote = await ethers.getContractFactory("SecureVote");
  const secureVote = await SecureVote.deploy();
  await secureVote.deployed();

  console.log("SecureVote deployed to:", secureVote.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
