#!/bin/bash

# Token Logo Submission Helper Script
# This script helps you prepare and submit token logos to Uniswap and MetaMask

set -e

echo "🚀 Token Logo Submission Helper"
echo "==============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node --version)"
echo ""

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install sharp axios
    echo -e "${GREEN}✓${NC} Dependencies installed"
    echo ""
fi

# Validate logos
echo "🔍 Validating logos..."
node scripts/validate-logos.js

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Logo validation passed!${NC}"
else
    echo ""
    echo -e "${RED}✗ Logo validation failed!${NC}"
    exit 1
fi

# Prepare submissions
echo ""
echo "📋 Preparing submissions..."
echo ""

# Uniswap submission
echo "🔗 Preparing Uniswap submission..."
node scripts/submit-uniswap.js
echo ""

# MetaMask submission
echo "🔗 Preparing MetaMask submission..."
node scripts/submit-metamask.js
echo ""

# Display summary
echo -e "${GREEN}✨ Submission preparation complete!${NC}"
echo ""
echo "📄 Generated files:"
echo "   - UNISWAP_SUBMISSION_INFO.md (Instructions for Uniswap)"
echo "   - METAMASK_SUBMISSION_INFO.md (Instructions for MetaMask)"
echo "   - submission-summary.json (Submission details)"
echo ""
echo "📖 Next steps:"
echo "   1. Review the submission instructions above"
echo "   2. Fork the respective repositories (Uniswap/MetaMask)"
echo "   3. Follow the instructions to add your tokens"
echo "   4. Submit pull requests"
echo ""
echo "💡 Tips:"
echo "   - Ensure your token contracts are verified on Etherscan"
echo "   - Have community proof of adoption"
echo "   - Maintain sufficient liquidity"
echo ""
