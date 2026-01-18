# PledgeAgent Smart Contract Setup Script (Windows)
# This script sets up the Hardhat environment and compiles the contract

Write-Host "🚀 PledgeAgent Smart Contract Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Navigate to contracts directory
Set-Location $PSScriptRoot

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Compile contract
Write-Host "🔨 Compiling smart contract..." -ForegroundColor Yellow
npx hardhat compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile contract" -ForegroundColor Red
    Write-Host "💡 Try running: npx hardhat compile --force" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Contract compiled successfully" -ForegroundColor Green
Write-Host ""

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npx hardhat test

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env and fill in your values"
Write-Host "2. Deploy to testnet: npm run deploy:base-sepolia"
Write-Host "3. Update backend/.env with CONTRACT_ADDRESS"
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
