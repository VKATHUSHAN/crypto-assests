# Token List Submission Guide

This repository contains a token list following the [Token Lists specification](https://tokenlists.org/) for VKATHUSHAN wrapped USDT tokens on Ethereum and Optimism networks.

## Token List Details

- **Name**: VKATHUSHAN Token List
- **URL**: `https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json`
- **Version**: 1.1.0
- **Chains Supported**: Ethereum (1), Optimism (10)

## Tokens Included

1. **Tether USD Coin Wrapped** (USDT) - Ethereum
   - Address: `0xC248D1Ea863FDD815df60248F1358dEe6E771eC7`
   - Decimals: 6

2. **Tether USD Wrapped EVM** (USDT) - Ethereum  
   - Address: `0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D`
   - Decimals: 6

3. **Wrapped Tether USD Coin** (USDT.w) - Optimism
   - Address: `0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D`
   - Decimals: 18

## MetaMask Submission

### Prerequisites
- [ ] Token contracts are verified on Etherscan/Optimistic Etherscan
- [ ] Tokens have sufficient liquidity and trading volume
- [ ] Logo images are hosted on GitHub and accessible via HTTPS
- [ ] Token list follows the official specification

### Submission Process
1. Fork the [MetaMask token lists repository](https://github.com/MetaMask/eth-contract-metadata)
2. Add token metadata to the appropriate network files
3. Submit a pull request with:
   - Contract verification links
   - Trading volume evidence
   - Community usage proof
   - Logo compliance confirmation

### Required Information
```json
{
  "0xC248D1Ea863FDD815df60248F1358dEe6E771eC7": {
    "name": "Tether USD Coin Wrapped",
    "logo": "evm-usd.png",
    "erc20": true,
    "symbol": "USDT",
    "decimals": 6
  }
}
```

## Uniswap Submission

### Prerequisites
- [ ] Token is deployed on a supported network
- [ ] Token has active liquidity pools
- [ ] Community adoption and usage
- [ ] Logo meets size requirements (200x200px recommended)

### Submission Process
1. Fork the [Uniswap default token list](https://github.com/Uniswap/default-token-list)
2. Add tokens to `src/tokens/{network}.json`
3. Add logos to `assets/` directory
4. Run validation tests
5. Submit pull request

### Community Lists Alternative
Since getting into the default list is competitive, consider:
1. Host your own token list (already done ✅)
2. Submit to community token lists
3. Share your token list URL: `https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json`

## Validation

### Token List Validation
```bash
# Install token list validator
npm install @uniswap/token-lists

# Validate the token list
npx token-lists-cli validate tokenlist.json
```

### Logo Requirements
- Format: PNG or SVG
- Size: Minimum 64x64px, recommended 200x200px
- Background: Transparent
- Hosted: HTTPS accessible (GitHub raw content)

## Adding to Wallets

### MetaMask
Users can add the token list URL in MetaMask:
1. Go to Settings → Networks → Add Token List
2. Enter: `https://raw.githubusercontent.com/VKATHUSHAN/crypto-assests/main/tokenlist.json`

### Other Wallets
Most wallets supporting token lists can import using the same URL.

## Network Details

### Ethereum Mainnet (ChainID: 1)
- RPC: `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`
- Explorer: `https://etherscan.io`

### Optimism (ChainID: 10)
- RPC: `https://mainnet.optimism.io`
- Explorer: `https://optimistic.etherscan.io`

## Legal Considerations

- Ensure compliance with local regulations
- Verify token contract ownership and permissions
- Consider trademark implications for token names
- Review platform-specific terms of service

## Support

For issues related to this token list:
- Create an issue in this repository
- Contact: VKATHUSHAN

## License

This token list is provided under MIT License. See [LICENSE](LICENSE) for details.