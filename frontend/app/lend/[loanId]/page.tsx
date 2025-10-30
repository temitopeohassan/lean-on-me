"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoanFundingPage({ params }: { params: { loanId: string } }) {
  const [fundAmount, setFundAmount] = useState(1000)
  const [step, setStep] = useState<"review" | "confirm" | "success">("review")

  // Mock loan data
  const loan = {
    id: params.loanId,
    borrower: "0x742d...8f2a",
    amount: 5000,
    rate: 8.5,
    duration: 30,
    reputation: 720,
    funded: 2000,
    purpose: "Business expansion",
    riskLevel: "low",
    description: "Looking to expand my online retail business with inventory and marketing.",
  }

  const estimatedInterest = (fundAmount * loan.rate * loan.duration) / (100 * 365)
  const totalReturn = fundAmount + estimatedInterest

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/lend" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Lending
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted mb-1">Borrower</p>
                    <p className="font-mono font-medium">{loan.borrower}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Reputation Score</p>
                    <Badge className="bg-primary/20 text-primary border-primary/30 border">{loan.reputation}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Loan Amount</p>
                    <p className="font-bold text-lg">${loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Interest Rate</p>
                    <p className="font-bold text-lg text-accent">{loan.rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Duration</p>
                    <p className="font-bold text-lg">{loan.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Risk Level</p>
                    <Badge className="bg-accent/20 text-accent border-accent/30 border">{loan.riskLevel}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Purpose</p>
                  <p className="text-sm">{loan.purpose}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Description</p>
                  <p className="text-sm">{loan.description}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Funding Progress</span>
                    <span className="text-muted">
                      ${loan.funded.toLocaleString()} / ${loan.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full transition-all"
                      style={{ width: `${(loan.funded / loan.amount) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {step === "review" && (
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Fund This Loan</CardTitle>
                  <CardDescription>Choose how much you want to fund</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Funding Amount: ${fundAmount.toLocaleString()}
                    </Label>
                    <Slider
                      value={[fundAmount]}
                      onValueChange={(value) => setFundAmount(value[0])}
                      min={100}
                      max={loan.amount - loan.funded}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted mt-2">
                      <span>$100</span>
                      <span>${(loan.amount - loan.funded).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-sm">Funding Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Principal</span>
                        <span className="font-medium">${fundAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Interest Rate</span>
                        <span className="font-medium text-accent">{loan.rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Duration</span>
                        <span className="font-medium">{loan.duration} days</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between">
                        <span className="text-muted">Est. Interest</span>
                        <span className="font-bold text-accent">${estimatedInterest.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between">
                        <span className="font-semibold">Total Return</span>
                        <span className="font-bold text-accent">${totalReturn.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="btn-primary w-full" onClick={() => setStep("confirm")}>
                    Review & Confirm
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "confirm" && (
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Confirm Funding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Please review the details</p>
                      <p className="text-muted">
                        You are about to fund ${fundAmount.toLocaleString()} to this loan. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Funding Amount</span>
                      <span className="font-medium">${fundAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Est. Interest</span>
                      <span className="font-medium text-accent">${estimatedInterest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="font-semibold">Total Return</span>
                      <span className="font-bold text-accent">${totalReturn.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("review")}>
                      Back
                    </Button>
                    <Button className="btn-primary flex-1" onClick={() => setStep("success")}>
                      Confirm Funding
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "success" && (
              <Card className="bg-surface border-border">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-16 h-16 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold">Funding Successful!</h3>
                    <p className="text-muted">
                      You have successfully funded ${fundAmount.toLocaleString()} to this loan.
                    </p>
                    <div className="bg-surface-light border border-border rounded-lg p-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Transaction ID</span>
                        <span className="font-mono">0x742d...8f2a</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Est. Return</span>
                        <span className="font-bold text-accent">${totalReturn.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Link href="/lend" className="flex-1">
                        <Button className="btn-secondary w-full">Back to Portfolio</Button>
                      </Link>
                      <Link href="/browse" className="flex-1">
                        <Button className="btn-primary w-full">Find More Loans</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted mb-1">Remaining to Fund</p>
                  <p className="text-2xl font-bold text-accent">${(loan.amount - loan.funded).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Your Potential Return</p>
                  <p className="text-2xl font-bold text-primary">${totalReturn.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Profit</p>
                  <p className="text-lg font-bold text-accent">+${estimatedInterest.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-sm">Borrower Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted mb-1">Reputation</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30 border">{loan.reputation}</Badge>
                </div>
                <div>
                  <p className="text-muted mb-1">Risk Level</p>
                  <Badge className="bg-accent/20 text-accent border-accent/30 border">{loan.riskLevel}</Badge>
                </div>
                <div>
                  <p className="text-muted mb-1">Loan Status</p>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">Funding</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
