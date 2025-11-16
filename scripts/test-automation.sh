#!/bin/bash

# Test script to verify the automated PR submission locally
# This will validate without actually creating PRs

echo "🧪 Testing Automated PR Submission Workflow"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is required"
    exit 1
fi
echo "✅ Git: $(git --version | head -n1)"

# Check if in correct directory
if [ ! -f "tokenlist.json" ]; then
    echo "❌ Please run from repository root"
    exit 1
fi
echo "✅ Repository root detected"

# Validate tokenlist.json
echo ""
echo "📋 Validating tokenlist.json..."
if node -e "JSON.parse(require('fs').readFileSync('tokenlist.json'))"; then
    echo "✅ tokenlist.json is valid JSON"
    
    # Count tokens
    TOKEN_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('tokenlist.json')).tokens.length)")
    echo "✅ Found $TOKEN_COUNT token(s)"
    
    # Count Ethereum tokens
    ETH_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('tokenlist.json')).tokens.filter(t => t.chainId === 1).length)")
    echo "   - Ethereum: $ETH_COUNT token(s)"
else
    echo "❌ tokenlist.json is invalid"
    exit 1
fi

# Check scripts exist
echo ""
echo "📝 Checking automation scripts..."
if [ -f "scripts/submit-uniswap-pr.js" ]; then
    echo "✅ submit-uniswap-pr.js exists"
else
    echo "❌ submit-uniswap-pr.js not found"
    exit 1
fi

if [ -f "scripts/submit-metamask-pr.js" ]; then
    echo "✅ submit-metamask-pr.js exists"
else
    echo "❌ submit-metamask-pr.js not found"
    exit 1
fi

if [ -f "scripts/validate-logos.js" ]; then
    echo "✅ validate-logos.js exists"
else
    echo "❌ validate-logos.js not found"
    exit 1
fi

# Check workflow exists
echo ""
echo "⚙️  Checking GitHub Actions workflow..."
if [ -f ".github/workflows/submit-logos.yml" ]; then
    echo "✅ submit-logos.yml workflow exists"
else
    echo "❌ submit-logos.yml not found"
    exit 1
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Your automated PR submission is ready!"
echo ""
echo "To trigger the workflow:"
echo "  1. Push logo changes to main branch"
echo "  2. Or go to Actions → Submit Token Logos → Run workflow"
echo ""
echo "The workflow will:"
echo "  🍴 Fork Uniswap/default-token-list"
echo "  🍴 Fork MetaMask/eth-contract-metadata"
echo "  🌿 Create feature branches"
echo "  📝 Add your $TOKEN_COUNT token(s)"
echo "  🎯 Submit Pull Requests automatically"
echo ""
echo "📖 For more info, see: AUTO_PR_SUBMISSION.md"
echo ""
