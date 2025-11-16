# Automated Token Logo Submission Guide

This repository now has automated GitHub Actions workflows to help you submit your token logos to Uniswap and MetaMask.

## 🚀 Quick Start

### Using the Automated Workflow

The submission workflow runs automatically when you:
1. Push new logo files (`logo.png` or `logo.svg`) to the `blockchains/*/assets/*/` directory
2. Trigger it manually via GitHub Actions

### Manual Trigger

1. Go to **Actions** tab in your GitHub repository
2. Click **Submit Token Logos to Uniswap & MetaMask**
3. Click **Run workflow**
4. Select options for which platforms to submit to

## 📋 What the Automation Does

### 1. **Logo Validation** (`validate-logos.js`)
- ✅ Checks image dimensions (minimum 64x64px, recommended 200x200px)
- ✅ Validates file format (PNG or SVG)
- ✅ Checks file size (max 500KB)
- ✅ Verifies transparent background (for PNG)

### 2. **Uniswap Submission** (`submit-uniswap.js`)
- Generates submission format for Uniswap
- Creates `UNISWAP_SUBMISSION_INFO.md` with detailed instructions
- Identifies tokens on all supported chains
- Provides repo URL and submission guidelines

### 3. **MetaMask Submission** (`submit-metamask.js`)
- Prepares MetaMask-compatible format
- Creates `METAMASK_SUBMISSION_INFO.md` with step-by-step guide
- Filters Ethereum mainnet tokens
- Includes token verification requirements

## 📝 File Structure

```
.github/workflows/
├── submit-logos.yml              # Main submission workflow
├── validate-logos.yml            # Token list validation
└── validate-token-list.yml       # JSON schema validation

scripts/
├── validate-logos.js             # Logo dimension/format validator
├── submit-uniswap.js             # Uniswap submission generator
├── submit-metamask.js            # MetaMask submission generator
└── prepare-submission.sh          # Helper script to run locally
```

## 🎯 Adding Your Token Logos

### Step 1: Organize Your Logos

Place logos in the structure:
```
blockchains/binance-smart-chain/assets/0x{CONTRACT_ADDRESS}/logo.png
blockchains/ethereum/assets/0x{CONTRACT_ADDRESS}/logo.png
```

Or use root-level for main token:
```
evm-usd.png
```

### Step 2: Ensure Logo Requirements

- **Format**: PNG (recommended) or SVG
- **Size**: Minimum 64×64px, recommended 200×200px (square)
- **File size**: Under 500KB
- **Background**: Transparent (PNG)
- **Quality**: Clear and identifiable

### Step 3: Push to Repository

```bash
git add blockchains/
git commit -m "Add token logos for Uniswap and MetaMask"
git push origin main
```

The workflow will automatically:
1. ✅ Validate your logos
2. 📋 Generate submission instructions
3. 📊 Create a summary report

## 🔍 Running Locally

You can also run the submission preparation script locally:

```bash
# Install dependencies
npm install sharp axios

# Run validation and preparation
bash scripts/prepare-submission.sh
```

## 📤 Submitting to Uniswap

After the workflow completes:

1. Check generated file: `UNISWAP_SUBMISSION_INFO.md`
2. Visit: https://github.com/Uniswap/default-token-list
3. Fork the repository
4. Create a new branch: `add-tokens-{your-token-name}`
5. Add tokens to `src/tokens/{network}.json`
6. Add logos to `assets/` directory
7. Push changes and create a pull request
8. Reference your token list repository in the PR description

## 🎭 Submitting to MetaMask

After the workflow completes:

1. Check generated file: `METAMASK_SUBMISSION_INFO.md`
2. Visit: https://github.com/MetaMask/eth-contract-metadata
3. Fork the repository
4. Create a new branch: `add-tokens-{your-token-name}`
5. Add to `src/tokens/ethereum.json` in the specified format
6. Add logo images to `images/ethereum/` directory
7. Ensure contracts are verified on Etherscan
8. Push changes and create a pull request
9. Include verification proof and liquidity evidence

## ✅ Requirements for Acceptance

### Uniswap
- [ ] Active liquidity pool(s)
- [ ] Community adoption
- [ ] Logo meets specifications
- [ ] Trademark compliance

### MetaMask
- [ ] Contract verified on Etherscan
- [ ] Sufficient trading volume
- [ ] Community usage proof
- [ ] Logo: 200×200px PNG, transparent background
- [ ] No trademark issues

## 📊 Generated Files

After each run, the workflow generates:

- **`UNISWAP_SUBMISSION_INFO.md`** - Complete Uniswap submission guide
- **`METAMASK_SUBMISSION_INFO.md`** - Complete MetaMask submission guide
- **`submission-summary.json`** - Summary of submission preparation
- **`validation-results.json`** - Logo validation results

## 🐛 Troubleshooting

### Workflow Failed to Run

**Problem**: GitHub Actions workflow doesn't trigger
**Solution**: 
- Ensure files were pushed to `main` branch
- Check if files match the path patterns in the workflow
- Verify GitHub token has proper permissions

### Logo Validation Errors

**Problem**: "Image size below minimum"
**Solution**: Ensure logos are at least 64×64px (recommended 200×200px)

**Problem**: "File size exceeds maximum"
**Solution**: Compress PNG or convert to optimized SVG

### Submission Format Issues

**Problem**: "Invalid address format"
**Solution**: Use full checksummed Ethereum addresses (0x...)

## 🤖 Automation Features

### Auto-Detect Changes
The workflow automatically detects when you add or update logos and:
- Validates them immediately
- Generates submission-ready formats
- Creates PRs if configured

### Scheduled Checks (Optional)
You can schedule periodic validations by adding to the workflow:
```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at midnight
```

## 🔐 Security

- GitHub Actions runs in isolated environments
- Uses minimal permissions (read-only for content)
- No secrets are exposed in logs
- All operations are auditable

## 📞 Support

For issues with:
- **Logos**: Check `validation-results.json`
- **Submission format**: Review generated `.md` files
- **GitHub Actions**: Check workflow logs in Actions tab

## 🎓 Learn More

- [Uniswap Token List](https://github.com/Uniswap/default-token-list)
- [MetaMask Contract Metadata](https://github.com/MetaMask/eth-contract-metadata)
- [Token Lists Specification](https://tokenlists.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
