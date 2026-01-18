#!/bin/bash

# PledgeAgent Setup Script
# Automates the initial setup process

set -e

echo "🚀 PledgeAgent Setup"
echo "===================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.11+${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✓ Python ${PYTHON_VERSION}${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL not found. You'll need to install it separately.${NC}"
else
    echo -e "${GREEN}✓ PostgreSQL installed${NC}"
fi

echo ""
echo "Setting up backend..."

# Backend setup
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Setup environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit backend/.env with your API keys${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

cd ..

echo ""
echo "Setting up frontend..."

# Frontend setup
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --silent
    echo -e "${GREEN}✓ Node.js dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Node.js dependencies already installed${NC}"
fi

if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit frontend/.env if needed${NC}"
fi

cd ..

echo ""
echo "Setting up smart contracts..."

cd contracts

if [ ! -d "node_modules" ]; then
    echo "Installing Hardhat and dependencies..."
    npm install --silent
    echo -e "${GREEN}✓ Contract dependencies installed${NC}"
fi

cd ..

echo ""
echo "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys:"
echo "   - OPENAI_API_KEY"
echo "   - OPIK_API_KEY (optional)"
echo "   - DATABASE_URL"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python api/main.py"
echo ""
echo "3. Start the frontend (in new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Deploy smart contract (optional, for testing):"
echo "   cd contracts"
echo "   npx hardhat run scripts/deploy.js --network base-sepolia"
echo ""
echo -e "${GREEN}Happy building! 🚀${NC}"
