import { ethers } from "hardhat";

// Auto-generated typings
import { Lock, Lock__factory } from "../types";

async function main() {
  const [deployer] = await ethers.getSigners();
  // One hour from now.
  const unlockTime = Math.floor(Date.now() / 1000) + 3600;

  const lockFactory = new Lock__factory(deployer);
  const lock: Lock = await lockFactory.deploy(unlockTime, {
    value: ethers.parseEther("0.001"),
  });

  await lock.waitForDeployment();

  console.log(`Contract deployed at: ${await lock.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
