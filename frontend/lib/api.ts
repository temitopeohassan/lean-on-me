import { API_URL } from "./config"

export interface LoanRequest {
  loanId: string
  borrower: string
  amount: number
  durationDays: number
  purpose: string
  collateralAmount: number
}

export interface ReputationProfile {
  walletAddress: string
  score: number
  tier: "A" | "B" | "C" | "D"
  lastUpdated: string
}

export interface LoanAgreement {
  loanId: string
  borrower: string
  lender: string
  fundedAt: string
  repaymentDue: string
  amountFunded: number
  interestRate: number
  repaymentAmount: number
  status: "active" | "repaid" | "defaulted"
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getReputation(address: string): Promise<ReputationProfile> {
    const response = await fetch(`${this.baseUrl}/api/reputation/${address}`)
    if (!response.ok) throw new Error("Failed to fetch reputation")
    return response.json()
  }

  async updateReputation(address: string, deltaScore: number, isIncrease: boolean): Promise<ReputationProfile> {
    const response = await fetch(`${this.baseUrl}/api/reputation/${address}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltaScore, isIncrease }),
    })
    if (!response.ok) throw new Error("Failed to update reputation")
    return response.json()
  }

  async createLoanRequest(request: LoanRequest): Promise<{ loanId: string; requestedAt: string }> {
    const response = await fetch(`${this.baseUrl}/api/loans/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create loan request")
    }
    return response.json()
  }

  async fundLoan(loanId: string, lender: string, amountFunded: number, interestRate: number): Promise<{ loanId: string; fundedAt: string }> {
    const response = await fetch(`${this.baseUrl}/api/loans/fund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loanId, lender, amountFunded, interestRate }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fund loan")
    }
    return response.json()
  }

  async repayLoan(loanId: string, repaymentAmount: number): Promise<{ loanId: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/api/loans/repay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loanId, repaymentAmount }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to repay loan")
    }
    return response.json()
  }

  async defaultLoan(loanId: string): Promise<{ loanId: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/api/loans/default`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loanId }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to mark loan as default")
    }
    return response.json()
  }
}

export const api = new ApiService(API_URL)

