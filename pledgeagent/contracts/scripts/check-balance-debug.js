const hre = require("hardhat");

async function main() {
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Checking balance for:", deployer.address);

        const provider = hre.ethers.provider;
        const balance = await provider.getBalance(deployer.address);
        console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

        const network = await provider.getNetwork();
        console.log("Connected to Chain ID:", network.chainId.toString());

        if (balance === 0n) {
            console.error("❌ ERROR: Wallet has 0 ETH. You need gas to deploy!");
        } else {
            console.log("✅ Wallet has funds.");
        }
    } catch (error) {
        console.error("❌ Error connecting to network:", error.message);
    }
}

main().catch(console.error);
