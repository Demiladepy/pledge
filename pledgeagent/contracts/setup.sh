#!/bin/bash

# PledgeAgent Smart Contract Setup Script
# This script sets up the Hardhat environment and compiles the contract

echo "🚀 PledgeAgent Smart Contract Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Navigate to contracts directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Compile contract
echo "🔨 Compiling smart contract..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile contract"
    echo "💡 Try running: npx hardhat compile --force"
    exit 1
fi

echo "✅ Contract compiled successfully"
echo ""

# Run tests
echo "🧪 Running tests..."
npx hardhat test

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed"
else
    echo "✅ All tests passed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and fill in your values"
echo "2. Deploy to testnet: npm run deploy:base-sepolia"
echo "3. Update backend/.env with CONTRACT_ADDRESS"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
