const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting PledgeEscrow deployment...\n");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

    // Get configuration from environment
    const agentBackend = process.env.AGENT_BACKEND_ADDRESS || deployer.address;
    const platformTreasury = process.env.PLATFORM_TREASURY_ADDRESS || deployer.address;

    console.log("⚙️  Configuration:");
    console.log("   Agent Backend:", agentBackend);
    console.log("   Platform Treasury:", platformTreasury);
    console.log("");

    // Deploy contract
    console.log("📦 Deploying PledgeEscrow contract...");
    const PledgeEscrow = await hre.ethers.getContractFactory("PledgeEscrow");
    const pledgeEscrow = await PledgeEscrow.deploy(agentBackend, platformTreasury);

    await pledgeEscrow.waitForDeployment();
    const contractAddress = await pledgeEscrow.getAddress();

    console.log("✅ PledgeEscrow deployed to:", contractAddress);
    console.log("");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contractAddress,
        agentBackend: agentBackend,
        platformTreasury: platformTreasury,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber(),
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString()
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const deploymentFile = path.join(
        deploymentsDir,
        `${hre.network.name}-deployment.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("📄 Deployment info saved to:", deploymentFile);
    console.log("");

    // Wait for block confirmations on testnets/mainnet
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("⏳ Waiting for 5 block confirmations...");
        await pledgeEscrow.deploymentTransaction().wait(5);
        console.log("✅ Confirmed!");
        console.log("");

        // Verification instructions
        console.log("🔍 To verify the contract on Basescan, run:");
        console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress} "${agentBackend}" "${platformTreasury}"`);
        console.log("");
    }

    // Display next steps
    console.log("📋 Next Steps:");
    console.log("1. Update backend .env with:");
    console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`   CONTRACT_CHAIN_ID=${deploymentInfo.chainId}`);
    console.log("");
    console.log("2. Update frontend .env with:");
    console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`   VITE_CHAIN_ID=${deploymentInfo.chainId}`);
    console.log("");
    console.log("3. Fund the agent backend address with ETH for gas:");
    console.log(`   ${agentBackend}`);
    console.log("");
    console.log("🎉 Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
