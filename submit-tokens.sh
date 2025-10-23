#!/bin/bash

# MetaMask and Uniswap Token Listing Automation Script
# Run this script to prepare and validate your token list for submissions

echo "🚀 VKATHUSHAN Token List - MetaMask & Uniswap Submission Helper"
echo "================================================================"

# 1. Validate Token List
echo "📋 Step 1: Validating Token List..."
if command -v npx &> /dev/null; then
    echo "Installing token list validator..."
    npm install -g @uniswap/token-lists 2>/dev/null || echo "⚠️  Please install Node.js to run validation"
    
    echo "Validating tokenlist.json..."
    npx token-lists-cli validate tokenlist.json 2>/dev/null || echo "⚠️  Validation requires @uniswap/token-lists package"
else
    echo "⚠️  Node.js not found. Please install Node.js to run token list validation."
fi

# 2. Check Contract Verification
echo ""
echo "🔍 Step 2: Contract Verification Checklist"
echo "Please verify these contracts on block explorers:"
echo ""
echo "Ethereum Mainnet (https://etherscan.io):"
echo "- 0xC248D1Ea863FDD815df60248F1358dEe6E771eC7 (Tether USD Coin Wrapped)"
echo "- 0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D (Tether USD Wrapped EVM)"
echo ""
echo "Optimism (https://optimistic.etherscan.io):"
echo "- 0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D (Wrapped Tether USD Coin)"

# 3. Token List URLs
echo ""
echo "🔗 Step 3: Token List URLs"
echo "Primary URL: https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json"
echo "IPFS URL: (Upload to IPFS for decentralization)"

# 4. MetaMask Submission
echo ""
echo "📱 Step 4: MetaMask Submission Process"
echo "1. Fork: https://github.com/MetaMask/eth-contract-metadata"
echo "2. Add to contract-map.json:"
echo "   {\"0xC248D1Ea863FDD815df60248F1358dEe6E771eC7\": {\"name\":\"Tether USD Coin Wrapped\",\"logo\":\"evm-usd.png\",\"erc20\":true,\"symbol\":\"USDT\",\"decimals\":6}}"
echo "3. Submit PR with verification links"

# 5. Uniswap Submission
echo ""
echo "🦄 Step 5: Uniswap Submission Process"
echo "1. Fork: https://github.com/Uniswap/default-token-list"
echo "2. Add to src/tokens/mainnet.json and src/tokens/optimism.json"
echo "3. Add logos to assets/ directory"
echo "4. Run 'npm test' to validate"
echo "5. Submit PR"

# 6. Community Lists
echo ""
echo "🌐 Step 6: Community Token Lists (Easier Alternative)"
echo "Submit to community-maintained lists:"
echo "- https://github.com/compound-finance/token-list"
echo "- https://github.com/sushiswap/default-token-list"
echo "- https://github.com/trustwallet/assets"

# 7. Testing URLs
echo ""
echo "🧪 Step 7: Test Your Token List"
echo "Test URL in wallets:"
echo "- MetaMask: Settings → Networks → Token Lists → Add List"
echo "- 1inch: Token Lists"
echo "- SushiSwap: Token Lists"

echo ""
echo "✅ Token List Ready! URL: https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json"
echo "📚 Full guide available in SUBMISSION_GUIDE.md"