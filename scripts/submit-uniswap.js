#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ACTOR = process.env.GITHUB_ACTOR || 'crypto-assets-bot';

const UNISWAP_REPO = 'uniswap/default-token-list';
const UNISWAP_BRANCH = `add-tokens-${Date.now()}`;

async function readTokenList() {
  const tokenList = JSON.parse(fs.readFileSync('tokenlist.json', 'utf8'));
  return tokenList.tokens || [];
}

async function submitToUniswap() {
  try {
    console.log('🚀 Starting Uniswap submission process...\n');

    const tokens = await readTokenList();
    
    // Group tokens by chainId for Uniswap
    const tokensByChain = {};
    tokens.forEach(token => {
      if (!tokensByChain[token.chainId]) {
        tokensByChain[token.chainId] = [];
      }
      tokensByChain[token.chainId].push(token);
    });

    console.log(`📋 Found ${tokens.length} token(s) across ${Object.keys(tokensByChain).length} chain(s)`);
    console.log(`   Chain IDs: ${Object.keys(tokensByChain).join(', ')}\n`);

    // Map chainId to Uniswap network names
    const chainNameMap = {
      1: 'ethereum',
      10: 'optimism',
      137: 'polygon',
      42161: 'arbitrum',
      56: 'binance-smart-chain',
    };

    const submission = {
      description: 'Automated token submission via GitHub Actions',
      tokens: tokens.map(token => ({
        chainId: token.chainId,
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI,
        tags: token.tags || [],
      })),
      chainIds: Object.keys(tokensByChain).map(Number),
    };

    // Save submission details
    fs.writeFileSync('uniswap-submission.json', JSON.stringify(submission, null, 2));

    console.log('✅ Uniswap submission prepared:');
    console.log(JSON.stringify(submission, null, 2));

    // Instructions for manual submission or automated workflow
    const prInstructions = `
## Uniswap Token Submission

### Tokens Submitted:
${tokens.map(t => `- **${t.symbol}** (${t.name}) on Chain ${t.chainId}`).join('\n')}

### How to Submit:
1. Go to: https://github.com/${UNISWAP_REPO}
2. Fork the repository
3. Add the following tokens to \`src/tokens/{network}.json\`:

\`\`\`json
${JSON.stringify(tokens, null, 2)}
\`\`\`

4. Add logos to the \`assets/\` directory
5. Submit a pull request

### Alternative: Community Lists
If default list acceptance is delayed, consider:
- Uniswap Labs Community Lists: https://github.com/Uniswap/token-lists
- Or host your own: ${process.env.TOKEN_LIST_URL || 'https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json'}

---
*This submission was prepared by GitHub Actions*
    `;

    fs.writeFileSync('UNISWAP_SUBMISSION_INFO.md', prInstructions);

    console.log('\n📄 Submission instructions saved to UNISWAP_SUBMISSION_INFO.md');
    console.log('\n✨ Uniswap submission prepared! Follow the instructions above to complete the submission.\n');

    // Create summary
    const summary = {
      provider: 'Uniswap',
      status: 'prepared',
      tokensCount: tokens.length,
      chainsCount: Object.keys(tokensByChain).length,
      timestamp: new Date().toISOString(),
      repoUrl: `https://github.com/${UNISWAP_REPO}`,
      instructionsFile: 'UNISWAP_SUBMISSION_INFO.md',
    };

    return summary;
  } catch (error) {
    console.error('❌ Uniswap submission failed:', error.message);
    return {
      provider: 'Uniswap',
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

submitToUniswap()
  .then(result => {
    const summary = require('fs').existsSync('submission-summary.json')
      ? JSON.parse(fs.readFileSync('submission-summary.json', 'utf8'))
      : {};
    summary.uniswap = result;
    fs.writeFileSync('submission-summary.json', JSON.stringify(summary, null, 2));
    console.log('Summary saved to submission-summary.json');
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
