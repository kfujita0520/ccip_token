import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {

  const [deployer, signer] = await ethers.getSigners();
  let contractAddress = '0xA65992d736dF2289Dc1D60a255e91Bb530630743';

  const myToken = await hre.ethers.getContractAt("MyToken", contractAddress);
  let amount = await myToken.balanceOf(deployer.address);
  await myToken.transfer(contractAddress, amount);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
