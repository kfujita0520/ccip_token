import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();


  const CallForwardTestContract = await ethers.getContractFactory("CallForwardTest");
  const CallForwardTest = await CallForwardTestContract.deploy();
  await CallForwardTest.deployed();

  console.log('start test');

  await CallForwardTest.testForwardCall();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
