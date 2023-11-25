import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();

  let networkName = "polygonMumbai";
  const DestinationMinterContract = await ethers.getContractFactory("DestinationMinter");
  const destinationMinter = await DestinationMinterContract.deploy(getRouterConfig(networkName).address);
  await destinationMinter.deployed();
  console.log(`destinationMinter is deployed to ${destinationMinter.address}`);
  const CCIPReceiverTestContract = await ethers.getContractFactory("CCIPReceiverTest");
  const CCIPReceiverTest = await CCIPReceiverTestContract.deploy(destinationMinter.address);
  await CCIPReceiverTest.deployed();
  console.log(`CCIPReceiverTest is deployed to ${CCIPReceiverTest.address}`);

  let messageId = ethers.utils.arrayify("0xdc3006d1b524fac22e696b8e657c25338f59b8a3a0220dd950380dbba9431131");
  let sourceChainSelector = '16015286601757825753';
  let sourceSender = "0x42F1060bFe4aDd36F86Bf21707e425A358551031";
  let amount = ethers.utils.parseEther("1");
  await CCIPReceiverTest.executeReceive(messageId, sourceChainSelector, sourceSender, amount);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
