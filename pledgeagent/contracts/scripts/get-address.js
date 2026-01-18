const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("DEPLOYER_ADDRESS:" + deployer.address);
}

main().catch(console.error);
