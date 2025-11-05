import { Address } from "viem"
import { CONTRACT_ADDRESSES } from "./config"

// ReputationEngine ABI (simplified - add full ABI from hardhat artifacts)
export const REPUTATION_ENGINE_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getReputation",
    outputs: [
      { name: "walletAddress", type: "address" },
      { name: "score", type: "uint256" },
      { name: "tier", type: "uint8" },
      { name: "lastUpdated", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

// LoanContract ABI (simplified - add full ABI from hardhat artifacts)
export const LOAN_CONTRACT_ABI = [
  {
    inputs: [
      { name: "loanId", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "durationDays", type: "uint256" },
      { name: "purpose", type: "string" },
      { name: "collateralAmount", type: "uint256" },
    ],
    name: "createLoanRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "loanId", type: "string" },
      { name: "interestRateBps", type: "uint256" },
    ],
    name: "fundLoan",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "loanId", type: "string" }],
    name: "repayLoan",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "loanId", type: "string" }],
    name: "penalizeDefault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "string" }],
    name: "loanIdToRequest",
    outputs: [
      { name: "loanId", type: "string" },
      { name: "borrower", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "durationDays", type: "uint256" },
      { name: "purpose", type: "string" },
      { name: "requestedAt", type: "uint256" },
      { name: "reputationScoreAtRequest", type: "uint256" },
      { name: "collateralAmount", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export const REPUTATION_ENGINE_ADDRESS = CONTRACT_ADDRESSES.REPUTATION_ENGINE as Address
export const LOAN_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.LOAN_CONTRACT as Address

