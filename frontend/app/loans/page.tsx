"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

const mockLoans = [
  {
    id: "LN001",
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
  },
  {
    id: "LN002",
    amount: 2500,
    rate: 7.2,
    duration: 60,
    startDate: "2024-09-15",
    dueDate: "2024-11-14",
    daysRemaining: 20,
    status: "active",
    paid: 1250,
    nextPayment: 625,
    nextPaymentDate: "2024-10-25",
    totalInterest: 300,
    paidInterest: 150,
    purpose: "Education",
  },
  {
    id: "LN003",
    amount: 10000,
    rate: 8.0,
    duration: 90,
    startDate: "2024-08-01",
    dueDate: "2024-10-30",
    daysRemaining: 0,
    status: "completed",
    paid: 10000,
    nextPayment: 0,
    nextPaymentDate: "N/A",
    totalInterest: 600,
    paidInterest: 600,
    purpose: "Home renovation",
  },
]

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)

  const activeLoans = mockLoans.filter((l) => l.status === "active")
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.amount - l.paid), 0)
  const totalInterestOwed = activeLoans.reduce((sum, l) => sum + (l.totalInterest - l.paidInterest), 0)

  const getStatusIcon = (status: string) => {
    if (status === "active") return <Clock className="w-4 h-4 text-yellow-400" />
    if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-accent" />
    return <AlertCircle className="w-4 h-4 text-red-400" />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Loans</h1>
          <p className="text-muted">Manage your loans and track repayments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Outstanding Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalOutstanding.toLocaleString()}</div>
              <p className="text-sm text-muted mt-2">Across {activeLoans.length} active loans</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Interest Owed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">${totalInterestOwed.toFixed(2)}</div>
              <p className="text-sm text-muted mt-2">Remaining interest</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Next Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${activeLoans.length > 0 ? activeLoans[0].nextPayment.toLocaleString() : "0"}
              </div>
              <p className="text-sm text-muted mt-2">
                {activeLoans.length > 0 ? `Due ${activeLoans[0].nextPaymentDate}` : "No active loans"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="active">Active Loans</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeLoans.length > 0 ? (
              activeLoans.map((loan) => (
                <Card
                  key={loan.id}
                  className="bg-surface border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLoan(loan.id)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">${loan.amount.toLocaleString()}</h4>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border flex items-center gap-1">
                              {getStatusIcon(loan.status)}
                              {loan.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted">{loan.purpose}</p>
                          <div className="flex gap-6 text-sm text-muted">
                            <span>Rate: {loan.rate}%</span>
                            <span>Duration: {loan.duration} days</span>
                            <span>{loan.daysRemaining} days remaining</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted mb-1">Outstanding</p>
                          <p className="text-2xl font-bold">${(loan.amount - loan.paid).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted">Principal Repaid</span>
                            <span className="text-muted">
                              ${loan.paid.toLocaleString()} / ${loan.amount.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={(loan.paid / loan.amount) * 100} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted mb-1">Next Payment</p>
                            <p className="font-bold">${loan.nextPayment.toLocaleString()}</p>
                            <p className="text-xs text-muted">{loan.nextPaymentDate}</p>
                          </div>
                          <div>
                            <p className="text-muted mb-1">Interest Paid</p>
                            <p className="font-bold">${loan.paidInterest.toFixed(2)}</p>
                            <p className="text-xs text-muted">of ${loan.totalInterest.toFixed(2)}</p>
                          </div>
                          <Button className="btn-primary h-fit">Make Payment</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-surface border-border">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted">No active loans</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {mockLoans
              .filter((l) => l.status === "completed")
              .map((loan) => (
                <Card key={loan.id} className="bg-surface border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">${loan.amount.toLocaleString()}</h4>
                          <Badge className="bg-accent/20 text-accent border-accent/30 border flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted">{loan.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted mb-1">Total Paid</p>
                        <p className="font-bold">${(loan.amount + loan.totalInterest).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { date: "2024-10-15", amount: 1250, type: "Principal", loan: "LN001" },
                  { date: "2024-10-10", amount: 625, type: "Principal", loan: "LN002" },
                  { date: "2024-10-05", amount: 1250, type: "Principal", loan: "LN001" },
                  { date: "2024-09-30", amount: 625, type: "Principal", loan: "LN002" },
                  { date: "2024-09-25", amount: 5000, type: "Principal", loan: "LN003" },
                ].map((payment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{payment.type} Payment</p>
                      <p className="text-sm text-muted">
                        {payment.date} • Loan {payment.loan}
                      </p>
                    </div>
                    <span className="font-bold text-accent">-${payment.amount.toLocaleString()}</span>
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
