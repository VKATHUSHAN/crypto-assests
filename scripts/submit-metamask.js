#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const METAMASK_REPO = 'MetaMask/eth-contract-metadata';

async function readTokenList() {
  const tokenList = JSON.parse(fs.readFileSync('tokenlist.json', 'utf8'));
  return tokenList.tokens || [];
}

async function readMetaMaskSubmission() {
  if (fs.existsSync('metamask-submission.json')) {
    return JSON.parse(fs.readFileSync('metamask-submission.json', 'utf8'));
  }
  return {};
}

async function submitToMetaMask() {
  try {
    console.log('🚀 Starting MetaMask submission process...\n');

    const tokens = await readTokenList();
    const mmSubmission = await readMetaMaskSubmission();

    // Filter Ethereum mainnet tokens (chainId: 1)
    const ethereumTokens = tokens.filter(t => t.chainId === 1);
    
    console.log(`📋 Found ${ethereumTokens.length} Ethereum token(s)\n`);

    // Prepare MetaMask submission format
    const mmData = {};
    
    ethereumTokens.forEach(token => {
      const checksumAddress = token.address.toLowerCase();
      mmData[checksumAddress] = {
        name: token.name,
        logo: token.logoURI ? path.basename(token.logoURI) : `${checksumAddress}.png`,
        erc20: true,
        symbol: token.symbol,
        decimals: token.decimals,
        tags: token.tags || [],
      };
    });

    console.log('📝 MetaMask submission format:');
    console.log(JSON.stringify(mmData, null, 2));

    const prInstructions = `
## MetaMask Token Submission

### Tokens Submitted:
${ethereumTokens.map(t => `- **${t.symbol}** (${t.name}) - \`${t.address}\``).join('\n')}

### How to Submit:
1. Go to: https://github.com/${METAMASK_REPO}
2. Fork the repository
3. Create a new folder structure: \`src/tokens/\` if not exists
4. Add or update the file \`src/tokens/ethereum.json\` with:

\`\`\`json
${JSON.stringify(mmData, null, 2)}
\`\`\`

5. Place logo images in \`images/\` directory with naming: \`{chainId}/{address}.png\`
   Example: \`images/ethereum/${ethereumTokens[0]?.address.toLowerCase()}.png\`

6. Ensure all tokens are:
   - ✅ Contract verified on Etherscan
   - ✅ Have sufficient trading volume
   - ✅ Have community adoption

7. Submit a pull request with:
   - Verification links
   - Trading volume evidence
   - Community usage proof
   - Logo compliance confirmation

### Requirements for Acceptance:
- Token contracts must be verified on Etherscan
- Token must have active liquidity
- Community adoption and user base
- Logo: PNG format, 200x200px minimum, transparent background
- File size: < 500KB

### Current Token Status:
${ethereumTokens.map(t => {
  const status = mmSubmission[t.address.toLowerCase()] ? '✓ Already in submission' : '○ New submission';
  return `- ${status}: ${t.symbol} (${t.name})`;
}).join('\n')}

---
*This submission was prepared by GitHub Actions on ${new Date().toISOString()}*
    `;

    fs.writeFileSync('METAMASK_SUBMISSION_INFO.md', prInstructions);

    console.log('\n📄 Submission instructions saved to METAMASK_SUBMISSION_INFO.md');
    console.log('✨ MetaMask submission prepared! Follow the instructions above.\n');

    // Create summary
    const summary = {
      provider: 'MetaMask',
      status: 'prepared',
      tokensCount: ethereumTokens.length,
      chainId: 1,
      timestamp: new Date().toISOString(),
      repoUrl: `https://github.com/${METAMASK_REPO}`,
      instructionsFile: 'METAMASK_SUBMISSION_INFO.md',
      tokenAddresses: ethereumTokens.map(t => ({
        address: t.address,
        symbol: t.symbol,
        name: t.name,
      })),
    };

    return summary;
  } catch (error) {
    console.error('❌ MetaMask submission failed:', error.message);
    return {
      provider: 'MetaMask',
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

submitToMetaMask()
  .then(result => {
    const summary = require('fs').existsSync('submission-summary.json')
      ? JSON.parse(fs.readFileSync('submission-summary.json', 'utf8'))
      : {};
    summary.metamask = result;
    fs.writeFileSync('submission-summary.json', JSON.stringify(summary, null, 2));
    console.log('Summary saved to submission-summary.json');
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
