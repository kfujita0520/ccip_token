import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();

  const MyTokenContract = await ethers.getContractFactory("MyToken");
  const myToken = await MyTokenContract.deploy(getRouterConfig(hre.network.name).address, LINK_ADDRESSES[hre.network.name], ethers.utils.parseEther("10000"));
  await myToken.deployed();
  await myToken.grantRole(ethers.utils.id('MINTER_ROLE'), myToken.address);

  console.log(
    `myToken is deployed to ${myToken.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
