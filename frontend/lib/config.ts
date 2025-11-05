// AppKit configuration
// IMPORTANT: Set NEXT_PUBLIC_REOWN_PROJECT_ID in your Vercel environment variables
// Get your project ID from https://dashboard.reown.com
export const projectId: string = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "your-project-id"

// Base network configuration
export const baseNetwork = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
} as const

// Backend API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Contract addresses (update these with your deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  REPUTATION_ENGINE: process.env.NEXT_PUBLIC_REPUTATION_ENGINE_ADDRESS || "",
  LOAN_CONTRACT: process.env.NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS || "",
} as const

