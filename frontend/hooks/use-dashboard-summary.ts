import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";

export interface DashboardMetrics {
  activeLoans: number;
  repaidLoans: number;
  defaultedLoans: number;
  totalBorrowed: number;
  totalLiquidity: number;
  totalRepaid: number;
  yieldEarned: number;
  repaymentRate: number | null;
}

export interface BorrowerLoan {
  loanId: string;
  amount: number;
  durationDays: number;
  purpose: string;
  status: string;
  requestedAt?: string;
  reputationScoreAtRequest?: number;
}

export interface LenderOpportunity {
  loanId: string;
  borrower: string;
  amount: number;
  durationDays: number;
  purpose: string;
  interestRate: number;
  reputationScoreAtRequest: number;
  requestedAt?: string;
}

export interface RecentActivity {
  loanId: string;
  status: string;
  amountFunded: number;
  repaymentAmount: number;
  borrower: string;
  lender: string;
  fundedAt?: string;
  repaymentDue?: string;
}

export interface ReputationFactor {
  name: string;
  value: number;
  weight: number;
  verified: boolean;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  borrowerLoans: BorrowerLoan[];
  lenderOpportunities: LenderOpportunity[];
  recentActivity: RecentActivity[];
  reputationFactors: ReputationFactor[];
}

const fetchDashboardSummary = async (address?: string): Promise<DashboardSummary> => {
  const params = new URLSearchParams();
  if (address) params.set("address", address.toLowerCase());

  const response = await fetch(`${API_URL}/api/dashboard/summary${params.toString() ? `?${params}` : ""}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary (${response.status})`);
  }
  const data = await response.json();
  return data as DashboardSummary;
};

export const useDashboardSummary = (address?: string) =>
  useQuery({
    queryKey: ["dashboard-summary", address?.toLowerCase() ?? "global"],
    queryFn: () => fetchDashboardSummary(address),
    staleTime: 30_000,
  });


