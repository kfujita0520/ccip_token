import { ethers } from "hardhat";
import { LINK_ADDRESSES } from "./constants";
import { getRouterConfig } from "./utils";

async function main() {
  const [deployer, signer] = await ethers.getSigners();

  const DestinationMinterContract = await ethers.getContractFactory("DestinationMinter");
  const destinationMinter = await DestinationMinterContract.deploy(getRouterConfig(hre.network.name).address, "0x351ccE1927EF15168eC4F9838e4A91615B38Cd9E");
  await destinationMinter.deployed();

  console.log(
    `DestinationMinter is deployed to ${destinationMinter.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
