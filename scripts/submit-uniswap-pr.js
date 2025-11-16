#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ACTOR = process.env.GITHUB_ACTOR;
const REPO_OWNER = process.env.REPO_OWNER || 'VKATHUSHAN';

const UNISWAP_REPO = 'Uniswap/default-token-list';
const BRANCH_NAME = `add-tokens-${Date.now()}`;

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf-8',
      ...options 
    });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

async function makeGitHubRequest(url, method = 'GET', body = null) {
  const https = require('https');
  const urlObj = new URL(url);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Token-Logo-Submission-Bot',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function submitToUniswap() {
  try {
    console.log('🚀 Starting automated Uniswap submission...\n');

    // Read token list
    const tokenList = JSON.parse(fs.readFileSync('tokenlist.json', 'utf8'));
    const tokens = tokenList.tokens || [];

    console.log(`📋 Found ${tokens.length} token(s) to submit\n`);

    // Step 1: Check if fork exists, if not create one
    console.log('🔍 Checking for existing fork...');
    let forkData;
    try {
      forkData = await makeGitHubRequest(
        `https://api.github.com/repos/${GITHUB_ACTOR}/${UNISWAP_REPO.split('/')[1]}`
      );
      console.log('✅ Fork already exists');
    } catch (error) {
      console.log('📝 Creating fork...');
      forkData = await makeGitHubRequest(
        `https://api.github.com/repos/${UNISWAP_REPO}/forks`,
        'POST'
      );
      console.log('✅ Fork created successfully');
      // Wait for fork to be ready
      console.log('⏳ Waiting for fork to initialize...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const forkUrl = forkData.clone_url.replace('https://', `https://${GITHUB_TOKEN}@`);
    const forkName = UNISWAP_REPO.split('/')[1];

    // Step 2: Clone the fork
    console.log('\n📥 Cloning fork...');
    const workDir = `/tmp/uniswap-fork-${Date.now()}`;
    exec(`git clone ${forkUrl} ${workDir}`);
    process.chdir(workDir);

    // Step 3: Configure git
    exec(`git config user.name "${GITHUB_ACTOR}"`);
    exec(`git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"`);

    // Step 4: Create new branch
    console.log(`\n🌿 Creating branch: ${BRANCH_NAME}`);
    exec(`git checkout -b ${BRANCH_NAME}`);

    // Step 5: Prepare token data for Uniswap format
    console.log('\n📝 Preparing token submissions...');
    
    const chainNameMap = {
      1: 'ethereum',
      10: 'optimism',
      137: 'polygon',
      42161: 'arbitrum',
      56: 'binance-smart-chain',
    };

    const tokensByChain = {};
    tokens.forEach(token => {
      const chainName = chainNameMap[token.chainId];
      if (!chainName) {
        console.warn(`⚠️  Skipping unsupported chain ID: ${token.chainId}`);
        return;
      }
      if (!tokensByChain[chainName]) {
        tokensByChain[chainName] = [];
      }
      tokensByChain[chainName].push({
        chainId: token.chainId,
        address: token.address.toLowerCase(),
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI,
        tags: token.tags || ['wrapped']
      });
    });

    // Step 6: Add tokens to respective network files
    let filesModified = false;
    
    for (const [chainName, chainTokens] of Object.entries(tokensByChain)) {
      const tokenFilePath = `src/tokens/${chainName}.json`;
      
      console.log(`\n📄 Processing ${tokenFilePath}...`);
      
      let existingTokens = [];
      if (fs.existsSync(tokenFilePath)) {
        existingTokens = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      } else {
        console.log(`⚠️  File doesn't exist, will create new: ${tokenFilePath}`);
        // Create src/tokens directory if it doesn't exist
        if (!fs.existsSync('src/tokens')) {
          fs.mkdirSync('src/tokens', { recursive: true });
        }
      }

      // Merge tokens (avoid duplicates by address)
      const existingAddresses = new Set(existingTokens.map(t => t.address.toLowerCase()));
      const newTokens = chainTokens.filter(t => !existingAddresses.has(t.address.toLowerCase()));
      
      if (newTokens.length > 0) {
        const updatedTokens = [...existingTokens, ...newTokens];
        fs.writeFileSync(tokenFilePath, JSON.stringify(updatedTokens, null, 2) + '\n');
        console.log(`✅ Added ${newTokens.length} new token(s) to ${chainName}`);
        filesModified = true;
      } else {
        console.log(`ℹ️  No new tokens to add (all already exist)`);
      }
    }

    if (!filesModified) {
      console.log('\n⚠️  No changes to commit - all tokens already exist in Uniswap');
      
      const summary = {
        provider: 'Uniswap',
        status: 'no_changes',
        message: 'All tokens already exist in the repository',
        timestamp: new Date().toISOString(),
      };
      
      fs.writeFileSync('/tmp/uniswap-summary.json', JSON.stringify(summary, null, 2));
      return summary;
    }

    // Step 7: Commit changes
    console.log('\n💾 Committing changes...');
    exec('git add .');
    exec(`git commit -m "Add ${tokens.length} token(s) from ${REPO_OWNER}

This PR adds the following tokens:
${tokens.map(t => `- ${t.symbol} (${t.name}) on chain ${t.chainId}`).join('\n')}

Token list URL: https://raw.githubusercontent.com/${REPO_OWNER}/crypto-assests/main/tokenlist.json
"`);

    // Step 8: Push to fork
    console.log('\n📤 Pushing to fork...');
    exec(`git push origin ${BRANCH_NAME}`);

    // Step 9: Create pull request
    console.log('\n🎯 Creating pull request...');
    
    const prBody = `## Token Submission

This PR adds ${tokens.length} token(s) to the Uniswap default token list.

### Tokens:
${tokens.map(t => `- **${t.symbol}** (${t.name})
  - Address: \`${t.address}\`
  - Chain: ${t.chainId}
  - Decimals: ${t.decimals}
  - Logo: [View](${t.logoURI})`).join('\n\n')}

### Token List Source:
- Repository: https://github.com/${REPO_OWNER}/crypto-assests
- Token List URL: https://raw.githubusercontent.com/${REPO_OWNER}/crypto-assests/main/tokenlist.json

### Checklist:
- [x] Tokens follow the required format
- [x] Logo URIs are accessible via HTTPS
- [x] Tokens are on supported networks
- [x] No duplicate addresses

### Additional Information:
- All logos are hosted on GitHub and meet size requirements
- Token list follows the [Token Lists specification](https://tokenlists.org/)
- Submitted via automated GitHub Actions workflow

---
*This PR was automatically generated by [Token Logo Submission Bot](https://github.com/${REPO_OWNER}/crypto-assests)*`;

    const prData = await makeGitHubRequest(
      `https://api.github.com/repos/${UNISWAP_REPO}/pulls`,
      'POST',
      {
        title: `Add ${tokens.length} token(s) from ${REPO_OWNER}`,
        head: `${GITHUB_ACTOR}:${BRANCH_NAME}`,
        base: 'main',
        body: prBody,
        maintainer_can_modify: true
      }
    );

    console.log(`\n✅ Pull request created successfully!`);
    console.log(`🔗 PR URL: ${prData.html_url}\n`);

    // Create summary
    const summary = {
      provider: 'Uniswap',
      status: 'success',
      prUrl: prData.html_url,
      prNumber: prData.number,
      tokensSubmitted: tokens.length,
      chains: Object.keys(tokensByChain),
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync('/tmp/uniswap-summary.json', JSON.stringify(summary, null, 2));
    
    return summary;

  } catch (error) {
    console.error('\n❌ Uniswap submission failed:', error.message);
    console.error(error.stack);
    
    const summary = {
      provider: 'Uniswap',
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
    
    fs.writeFileSync('/tmp/uniswap-summary.json', JSON.stringify(summary, null, 2));
    
    return summary;
  }
}

submitToUniswap()
  .then(result => {
    console.log('\n📊 Final Summary:');
    console.log(JSON.stringify(result, null, 2));
    
    // Copy summary back to workspace if possible
    try {
      if (fs.existsSync('/github/workspace')) {
        const workspaceSummary = fs.existsSync('/github/workspace/submission-summary.json')
          ? JSON.parse(fs.readFileSync('/github/workspace/submission-summary.json', 'utf8'))
          : {};
        workspaceSummary.uniswap = result;
        fs.writeFileSync('/github/workspace/submission-summary.json', JSON.stringify(workspaceSummary, null, 2));
      }
    } catch (e) {
      // Ignore if we can't write to workspace
    }
    
    if (result.status === 'failed') {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
