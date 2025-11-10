# Lean On Me

Lean On Me is a peer-to-peer micro-lending platform that combines onchain smart contracts with an offchain reputation engine. Borrowers can publish loan requests, lenders can review live opportunities, and reputation scores help both sides make informed decisions.

## Tech Stack Overview
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, TanStack Query
- **Wallet & EVM:** Reown AppKit with the Wagmi adapter running on Base
- **Smart Contracts:** Hardhat TypeScript workspace with deployment scripts
- **Backend API:** Express + TypeScript with automatic Supabase schema sync at startup
- **Database:** Supabase Postgres for reputations, loan requests, and agreements

## Reown AppKit Integration
The frontend initializes Reown AppKit in a dedicated client provider (`frontend/providers/appkit-provider.tsx`). On the client:
- `createAppKit` bootstraps the Reown modal, metadata, and supported Base network configuration.
- A `WagmiAdapter` supplies the generated Wagmi configuration, which is passed to `WagmiProvider`.
- `AppKitProvider` wraps the entire app, ensuring hooks like `useAppKitAccount` and `useAppKit` are available for wallet connect, account management, and balance queries.

Components such as `Navigation`, `DashboardPreview`, and loan workflows consume these hooks to detect wallet connection state, read balances with `useBalance`, and drive lending actions. This approach keeps wallet UX consistent while letting Wagmi handle contract reads/writes through the AppKit adapter.

# lean-on-me
A peer to peer loan application
