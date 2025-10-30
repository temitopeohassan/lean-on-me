"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

const mockProposals = [
  {
    id: "PROP001",
    title: "Increase Interest Rate Cap to 12%",
    description: "Proposal to increase the maximum interest rate from 10% to 12% to attract more lenders.",
    status: "active",
    votes: { for: 6240, against: 1850 },
    endDate: "2 days",
    endTimestamp: "2024-10-27",
    votingPower: 1250,
    userVote: null,
    category: "Parameters",
  },
  {
    id: "PROP002",
    title: "Update Reputation Formula Weights",
    description: "Adjust the weights in the reputation calculation to better reflect wallet history.",
    status: "passed",
    votes: { for: 8920, against: 450 },
    endDate: "Passed",
    endTimestamp: "2024-10-20",
    votingPower: 1250,
    userVote: "for",
    category: "Parameters",
  },
  {
    id: "PROP003",
    title: "Implement Risk-Based Collateral Requirements",
    description: "Add dynamic collateral requirements based on borrower risk assessment.",
    status: "active",
    votes: { for: 4120, against: 2890 },
    endDate: "5 days",
    endTimestamp: "2024-10-31",
    votingPower: 1250,
    userVote: "for",
    category: "Risk Management",
  },
  {
    id: "PROP004",
    title: "Allocate 5% of Treasury to Development Fund",
    description: "Move 5% of DAO treasury to fund protocol development and improvements.",
    status: "rejected",
    votes: { for: 3200, against: 5100 },
    endDate: "Rejected",
    endTimestamp: "2024-10-15",
    votingPower: 1250,
    userVote: "against",
    category: "Treasury",
  },
]

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)

  const totalVotingPower = 1250
  const participationRate = 87
  const totalProposals = mockProposals.length
  const passedProposals = mockProposals.filter((p) => p.status === "passed").length

  const getStatusIcon = (status: string) => {
    if (status === "active") return <Clock className="w-4 h-4 text-yellow-400" />
    if (status === "passed") return <CheckCircle2 className="w-4 h-4 text-accent" />
    if (status === "rejected") return <XCircle className="w-4 h-4 text-red-400" />
    return null
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      passed: "bg-accent/20 text-accent border-accent/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status] || colors.active
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DAO Governance</h1>
          <p className="text-muted">Participate in protocol decisions and shape the future of Lean On Me</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Your Voting Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalVotingPower.toLocaleString()}</div>
              <p className="text-sm text-muted mt-2">Governance tokens held</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{participationRate}%</div>
              <p className="text-sm text-muted mt-2">Votes participated in</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Total Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProposals}</div>
              <p className="text-sm text-muted mt-2">All-time governance votes</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Passed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{passedProposals}</div>
              <p className="text-sm text-muted mt-2">Successful proposals</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {mockProposals
              .filter((p) => p.status === "active")
              .map((proposal) => (
                <Card
                  key={proposal.id}
                  className="bg-surface border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProposal(proposal.id)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{proposal.title}</h4>
                            <Badge className={`${getStatusColor(proposal.status)} border flex items-center gap-1`}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted">{proposal.description}</p>
                          <div className="flex gap-4 text-sm text-muted">
                            <span>Category: {proposal.category}</span>
                            <span>Ends in {proposal.endDate}</span>
                          </div>
                        </div>
                        <Button className="btn-primary">Vote</Button>
                      </div>

                      <div className="pt-4 border-t border-border space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted">For</span>
                            <span className="font-medium">
                              {proposal.votes.for.toLocaleString()} votes (
                              {Math.round((proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100)}
                              %)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-light rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full"
                                style={{
                                  width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted">Against</span>
                            <span className="font-medium">
                              {proposal.votes.against.toLocaleString()} votes (
                              {Math.round(
                                (proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100,
                              )}
                              %)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-light rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{
                                  width: `${(proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockProposals
              .filter((p) => p.status !== "active")
              .map((proposal) => (
                <Card key={proposal.id} className="bg-surface border-border">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{proposal.title}</h4>
                            <Badge className={`${getStatusColor(proposal.status)} border flex items-center gap-1`}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted">{proposal.description}</p>
                        </div>
                        {proposal.userVote && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 border">
                            You voted {proposal.userVote}
                          </Badge>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted mb-1">For</p>
                            <p className="font-bold">
                              {proposal.votes.for.toLocaleString()} (
                              {Math.round((proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100)}
                              %)
                            </p>
                          </div>
                          <div>
                            <p className="text-muted mb-1">Against</p>
                            <p className="font-bold">
                              {proposal.votes.against.toLocaleString()} (
                              {Math.round(
                                (proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100,
                              )}
                              %)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Treasury Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2.4M</div>
                  <p className="text-sm text-muted mt-2">Total DAO assets</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">$125K</div>
                  <p className="text-sm text-muted mt-2">From protocol fees</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Token Supply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">10M</div>
                  <p className="text-sm text-muted mt-2">Total governance tokens</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Treasury Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "Development", amount: 1200000, percentage: 50 },
                  { name: "Marketing", amount: 480000, percentage: 20 },
                  { name: "Operations", amount: 360000, percentage: 15 },
                  { name: "Reserves", amount: 360000, percentage: 15 },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted">
                        ${item.amount.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
