"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ReputationFactor } from "@/hooks/use-dashboard-summary";

interface ReputationBreakdownProps {
  factors?: ReputationFactor[];
  totalScore?: number;
  isConnected?: boolean;
}

export default function ReputationBreakdown({ factors = [], totalScore, isConnected = false }: ReputationBreakdownProps) {
  const calculatedScore =
    typeof totalScore === "number"
      ? totalScore
      : Math.round(factors.reduce((sum, f) => sum + (f.value * f.weight) / 100, 0));

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reputation Breakdown</span>
          <span className="text-2xl font-bold text-muted">
            {Number.isFinite(calculatedScore) ? calculatedScore : "--"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {factors.length === 0 && !isConnected && (
          <p className="text-sm text-muted">Connect your wallet to retrieve detailed reputation insights from the reputation engine.</p>
        )}
        {factors.length === 0 && isConnected && (
          <p className="text-sm text-muted">No reputation factors available yet. Complete more onchain activity to build your profile.</p>
        )}
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{factor.name}</span>
                {factor.verified && <CheckCircle2 className="w-4 h-4 text-accent" />}
              </div>
              <span className="text-sm font-bold text-muted">{factor.value}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={factor.value} className="flex-1" />
              <span className="text-xs text-muted w-8 text-right">{factor.weight}%</span>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 text-sm text-muted">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Your reputation score is generated from verified onchain activity and submitted income proofs.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
