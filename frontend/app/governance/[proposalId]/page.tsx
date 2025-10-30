"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default function ProposalDetailPage({ params }: { params: { proposalId: string } }) {
  const [userVote, setUserVote] = useState<"for" | "against" | null>(null)
  const [voted, setVoted] = useState(false)

  // Mock proposal data
  const proposal = {
    id: params.proposalId,
    title: "Increase Interest Rate Cap to 12%",
    description: "Proposal to increase the maximum interest rate from 10% to 12% to attract more lenders.",
    fullDescription: `This proposal aims to increase the maximum interest rate cap from 10% to 12% to make lending more attractive and increase protocol revenue. 

Key benefits:
- Attracts more lenders to the platform
- Increases protocol revenue through higher fees
- Allows borrowers with higher risk profiles to access capital
- Maintains competitiveness with other lending protocols

Implementation:
- Update the interest rate cap in the smart contract
- Implement gradual rollout over 2 weeks
- Monitor market impact and adjust if necessary`,
    status: "active",
    votes: { for: 6240, against: 1850 },
    endDate: "2024-10-27",
    daysRemaining: 2,
    votingPower: 1250,
    category: "Parameters",
    author: "0x742d...8f2a",
    createdAt: "2024-10-20",
  }

  const totalVotes = proposal.votes.for + proposal.votes.against
  const forPercentage = Math.round((proposal.votes.for / totalVotes) * 100)
  const againstPercentage = Math.round((proposal.votes.against / totalVotes) * 100)

  const handleVote = (vote: "for" | "against") => {
    setUserVote(vote)
    setVoted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/governance" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Governance
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h1 className="text-2xl font-bold">{proposal.title}</h1>
                      <p className="text-muted">{proposal.description}</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Active
                    </Badge>
                  </div>

                  <div className="flex gap-4 text-sm text-muted pt-4 border-t border-border">
                    <span>Category: {proposal.category}</span>
                    <span>Author: {proposal.author}</span>
                    <span>Created: {proposal.createdAt}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none text-sm space-y-4">
                  {proposal.fullDescription.split("\n\n").map((paragraph, idx) => (
                    <div key={idx}>
                      {paragraph.includes(":") ? (
                        <div>
                          <p className="font-semibold mb-2">{paragraph.split(":")[0]}:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted">
                            {paragraph
                              .split(":")[1]
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <li key={i}>{line.trim()}</li>
                              ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-muted">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium">For</span>
                    <span className="text-muted">
                      {proposal.votes.for.toLocaleString()} votes ({forPercentage}%)
                    </span>
                  </div>
                  <Progress value={forPercentage} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium">Against</span>
                    <span className="text-muted">
                      {proposal.votes.against.toLocaleString()} votes ({againstPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${againstPercentage}%` }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Total Votes</p>
                  <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {!voted && (
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Cast Your Vote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted">
                    You have {proposal.votingPower.toLocaleString()} voting power available
                  </p>
                  <div className="flex gap-3">
                    <Button className="btn-primary flex-1" onClick={() => handleVote("for")}>
                      Vote For
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleVote("against")}>
                      Vote Against
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {voted && (
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Vote Recorded</p>
                      <p className="text-sm text-muted">
                        You voted <span className="font-medium text-accent">{userVote}</span> with{" "}
                        {proposal.votingPower.toLocaleString()} voting power
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-sm">Voting Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted mb-1">Time Remaining</p>
                  <p className="text-2xl font-bold text-yellow-400">{proposal.daysRemaining} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Ends</p>
                  <p className="text-sm font-medium">{proposal.endDate}</p>
                </div>
                <div className="pt-3 border-t border-yellow-500/20">
                  <p className="text-xs text-muted mb-1">Current Leader</p>
                  <p className="text-sm font-bold text-accent">For ({forPercentage}%)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-sm">Your Voting Power</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted mb-1">Available</p>
                  <p className="text-2xl font-bold text-primary">{proposal.votingPower.toLocaleString()}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted mb-2">Voting Power Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Governance Tokens</span>
                      <span className="font-medium">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Multiplier</span>
                      <span className="font-medium">1.0x</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-sm">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted mb-1">Category</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30 border">{proposal.category}</Badge>
                </div>
                <div>
                  <p className="text-muted mb-1">Author</p>
                  <p className="font-mono text-xs">{proposal.author}</p>
                </div>
                <div>
                  <p className="text-muted mb-1">Created</p>
                  <p className="text-xs">{proposal.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
