import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();

  const CCIPReceiverTestContract = await ethers.getContractFactory("CCIPReceiverTest");
  const CCIPReceiverTest = await CCIPReceiverTestContract.deploy("0xf965D43Ea3f50Ce93b1eEf17A6eEd9d58b41C8af");
  await CCIPReceiverTest.deployed();

  console.log(
    `CCIPReceiverTest is deployed to ${CCIPReceiverTest.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
