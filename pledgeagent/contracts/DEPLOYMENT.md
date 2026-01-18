# Smart Contract Deployment Guide

## 🚀 Quick Start

This guide walks you through deploying the PledgeEscrow smart contract to Base Sepolia testnet and integrating it with the backend.

## Prerequisites

- Node.js 18+ installed
- A wallet with Base Sepolia ETH. Get testnet funds from:
  - [Chainlink Faucet](https://faucets.chain.link/base-sepolia) (Confirmed Working)
  - [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia) (Recommended)
  - [QuickNode Faucet](https://faucet.quicknode.com/base/sepolia)
  - [Superchain Faucet](https://app.optimism.io/faucet)
  - Or bridge Sepolia ETH via [Superbridge](https://superbridge.app/base-sepolia)
- Private key for deployment wallet
- (Optional) Basescan API key for contract verification

## Step 1: Install Dependencies

```bash
cd contracts
npm install
```

This installs:
- Hardhat (Ethereum development environment)
- OpenZeppelin contracts (security-audited base contracts)
- Ethers.js (Web3 library)

## Step 2: Configure Environment

Create a `.env` file in the `contracts/` directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```bash
# Your deployment wallet private key (NEVER commit this!)
PRIVATE_KEY=0x1234567890abcdef...

# Agent backend wallet address (will be authorized to record verifications)
AGENT_BACKEND_ADDRESS=0xYourAgentBackendAddress

# Platform treasury address (receives 2% fees)
PLATFORM_TREASURY_ADDRESS=0xYourTreasuryAddress

# (Optional) For contract verification on Basescan
BASESCAN_API_KEY=your_basescan_api_key
```

### Getting Your Private Key

**MetaMask:**
1. Click account icon → Account Details → Show Private Key
2. Enter password → Copy private key
3. **⚠️ NEVER share this or commit it to git!**

**Creating a New Wallet:**
```bash
# Generate a new wallet
npx hardhat run scripts/generate-wallet.js
```

### Funding Your Wallets

You need ETH in two wallets:
1. **Deployment wallet** - for deploying the contract (~$0.50 worth)
2. **Agent backend wallet** - for recording verifications (~$1 worth for testing)

Get testnet ETH from one of these reliable sources:
1. **Alchemy:** https://www.alchemy.com/faucets/base-sepolia
2. **QuickNode:** https://faucet.quicknode.com/base/sepolia
3. **Superchain:** https://app.optimism.io/faucet
4. **Bridge:** https://superbridge.app/base-sepolia (Bridge ETH from Sepolia to Base Sepolia)

## Step 3: Compile Contract

```bash
npm run compile
```

This compiles `PledgeEscrow.sol` and generates:
- ABI (Application Binary Interface) in `artifacts/`
- Bytecode for deployment

Expected output:
```
Compiled 1 Solidity file successfully
```

## Step 4: Run Tests (Optional but Recommended)

```bash
npm test
```

This runs the test suite to ensure the contract works correctly.

Expected output:
```
  PledgeEscrow
    Goal Creation
      ✓ Should create a goal and lock stake
      ✓ Should reject stake below minimum
      ✓ Should reject duration below minimum
    Proof Verification
      ✓ Should record approved verification
      ✓ Should not increment on rejected verification
      ✓ Should only allow agent backend to record verification
    Stake Release
      ✓ Should release stake to user on success
      ✓ Should release stake to penalty recipient on failure
      ✓ Should not allow release before deadline

  9 passing (2s)
```

## Step 5: Deploy to Base Sepolia Testnet

```bash
npm run deploy:base-sepolia
```

This will:
1. Deploy the PledgeEscrow contract
2. Set the agent backend address
3. Set the platform treasury address
4. Save deployment info to `deployments/baseSepolia-deployment.json`

Expected output:
```
🚀 Starting PledgeEscrow deployment...

📝 Deploying with account: 0xYourAddress
💰 Account balance: 0.1234 ETH

⚙️  Configuration:
   Agent Backend: 0xAgentAddress
   Platform Treasury: 0xTreasuryAddress

📦 Deploying PledgeEscrow contract...
✅ PledgeEscrow deployed to: 0xContractAddress

📄 Deployment info saved to: deployments/baseSepolia-deployment.json

⏳ Waiting for 5 block confirmations...
✅ Confirmed!

🔍 To verify the contract on Basescan, run:
   npx hardhat verify --network baseSepolia 0xContractAddress "0xAgentAddress" "0xTreasuryAddress"

📋 Next Steps:
1. Update backend .env with:
   CONTRACT_ADDRESS=0xContractAddress
   CONTRACT_CHAIN_ID=84532

2. Update frontend .env with:
   VITE_CONTRACT_ADDRESS=0xContractAddress
   VITE_CHAIN_ID=84532

3. Fund the agent backend address with ETH for gas:
   0xAgentAddress

🎉 Deployment complete!
```

**Save the contract address!** You'll need it for the next steps.

## Step 6: Verify Contract on Basescan (Optional)

Verification makes your contract source code public and verifiable:

```bash
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS "AGENT_BACKEND_ADDRESS" "PLATFORM_TREASURY_ADDRESS"
```

Replace the addresses with your actual values.

Expected output:
```
Successfully verified contract PledgeEscrow on Basescan.
https://sepolia.basescan.org/address/0xYourContractAddress#code
```

## Step 7: Update Backend Configuration

Navigate to `backend/` and update `.env`:

```bash
cd ../backend
cp .env.example .env
```

Add these lines to `.env`:

```bash
# Blockchain Configuration
RPC_URL=https://sepolia.base.org
CONTRACT_ADDRESS=0xYourDeployedContractAddress
CONTRACT_CHAIN_ID=84532
AGENT_PRIVATE_KEY=0xYourAgentBackendPrivateKey
```

## Step 8: Test Backend Integration

Start the backend server:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python api/main.py
```

Test the blockchain connection:

```python
# In Python console
from backend.blockchain.contract_interface import get_contract_interface

contract = get_contract_interface()
print(f"Connected: {contract.is_connected()}")
print(f"Agent balance: {contract.get_agent_balance()} ETH")
```

Expected output:
```
✅ Agent backend address: 0xYourAgentAddress
Connected: True
Agent balance: 0.05 ETH
```

## Step 9: Update Frontend Configuration

Navigate to `frontend/` and update `.env`:

```bash
cd ../frontend
cp .env.example .env
```

Add these lines to `.env`:

```bash
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_CHAIN_ID=84532
VITE_RPC_URL=https://sepolia.base.org
```

## Step 10: Test End-to-End

### Create a Goal (Frontend)

1. Start frontend: `npm run dev`
2. Connect wallet (MetaMask on Base Sepolia)
3. Create a goal with stake
4. Note the on-chain goal ID

### Submit Proof (Backend)

1. Upload proof image
2. Backend verifies with AI
3. Backend records result on-chain
4. Check transaction on Basescan

### Verify On-Chain

Visit Basescan: `https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS`

You should see:
- `GoalCreated` events
- `ProofVerified` events
- Contract balance increasing with stakes

## Deployment to Mainnet (Base)

⚠️ **Only do this after thorough testing on testnet!**

1. Get real ETH on Base mainnet
2. Update `.env` with mainnet RPC
3. Deploy:

```bash
npm run deploy:base
```

4. Update backend/frontend with mainnet contract address
5. **Get a security audit before handling significant funds!**

## Troubleshooting

### "Insufficient funds for gas"
- Fund your deployment wallet with more ETH
- Check balance: `npx hardhat run scripts/check-balance.js --network baseSepolia`

### "Nonce too high"
- Reset MetaMask: Settings → Advanced → Reset Account

### "Contract not deployed"
- Check `deployments/` folder for deployment info
- Verify contract address in `.env`

### "Transaction reverted"
- Check you're using the correct network (Base Sepolia)
- Ensure agent backend address is authorized
- Check contract has enough gas

### "Cannot connect to RPC"
- Verify RPC URL in `.env`
- Try alternative RPC: `https://base-sepolia.blockpi.network/v1/rpc/public`

## Gas Cost Estimates

**Base Sepolia (Testnet):**
- Deploy contract: ~$0.50 (free testnet ETH)
- Record verification: ~$0.01 per transaction

**Base Mainnet:**
- Deploy contract: ~$0.50
- Record verification: ~$0.01 per transaction

Base is an L2 optimized for low gas costs!

## Security Checklist

Before mainnet deployment:

- [ ] Contract tested thoroughly on testnet
- [ ] Private keys stored securely (use hardware wallet for mainnet)
- [ ] Agent backend wallet funded but not over-funded
- [ ] Platform fee set correctly (default 2%)
- [ ] Emergency withdrawal tested
- [ ] Contract verified on Basescan
- [ ] Consider professional security audit for production

## Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Integrate with backend
3. ✅ Test full user flow
4. 🚧 Deploy to mainnet (when ready)
5. 🚧 Monitor transactions and gas costs
6. 🚧 Scale as needed

## Resources

- [Base Documentation](https://docs.base.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Basescan](https://sepolia.basescan.org/)

---

**Need help?** Check the main README or open an issue on GitHub.
