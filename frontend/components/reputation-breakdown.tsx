"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ReputationFactor {
  name: string
  value: number
  weight: number
  verified: boolean
}

const factors: ReputationFactor[] = [
  { name: "Wallet Age", value: 95, weight: 25, verified: true },
  { name: "Transaction Volume", value: 88, weight: 20, verified: true },
  { name: "Repayment History", value: 100, weight: 30, verified: true },
  { name: "Income Verification", value: 75, weight: 15, verified: true },
  { name: "Collateral Ratio", value: 92, weight: 10, verified: true },
]

export default function ReputationBreakdown() {
  const totalScore = Math.round(factors.reduce((sum, f) => sum + (f.value * f.weight) / 100, 0))

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reputation Breakdown</span>
          <span className="text-2xl font-bold text-primary">{totalScore}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{factor.name}</span>
                {factor.verified && <CheckCircle2 className="w-4 h-4 text-accent" />}
              </div>
              <span className="text-sm font-bold text-primary">{factor.value}%</span>
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
            <p>Your reputation score is calculated based on verified onchain data and income proofs.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
