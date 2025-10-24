# Contributing guidelines — token logos & tokenlist

Short checklist for adding token logos and editing tokenlist.json:

1. Images
   - Path: blockchains/<chain-name>/assets/<lowercase-address>/logo.png
   - File: logo.png (PNG, square)
   - Sizes: ideally 256x256 (smaller allowed), transparent background preferred.
   - Filenames and address folder MUST be lowercase (some tooling expects lowercase paths).

2. tokenlist.json
   - Always reference CDN URLs (jsDelivr) or files on the main branch:
     Example:
     https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/blockchains/binance-smart-chain/assets/0x.../logo.png
   - Normalize token addresses to lowercase in tokenlist.json.
   - Validate JSON with jq or jsonlint.
   - Run the Uniswap tokenlist validator locally:
     npx @uniswap/tokenlist-validator tokenlist.json

3. Pull Request
   - Create a topic branch for your change.
   - Include a short description and checklist in the PR body:
     - image file added at correct path
     - tokenlist.json updated and validated
     - timestamp updated
   - The repository has a CI workflow that validates tokenlist.json and checks logoURLs.

By following the above, we avoid broken raw GitHub URLs that point to temporary branches and ensure wallets can reliably fetch logos.
