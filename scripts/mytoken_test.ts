import { ethers } from "hardhat";
import { LINK_ADDRESSES, PayFeesIn } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();
  console.log('deployer: ', deployer.address);

  let networkName = "polygonMumbai";
  const MyTokenContract = await ethers.getContractFactory("MyToken");
  const MyToken = await MyTokenContract.deploy(getRouterConfig(networkName).address, LINK_ADDRESSES[networkName], ethers.utils.parseEther("10000"));
  await MyToken.deployed();
  console.log(`MyToken is deployed to ${MyToken.address}`);
  const CCIPReceiverTestContract = await ethers.getContractFactory("CCIPReceiverTest");
  const CCIPReceiverTest = await CCIPReceiverTestContract.deploy(MyToken.address);
  await CCIPReceiverTest.deployed();
  console.log(`CCIPReceiverTest is deployed to ${CCIPReceiverTest.address}`);
  await MyToken.grantRole(ethers.utils.id('MINTER_ROLE'), MyToken.address);
  console.log('Minter role of CCIPReceiverTest: ', await MyToken.hasRole(ethers.utils.id('MINTER_ROLE'), CCIPReceiverTest.address));
  console.log('Minter role of MyToken: ', await MyToken.hasRole(ethers.utils.id('MINTER_ROLE'), MyToken.address));
  const CCIPSenderTestContract = await ethers.getContractFactory("CCIPSenderTest");
  const CCIPSenderTest = await CCIPSenderTestContract.deploy(MyToken.address);
  await CCIPSenderTest.deployed();
  console.log(`CCIPSenderTest is deployed to ${CCIPSenderTest.address}`);
  await MyToken.transfer(CCIPSenderTest.address, ethers.utils.parseEther("5"));
  console.log('the balance of CCIPSenderTest: ', await MyToken.balanceOf(CCIPSenderTest.address));

  let messageId = ethers.utils.arrayify("0xdc3006d1b524fac22e696b8e657c25338f59b8a3a0220dd950380dbba9431131");
  let sourceChainSelector = '16015286601757825753';
  let sourceSender = "0x42F1060bFe4aDd36F86Bf21707e425A358551031";
  let amount = ethers.utils.parseEther("1");
  await CCIPReceiverTest.executeReceive(messageId, sourceChainSelector, sourceSender, amount);

  //ccipSend test
  let dstChainSelector = sourceChainSelector;
  let dstContractAddress = sourceSender;
  //fee of native token is very high in forking network environment
  await MyToken.ccipSend(dstChainSelector, dstContractAddress, amount, PayFeesIn.Native, {value: ethers.utils.parseEther("10")});
  console.log('Complete ccipSend');

  await CCIPSenderTest.executeSend(dstChainSelector, dstContractAddress, amount, PayFeesIn.Native, {value: ethers.utils.parseEther("10")});
  console.log('the balance of CCIPSenderTest: ', await MyToken.balanceOf(CCIPSenderTest.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
