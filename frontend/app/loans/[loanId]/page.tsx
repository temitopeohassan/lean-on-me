"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoanDetailPage({ params }: { params: { loanId: string } }) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [step, setStep] = useState<"payment" | "confirm" | "success">("payment")

  // Mock loan data
  const loan = {
    id: params.loanId,
    amount: 5000,
    rate: 8.5,
    duration: 30,
    startDate: "2024-10-01",
    dueDate: "2024-10-31",
    daysRemaining: 5,
    status: "active",
    paid: 2500,
    nextPayment: 1250,
    nextPaymentDate: "2024-10-20",
    totalInterest: 425,
    paidInterest: 212.5,
    purpose: "Business expansion",
    lender: "0x8a3f...2b1c",
  }

  const outstanding = loan.amount - loan.paid
  const interestRemaining = loan.totalInterest - loan.paidInterest

  const handlePayment = () => {
    if (paymentAmount && Number.parseFloat(paymentAmount) > 0) {
      setStep("confirm")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/loans" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Loans
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
                    <p className="text-sm text-muted mb-1">Status</p>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
                      {loan.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Start Date</p>
                    <p className="font-medium">{loan.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Due Date</p>
                    <p className="font-medium">{loan.dueDate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Purpose</p>
                  <p className="text-sm">{loan.purpose}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Lender</p>
                  <p className="font-mono text-sm">{loan.lender}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Repayment Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Principal Repaid</span>
                    <span className="text-muted">
                      ${loan.paid.toLocaleString()} / ${loan.amount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(loan.paid / loan.amount) * 100} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-light border border-border rounded-lg p-4">
                    <p className="text-xs text-muted mb-1">Outstanding Principal</p>
                    <p className="text-2xl font-bold">${outstanding.toLocaleString()}</p>
                  </div>
                  <div className="bg-surface-light border border-border rounded-lg p-4">
                    <p className="text-xs text-muted mb-1">Interest Remaining</p>
                    <p className="text-2xl font-bold text-red-400">${interestRemaining.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Next Payment Due</p>
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">${loan.nextPayment.toLocaleString()}</p>
                          <p className="text-xs text-muted">{loan.nextPaymentDate}</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
                          {loan.daysRemaining} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {step === "payment" && (
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Make a Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                      Payment Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="pl-7 bg-surface-light border-border"
                      />
                    </div>
                    <p className="text-xs text-muted mt-2">
                      Maximum: ${outstanding.toLocaleString()} (outstanding principal)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setPaymentAmount(loan.nextPayment.toString())}
                    >
                      Pay Next Payment (${loan.nextPayment.toLocaleString()})
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setPaymentAmount(outstanding.toString())}
                    >
                      Pay Full Amount (${outstanding.toLocaleString()})
                    </Button>
                  </div>

                  <Button className="btn-primary w-full" onClick={handlePayment} disabled={!paymentAmount}>
                    Review Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "confirm" && (
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Confirm Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Please review the payment details</p>
                      <p className="text-muted">This action will be recorded on the blockchain.</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Payment Amount</span>
                      <span className="font-medium">${Number.parseFloat(paymentAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Outstanding After</span>
                      <span className="font-medium">
                        ${(outstanding - Number.parseFloat(paymentAmount)).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold">New Balance</span>
                      <span className="font-bold">
                        ${(outstanding - Number.parseFloat(paymentAmount)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("payment")}>
                      Back
                    </Button>
                    <Button className="btn-primary flex-1" onClick={() => setStep("success")}>
                      Confirm Payment
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
                    <h3 className="text-xl font-bold">Payment Successful!</h3>
                    <p className="text-muted">
                      Your payment of ${Number.parseFloat(paymentAmount).toLocaleString()} has been processed.
                    </p>
                    <div className="bg-surface-light border border-border rounded-lg p-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Transaction ID</span>
                        <span className="font-mono">0x742d...8f2a</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">New Balance</span>
                        <span className="font-bold">
                          ${(outstanding - Number.parseFloat(paymentAmount)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Link href="/loans" className="flex-1">
                        <Button className="btn-secondary w-full">Back to Loans</Button>
                      </Link>
                      <Button className="btn-primary flex-1" onClick={() => setStep("payment")}>
                        Make Another Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-sm">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted mb-1">Outstanding</p>
                  <p className="text-2xl font-bold">${outstanding.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Interest Remaining</p>
                  <p className="text-2xl font-bold text-red-400">${interestRemaining.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Total Due</p>
                  <p className="text-lg font-bold">${(outstanding + interestRemaining).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="btn-primary w-full">Make Payment</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Lender
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Download Statement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
