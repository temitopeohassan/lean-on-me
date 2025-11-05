# Lean On Me Frontend

Frontend for the P2P Micro-Lending platform built with Next.js, Reown AppKit, Wagmi, and Viem.

## Features

- **Wallet Integration**: Reown AppKit for wallet connection (WalletConnect compatible)
- **Smart Contract Integration**: Direct interaction with deployed contracts on Base
- **Backend API Integration**: RESTful API calls to the backend service
- **Real-time Data**: Live reputation scores, loan requests, and agreements

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` with your values:

```env
# Reown AppKit Project ID (get from https://dashboard.reown.com)
NEXT_PUBLIC_REOWN_PROJECT_ID=your-project-id-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Contract Addresses (from your Base mainnet deployment)
NEXT_PUBLIC_REPUTATION_ENGINE_ADDRESS=0x...
NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS=0x...
```

### 3. Get Reown Project ID

1. Visit [Reown Dashboard](https://dashboard.reown.com)
2. Create a new project
3. Copy your Project ID
4. Add it to `.env.local`

### 4. Update Contract Addresses

After deploying contracts to Base mainnet:

1. Get the contract addresses from the deployment output
2. Update `NEXT_PUBLIC_REPUTATION_ENGINE_ADDRESS` and `NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS` in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Architecture

### Wallet Integration

- **AppKit Provider**: Wraps the app with Reown AppKit and Wagmi providers
- **Hooks**: `useAppKitAccount`, `useBalance`, `useSendTransaction` from Wagmi
- **Network**: Configured for Base mainnet (Chain ID: 8453)

### Smart Contract Integration

- **Hooks**: Custom hooks in `hooks/` directory
  - `use-reputation.ts`: Fetch and update reputation scores
  - `use-loan-contract.ts`: Create, fund, and repay loans
- **Contracts**: Contract ABIs and addresses in `lib/contracts.ts`

### Backend Integration

- **API Service**: `lib/api.ts` provides methods for backend API calls
- **Endpoints**: Reputation, loan requests, funding, repayment

### Components

- **Navigation**: Shows wallet connection status and balance
- **Reputation Card**: Displays live reputation score from onchain/backend
- **Dashboard**: Real-time loan and reputation data

## Key Files

- `providers/appkit-provider.tsx`: AppKit and Wagmi provider setup
- `lib/config.ts`: Configuration constants
- `lib/api.ts`: Backend API service
- `lib/contracts.ts`: Contract ABIs and addresses
- `hooks/use-reputation.ts`: Reputation hooks
- `hooks/use-loan-contract.ts`: Loan contract hooks

## Development

### Adding New Contract Interactions

1. Add contract ABI to `lib/contracts.ts`
2. Create a custom hook in `hooks/`
3. Use the hook in your components

### Adding New API Endpoints

1. Add method to `lib/api.ts`
2. Create TypeScript interfaces for request/response
3. Use in components with React Query

## Troubleshooting

### Wallet Connection Issues

- Ensure `NEXT_PUBLIC_REOWN_PROJECT_ID` is set correctly
- Check browser console for errors
- Verify Base network is selected in wallet

### Contract Calls Failing

- Verify contract addresses in `.env.local` match deployed contracts
- Check that you're on Base network
- Ensure contract ABIs are up to date

### Backend API Errors

- Verify `NEXT_PUBLIC_API_URL` points to running backend
- Check backend logs for errors
- Ensure CORS is configured correctly

