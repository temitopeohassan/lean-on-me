export type BorrowerStatus = "active" | "defaulted" | "repaid";
export type RiskCategory = "low" | "medium" | "high";
export type ReputationTier = "A" | "B" | "C" | "D";
export type RequestStatus = "pending" | "funded" | "cancelled";
export type AgreementStatus = "active" | "repaid" | "defaulted";

export interface EASAttestation {
  attestationId: string;
  issuer: string; // address
  type: "incomeProof" | "identity" | "peerTrust" | "employment";
  value: string;
  issuedAt: string; // ISO timestamp
  verified: boolean;
}

export interface LoanRequest {
  loanId: string;
  borrower: string; // address
  amount: number; // float in MCP; store as numeric in DB
  durationDays: number;
  purpose: string;
  requestedAt: string; // ISO timestamp
  reputationScoreAtRequest: number; // float
  collateralAmount: number; // float
  status: RequestStatus;
}

export interface LoanAgreement {
  loanId: string;
  borrower: string; // address
  lender: string; // address
  fundedAt: string; // ISO timestamp
  repaymentDue: string; // ISO timestamp
  amountFunded: number; // float
  interestRate: number; // float
  repaymentAmount: number; // float
  status: AgreementStatus;
}

export interface ReputationProfile {
  walletAddress: string;
  score: number; // float
  tier: ReputationTier;
  lastUpdated: string; // ISO timestamp
}


