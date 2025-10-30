"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Zap } from "lucide-react"

const mockPortfolio = [
  {
    id: "PORT001",
    loanId: "LN001",
    borrower: "0x742d...8f2a",
    amount: 1500,
    rate: 8.5,
    duration: 30,
    daysRemaining: 12,
    interestEarned: 45.2,
    status: "active",
  },
  {
    id: "PORT002",
    loanId: "LN002",
    borrower: "0x8a3f...2b1c",
    amount: 2000,
    rate: 7.2,
    duration: 60,
    daysRemaining: 35,
    interestEarned: 78.5,
    status: "active",
  },
  {
    id: "PORT003",
    loanId: "LN003",
    borrower: "0x5c2e...9d4f",
    amount: 1000,
    rate: 9.2,
    duration: 45,
    daysRemaining: 0,
    interestEarned: 34.75,
    status: "completed",
  },
]

const mockOpportunities = [
  {
    id: "OPP001",
    borrower: "0x1b7a...3e8c",
    amount: 5000,
    rate: 8.5,
    duration: 30,
    reputation: 720,
    funded: 3000,
    purpose: "Business",
    riskLevel: "low",
  },
  {
    id: "OPP002",
    borrower: "0x9d2c...5f1a",
    amount: 3000,
    rate: 7.8,
    duration: 60,
    reputation: 700,
    funded: 1500,
    purpose: "Education",
    riskLevel: "low",
  },
  {
    id: "OPP003",
    borrower: "0x4e8b...2d7c",
    amount: 2500,
    rate: 9.5,
    duration: 45,
    reputation: 650,
    funded: 800,
    purpose: "Emergency",
    riskLevel: "medium",
  },
]

export default function LendPage() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)

  const totalInvested = mockPortfolio.reduce((sum, p) => sum + p.amount, 0)
  const totalInterest = mockPortfolio.reduce((sum, p) => sum + p.interestEarned, 0)
  const activeLoans = mockPortfolio.filter((p) => p.status === "active").length

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: "bg-accent/20 text-accent border-accent/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      high: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[risk] || colors.low
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lend</h1>
          <p className="text-muted">Manage your lending portfolio and discover new opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalInvested.toLocaleString()}</div>
              <p className="text-sm text-muted mt-2">Across {mockPortfolio.length} loans</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Interest Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">${totalInterest.toFixed(2)}</div>
              <p className="text-sm text-muted mt-2">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeLoans}</div>
              <p className="text-sm text-muted mt-2">Currently earning</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Avg Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">8.2%</div>
              <p className="text-sm text-muted mt-2">Annual yield</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            {mockPortfolio.length > 0 ? (
              mockPortfolio.map((item) => (
                <Card
                  key={item.id}
                  className="bg-surface border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLoan(item.id)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">${item.amount.toLocaleString()}</h4>
                            <Badge
                              className={`${
                                item.status === "active"
                                  ? "bg-accent/20 text-accent border-accent/30"
                                  : "bg-muted/20 text-muted border-muted/30"
                              } border`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted">Lent to {item.borrower}</p>
                          <div className="flex gap-6 text-sm text-muted">
                            <span>Rate: {item.rate}%</span>
                            <span>Duration: {item.duration} days</span>
                            {item.status === "active" && <span>{item.daysRemaining} days left</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted mb-1">Interest Earned</p>
                          <p className="text-2xl font-bold text-accent">${item.interestEarned.toFixed(2)}</p>
                        </div>
                      </div>

                      {item.status === "active" && (
                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted">Loan Progress</span>
                            <span className="text-muted">
                              {item.daysRemaining} / {item.duration} days
                            </span>
                          </div>
                          <Progress value={((item.duration - item.daysRemaining) / item.duration) * 100} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-surface border-border">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted mb-4">No active loans in your portfolio</p>
                  <Button className="btn-primary">Browse Opportunities</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            {mockOpportunities.map((opp) => (
              <Card key={opp.id} className="bg-surface border-border hover:border-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-center">
                      <div>
                        <p className="text-xs text-muted mb-1">Borrower</p>
                        <p className="font-mono text-sm font-medium">{opp.borrower}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Amount</p>
                        <p className="font-bold">${opp.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Interest</p>
                        <p className="font-bold text-accent">{opp.rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Duration</p>
                        <p className="font-bold">{opp.duration}d</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Risk</p>
                        <Badge className={`${getRiskColor(opp.riskLevel)} border text-xs`}>{opp.riskLevel}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Reputation</p>
                        <Badge className="bg-primary/20 text-primary border-primary/30 border text-xs">
                          {opp.reputation}
                        </Badge>
                      </div>
                      <Button className="btn-primary">Fund</Button>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted">Funding Progress</span>
                        <span className="text-muted">
                          ${opp.funded.toLocaleString()} / ${opp.amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(opp.funded / opp.amount) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockPortfolio
              .filter((p) => p.status === "completed")
              .map((item) => (
                <Card key={item.id} className="bg-surface border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">${item.amount.toLocaleString()}</h4>
                        <p className="text-sm text-muted">Lent to {item.borrower}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted mb-1">Interest Earned</p>
                        <p className="font-bold text-accent">${item.interestEarned.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
