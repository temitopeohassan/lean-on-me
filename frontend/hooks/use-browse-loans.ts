import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import type { LenderOpportunity } from "./use-dashboard-summary";

export interface BrowseLoan extends LenderOpportunity {
  riskLevel: "low" | "medium" | "high";
  funded: number; // Amount already funded (0 for pending loans)
}

const calculateRiskLevel = (reputationScore: number): "low" | "medium" | "high" => {
  if (reputationScore >= 700) return "low";
  if (reputationScore >= 600) return "medium";
  return "high";
};

const calculateInterestRate = (reputationScore: number): number => {
  // Base rate calculation: lower reputation = higher interest rate
  // Range: 5% (high reputation) to 12% (low reputation)
  if (reputationScore >= 750) return 5.5;
  if (reputationScore >= 700) return 6.5;
  if (reputationScore >= 650) return 7.5;
  if (reputationScore >= 600) return 8.5;
  if (reputationScore >= 550) return 9.5;
  if (reputationScore >= 500) return 10.5;
  return 12.0;
};

const fetchBrowseLoans = async (): Promise<BrowseLoan[]> => {
  // Fetch all pending loan opportunities (no address filter)
  const response = await fetch(`${API_URL}/api/dashboard/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch loans (${response.status})`);
  }
  const data = await response.json();
  
  const opportunities: LenderOpportunity[] = data.lenderOpportunities || [];
  
  // Transform to BrowseLoan format with calculated fields
  return opportunities.map((opp) => {
    const reputationScore = opp.reputationScoreAtRequest || 500;
    // Calculate interest rate based on reputation (pending loans don't have interest rate set yet)
    const interestRate = calculateInterestRate(reputationScore);
    
    return {
      ...opp,
      interestRate,
      riskLevel: calculateRiskLevel(reputationScore),
      funded: 0, // Pending loans have no funding yet
    };
  });
};

export const useBrowseLoans = () => {
  return useQuery({
    queryKey: ["browse-loans"],
    queryFn: fetchBrowseLoans,
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  });
};

