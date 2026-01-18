#!/bin/bash
# Quick start script for PledgeAgent Frontend

set -e

echo "🚀 PledgeAgent Frontend Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo "   Default API URL: http://localhost:8000"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Build check
echo "🔨 Building project..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "⚠️  Build failed. Check for errors above."
    exit 1
fi
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: cd ../backend && python api/main.py"
echo "2. Start the frontend: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Available commands:"
echo "  npm run dev       - Start development server (http://localhost:3000)"
echo "  npm run build     - Build for production"
echo "  npm run preview   - Preview production build"
echo "  npm run lint      - Run ESLint"
echo "  npm run format    - Format code with Prettier"
echo ""
