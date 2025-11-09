"use client";

import { useMemo, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoanRequestsList from "./dashboard/loan-requests-list";
import LenderOpportunities from "./dashboard/lender-opportunities";
import UserProfile from "./user-profile";
import ReputationBreakdown from "./reputation-breakdown";
import { useReputation } from "@/hooks/use-reputation";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import type { Address } from "viem";

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
};

const formatPercent = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(1)}%`;
};

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview");
  const { address } = useAppKitAccount();
  const walletAddress = address as Address | undefined;
  const normalizedAddress = walletAddress?.toLowerCase();
  const queryClient = useQueryClient();

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useDashboardSummary(normalizedAddress);
  const {
    reputation,
    isLoading: reputationLoading,
    error: reputationError,
  } = useReputation(walletAddress);

  const isLoading = summaryLoading || reputationLoading;
  const metrics = summary?.metrics;

  const totalScore = useMemo(() => {
    if (reputation?.score) return reputation.score;
    if (!summary?.reputationFactors?.length) return undefined;
    const computed = summary.reputationFactors.reduce((sum, factor) => sum + (factor.value * factor.weight) / 100, 0);
    return Math.round(computed);
  }, [reputation?.score, summary?.reputationFactors]);

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-3xl font-semibold">Connect your wallet</h2>
        <p className="text-muted">
          Link your wallet to view personalized borrowing and lending insights powered by the Lean On Me protocol.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfile
            address={address}
            reputationScore={reputation?.score}
            tier={reputation?.tier}
            status={metrics?.activeLoans && metrics.activeLoans > 0 ? "Active" : "Idle"}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted">Manage your loans, reputation, and lending activities</p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-sm text-muted hover:text-foreground"
                onClick={() => {
                  refetchSummary();
                  if (address) {
                    queryClient.invalidateQueries({ queryKey: ["reputation", address] });
                  }
                }}
              >
                Refresh data
              </button>
            </div>
          </div>
          {summaryError && (
            <p className="text-sm text-destructive mt-2">
              Unable to load protocol data from the API. Please try again shortly.
            </p>
          )}
          {reputationError && (
            <p className="text-sm text-destructive mt-2">
              Unable to sync your reputation profile. Please verify your connection and try again.
            </p>
          )}
        </div>

        {isLoading ? (
          <Card className="bg-surface border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted">Syncing your dashboard...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-surface border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="borrow">Borrow</TabsTrigger>
              <TabsTrigger value="lend">Lend</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ReputationBreakdown
                    factors={summary?.reputationFactors}
                    totalScore={totalScore}
                    isConnected={!!walletAddress}
                  />
                </div>
                <div className="space-y-6">
                  <Card className="bg-surface border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted">Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metrics?.activeLoans ?? 0}</div>
                      <p className="text-sm text-muted mt-2">
                        {metrics?.totalBorrowed ? `${formatCurrency(metrics.totalBorrowed)} borrowed` : "No active loans"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-surface border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted">Yield Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent">{formatCurrency(metrics?.yieldEarned)}</div>
                      <p className="text-sm text-muted mt-2">From settled lending agreements</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {summary?.recentActivity?.length ? (
                      summary.recentActivity.map((activity) => (
                        <div
                          key={`${activity.loanId}-${activity.status}-${activity.fundedAt ?? activity.repaymentDue ?? ""}`}
                          className="flex justify-between items-center pb-4 last:pb-0 last:border-0 border-b border-border"
                        >
                          <div>
                            <p className="font-medium capitalize">{activity.status}</p>
                            <p className="text-sm text-muted">Loan #{activity.loanId}</p>
                            {activity.fundedAt && (
                              <p className="text-xs text-muted">
                                {new Date(activity.fundedAt).toLocaleString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                          <span className="text-accent font-medium">{formatCurrency(activity.amountFunded)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No recent loan activity yet.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle>Protocol Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Total Liquidity</span>
                      <span className="font-bold">{formatCurrency(metrics?.totalLiquidity)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Active Loans</span>
                      <span className="font-bold">{metrics?.activeLoans ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Repayment Rate</span>
                      <span className="font-bold text-accent">{formatPercent(metrics?.repaymentRate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Repaid Loans</span>
                      <span className="font-bold">{metrics?.repaidLoans ?? 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="borrow">
              <LoanRequestsList
                loans={summary?.borrowerLoans ?? []}
                isLoading={summaryLoading}
                onCreateRequest={async () => {
                  await refetchSummary();
                }}
              />
            </TabsContent>

            <TabsContent value="lend">
              <LenderOpportunities opportunities={summary?.lenderOpportunities ?? []} isLoading={summaryLoading} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
