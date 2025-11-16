# crypto-assests 🚀

Public repository for hosting Ethereum, Optimism & BSC token logos with **automated submission** to Uniswap and MetaMask!

## ✨ Features

- 🤖 **Fully Automated PR Submission** - Automatically forks and submits PRs to Uniswap & MetaMask
- 🔍 **Logo Validation** - Automatic checks for size, format, and quality
- 📋 **Token List** - Standards-compliant tokenlist.json for wallet auto-detection
- 🎯 **Multi-Chain Support** - Ethereum, Optimism, and Binance Smart Chain

## 🚀 Quick Start

### Submit Your Tokens Automatically

```bash
# Add your logo
git add blockchains/ethereum/assets/0xYOUR_TOKEN_ADDRESS/logo.png

# Commit and push
git commit -m "Add token logo"
git push origin main
```

✅ **That's it!** GitHub Actions will automatically:
1. Validate your logo
2. Fork Uniswap and MetaMask repositories
3. Submit Pull Requests with your tokens

[**📖 Read the Full Automation Guide →**](AUTO_PR_SUBMISSION.md)

## 📊 Current Tokens

- **Ethereum Mainnet**: 2 tokens
- **Optimism**: 1 token
- **Binance Smart Chain**: 2 tokens

**Token List URL**: `https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json`
