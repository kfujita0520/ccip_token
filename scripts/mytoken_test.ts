import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();
  console.log('deployer: ', deployer.address);

  let networkName = "polygonMumbai";
  const MyToken2Contract = await ethers.getContractFactory("MyToken2");
  const MyToken2 = await MyToken2Contract.deploy(getRouterConfig(networkName).address, LINK_ADDRESSES[networkName], ethers.utils.parseEther("10000"));
  await MyToken2.deployed();
  console.log(`MyToken2 is deployed to ${MyToken2.address}`);
  const CCIPReceiverTestContract = await ethers.getContractFactory("CCIPReceiverTest");
  const CCIPReceiverTest = await CCIPReceiverTestContract.deploy(MyToken2.address);
  await CCIPReceiverTest.deployed();
  console.log(`CCIPReceiverTest is deployed to ${CCIPReceiverTest.address}`);
  //await MyToken2.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), CCIPReceiverTest.address);
  await MyToken2.grantRole(ethers.utils.id('MINTER_ROLE'), MyToken2.address);
  console.log(await MyToken2.hasRole(ethers.utils.id('MINTER_ROLE'), CCIPReceiverTest.address));
  console.log(await MyToken2.hasRole(ethers.utils.id('MINTER_ROLE'), MyToken2.address));

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
