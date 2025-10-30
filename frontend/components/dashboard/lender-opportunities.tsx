"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockOpportunities = [
  {
    id: "OPP001",
    borrower: "0x742d...8f2a",
    amount: 3000,
    rate: 8.5,
    duration: 30,
    reputation: 720,
    funded: 1500,
  },
  {
    id: "OPP002",
    borrower: "0x8a3f...2b1c",
    amount: 5000,
    rate: 7.2,
    duration: 60,
    reputation: 680,
    funded: 2000,
  },
]

export default function LenderOpportunities() {
  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Available Lending Opportunities</CardTitle>
          <CardDescription>Fund loans and earn competitive returns</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {mockOpportunities.map((opp) => (
          <Card key={opp.id} className="bg-surface border-border hover:border-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                <div>
                  <p className="text-sm text-muted">Borrower</p>
                  <p className="font-mono text-sm">{opp.borrower}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Amount</p>
                  <p className="font-bold">${opp.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Interest Rate</p>
                  <p className="font-bold text-accent">{opp.rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Duration</p>
                  <p className="font-bold">{opp.duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Reputation</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30">{opp.reputation}</Badge>
                </div>
                <Button className="btn-primary">Fund Loan</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
