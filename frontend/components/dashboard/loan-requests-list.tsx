"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockLoans = [
  {
    id: "LN001",
    amount: 5000,
    duration: 30,
    purpose: "Business expansion",
    status: "pending",
    reputation: 742,
  },
  {
    id: "LN002",
    amount: 2500,
    duration: 60,
    purpose: "Education",
    status: "active",
    reputation: 680,
  },
]

export default function LoanRequestsList() {
  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Create New Loan Request</CardTitle>
          <CardDescription>Request a loan based on your reputation score</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="btn-primary">+ New Loan Request</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Loan Requests</h3>
        {mockLoans.map((loan) => (
          <Card key={loan.id} className="bg-surface border-border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-lg">${loan.amount.toLocaleString()}</h4>
                    <Badge variant={loan.status === "pending" ? "secondary" : "default"}>{loan.status}</Badge>
                  </div>
                  <p className="text-sm text-muted">{loan.purpose}</p>
                  <div className="flex gap-4 text-sm text-muted">
                    <span>{loan.duration} days</span>
                    <span>Reputation: {loan.reputation}</span>
                  </div>
                </div>
                <Button className="btn-secondary">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
