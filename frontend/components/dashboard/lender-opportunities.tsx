"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LenderOpportunity } from "@/hooks/use-dashboard-summary";

interface LenderOpportunitiesProps {
  opportunities: LenderOpportunity[];
  isLoading?: boolean;
  onFundLoan?: (loanId: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function LenderOpportunities({ opportunities, isLoading, onFundLoan }: LenderOpportunitiesProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Available Lending Opportunities</CardTitle>
          <CardDescription>Fund loans and earn competitive returns</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {isLoading && <p className="text-sm text-muted">Loading open loan opportunities...</p>}
        {!isLoading && opportunities.length === 0 && (
          <Card className="bg-surface border-dashed border-border">
            <CardContent className="py-6">
              <p className="text-sm text-muted">
                No active opportunities right now. Check back soon or enable notifications.
              </p>
            </CardContent>
          </Card>
        )}

        {opportunities.map((opp) => (
          <Card key={opp.loanId} className="bg-surface border-border hover:border-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                <div>
                  <p className="text-sm text-muted">Borrower</p>
                  <p className="font-mono text-sm">{opp.borrower}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Amount</p>
                  <p className="font-bold">{formatCurrency(opp.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Interest Rate</p>
                  <p className="font-bold text-accent">{opp.interestRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Duration</p>
                  <p className="font-bold">{opp.durationDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Reputation</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {opp.reputationScoreAtRequest.toFixed(0)}
                  </Badge>
                </div>
                <Button className="btn-primary" onClick={() => onFundLoan?.(opp.loanId)}>
                  Fund Loan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
