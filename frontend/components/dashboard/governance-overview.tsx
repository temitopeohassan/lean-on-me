"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"

const mockProposals = [
  {
    id: "PROP001",
    title: "Increase Interest Rate Cap to 12%",
    status: "active",
    votes: { for: 6240, against: 1850 },
    endDate: "2 days",
  },
  {
    id: "PROP002",
    title: "Update Reputation Formula Weights",
    status: "passed",
    votes: { for: 8920, against: 450 },
    endDate: "Passed",
  },
]

export default function GovernanceOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Total Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted mt-2">All-time governance votes</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Your Voting Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1,250</div>
            <p className="text-sm text-muted mt-2">Governance tokens held</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">87%</div>
            <p className="text-sm text-muted mt-2">Votes participated in</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Proposals</h3>
        {mockProposals.map((proposal) => (
          <Card key={proposal.id} className="bg-surface border-border">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{proposal.title}</h4>
                      <Badge variant={proposal.status === "active" ? "default" : "secondary"}>{proposal.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      {proposal.status === "active" ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Ends in {proposal.endDate}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span>{proposal.endDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {proposal.status === "active" && <Button className="btn-primary">Vote</Button>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted mb-1">For</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-light rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "77%" }} />
                      </div>
                      <span className="text-sm font-medium">{proposal.votes.for.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Against</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-light rounded-full h-2">
                        <div className="bg-error h-2 rounded-full" style={{ width: "23%" }} />
                      </div>
                      <span className="text-sm font-medium">{proposal.votes.against.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
