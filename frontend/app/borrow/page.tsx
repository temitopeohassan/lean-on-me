"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus } from "lucide-react"

const mockLoans = [
  {
    id: "LN001",
    amount: 5000,
    duration: 30,
    purpose: "Business expansion",
    status: "pending",
    reputation: 742,
    createdAt: "2 days ago",
    funded: 0,
  },
  {
    id: "LN002",
    amount: 2500,
    duration: 60,
    purpose: "Education",
    status: "active",
    reputation: 680,
    createdAt: "5 days ago",
    funded: 2500,
  },
  {
    id: "LN003",
    amount: 10000,
    duration: 90,
    purpose: "Home renovation",
    status: "repaying",
    reputation: 720,
    createdAt: "3 weeks ago",
    funded: 10000,
  },
]

export default function BorrowPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanDuration, setLoanDuration] = useState(30)
  const [loanPurpose, setLoanPurpose] = useState("")

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      repaying: "bg-accent/20 text-accent border-accent/30",
      completed: "bg-muted/20 text-muted border-muted/30",
    }
    return colors[status] || colors.pending
  }

  const estimatedRate = 8.5 + (loanDuration > 60 ? 1 : 0)
  const estimatedInterest = (loanAmount * estimatedRate * loanDuration) / (100 * 365)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Borrow</h1>
          <p className="text-muted">Request loans based on your reputation score</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Borrowing Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$25,000</div>
              <p className="text-sm text-muted mt-2">Based on your reputation</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-sm text-muted mt-2">$7,500 outstanding</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Avg Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">7.8%</div>
              <p className="text-sm text-muted mt-2">Your current rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="active">Active Loans</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="new">New Request</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {mockLoans
              .filter((l) => ["pending", "active", "repaying"].includes(l.status))
              .map((loan) => (
                <Card key={loan.id} className="bg-surface border-border hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">${loan.amount.toLocaleString()}</h4>
                          <Badge className={`${getStatusColor(loan.status)} border`}>{loan.status}</Badge>
                        </div>
                        <p className="text-sm text-muted">{loan.purpose}</p>
                        <div className="flex gap-6 text-sm text-muted">
                          <span>{loan.duration} days</span>
                          <span>Reputation: {loan.reputation}</span>
                          <span>Created {loan.createdAt}</span>
                        </div>
                        {loan.status !== "pending" && (
                          <div className="pt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Funded</span>
                              <span>{Math.round((loan.funded / loan.amount) * 100)}%</span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all"
                                style={{ width: `${(loan.funded / loan.amount) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <Button className="btn-primary">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockLoans
              .filter((l) => l.status === "completed")
              .map((loan) => (
                <Card key={loan.id} className="bg-surface border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">${loan.amount.toLocaleString()}</h4>
                        <p className="text-sm text-muted">{loan.purpose}</p>
                      </div>
                      <Badge className="bg-muted/20 text-muted border-muted/30 border">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Request New Loan</CardTitle>
                <CardDescription>Fill out the form below to request a new loan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Loan Amount: ${loanAmount.toLocaleString()}
                    </Label>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      min={1000}
                      max={25000}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted mt-2">
                      <span>$1,000</span>
                      <span>$25,000</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Loan Duration: {loanDuration} days</Label>
                    <Slider
                      value={[loanDuration]}
                      onValueChange={(value) => setLoanDuration(value[0])}
                      min={7}
                      max={365}
                      step={7}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted mt-2">
                      <span>7 days</span>
                      <span>365 days</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="purpose" className="text-sm font-medium mb-2 block">
                      Loan Purpose
                    </Label>
                    <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                      <SelectTrigger id="purpose" className="bg-surface-light border-border">
                        <SelectValue placeholder="Select a purpose" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border">
                        <SelectItem value="business">Business Expansion</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="home">Home Renovation</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Loan Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Principal</span>
                      <span className="font-medium">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Duration</span>
                      <span className="font-medium">{loanDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Est. Interest Rate</span>
                      <span className="font-medium text-accent">{estimatedRate.toFixed(1)}%</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="text-muted">Est. Total Interest</span>
                      <span className="font-bold text-accent">${estimatedInterest.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button className="btn-primary w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Submit Loan Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
