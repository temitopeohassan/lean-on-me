# Lean-on-me Hardhat

This Hardhat workspace implements the onchain components described in `mcp/mcp.json`:

- ReputationEngine: tracks wallet reputation score and tier.
- LoanContract: manages loan requests, funding, repayment, and default penalties.
- Types library: shared structs and enums reflecting the MCP data models.

## Setup

```bash
cd hardhat
npm install
npm run build
```

## Deployment

### Environment Setup

Create a `.env` file in the `hardhat` directory. You can copy from `env.example`:

```bash
cp env.example .env
```

Then edit `.env` with your actual values:

```env
# Base Mainnet RPC URL
BASE_RPC_URL=https://mainnet.base.org
# Or use Alchemy/Infura: https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# Private Key (for deployment)
# WARNING: Never commit your private key! Use a dedicated deployer account.
PRIVATE_KEY=your_private_key_here

# Basescan API Key (for contract verification)
# Get your API key from https://basescan.org/apis
BASESCAN_API_KEY=your_basescan_api_key_here
```

### Local Deployment (Testing)

```bash
npm run node
# in a new terminal
npm run deploy
```

### Base Mainnet Deployment

```bash
npm run deploy:base
```

**Important:** Make sure your deployer account has sufficient ETH on Base mainnet for gas fees. You can bridge ETH to Base using [Base Bridge](https://bridge.base.org/).

## Contracts

- contracts/libraries/Types.sol: `LoanRequest`, `LoanAgreement`, `EASAttestation`, `ReputationProfile` and enums.
- contracts/ReputationEngine.sol: `getReputation`, `updateReputation` (owner-controlled for demo).
- contracts/LoanContract.sol: `createLoanRequest`, `fundLoan`, `repayLoan`, `penalizeDefault` and governance setters.

> Note: External integrations (EAS, TheGraph, Gitcoin Passport) are not wired here; stubs are represented via types. Integrations can be added in follow-up iterations.
