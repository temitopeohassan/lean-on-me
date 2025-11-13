"use client"

import { useState, useMemo } from "react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useDashboardSummary } from "@/hooks/use-dashboard-summary"
import { useReputation } from "@/hooks/use-reputation"
import { useCreateLoanRequest } from "@/hooks/use-loan-contract"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import type { Address } from "viem"

const calculateBorrowingPower = (reputationScore: number): number => {
  // Base borrowing power calculation based on reputation
  if (reputationScore >= 750) return 50000
  if (reputationScore >= 700) return 35000
  if (reputationScore >= 650) return 25000
  if (reputationScore >= 600) return 15000
  if (reputationScore >= 550) return 10000
  return 5000
}

const calculateInterestRate = (reputationScore: number, durationDays: number): number => {
  // Base rate calculation: lower reputation = higher interest rate
  let baseRate = 8.5
  if (reputationScore >= 750) baseRate = 5.5
  else if (reputationScore >= 700) baseRate = 6.5
  else if (reputationScore >= 650) baseRate = 7.5
  else if (reputationScore >= 600) baseRate = 8.5
  else if (reputationScore >= 550) baseRate = 9.5
  else baseRate = 12.0
  
  // Longer duration adds slight premium
  if (durationDays > 60) baseRate += 0.5
  if (durationDays > 90) baseRate += 0.5
  
  return baseRate
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown"
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export default function BorrowPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanDuration, setLoanDuration] = useState(30)
  const [loanPurpose, setLoanPurpose] = useState("")
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const walletAddress = address as Address | undefined
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: summary, isLoading: summaryLoading, refetch } = useDashboardSummary(
    walletAddress?.toLowerCase()
  )
  const { reputation, isLoading: reputationLoading } = useReputation(walletAddress)
  const { createLoanRequest, isPending: isCreating } = useCreateLoanRequest()

  const handleConnect = () => {
    open()
  }

  const borrowerLoans = summary?.borrowerLoans || []
  const reputationScore = reputation?.score || 500

  // Calculate stats from real data
  const stats = useMemo(() => {
    const activeLoans = borrowerLoans.filter(
      (loan) => loan.status === "pending" || loan.status === "funded"
    )
    const activeLoanAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0)
    
    // Calculate average interest rate from active loans (if we had that data)
    // For now, use calculated rate based on reputation
    const avgRate = calculateInterestRate(reputationScore, 30)
    
    return {
      borrowingPower: calculateBorrowingPower(reputationScore),
      activeLoansCount: activeLoans.length,
      activeLoanAmount,
      avgRate,
    }
  }, [borrowerLoans, reputationScore])

  // Separate loans by status
  const activeLoans = useMemo(() => {
    return borrowerLoans.filter(
      (loan) => loan.status === "pending" || loan.status === "funded"
    )
  }, [borrowerLoans])

  const completedLoans = useMemo(() => {
    // Show cancelled loans in history (repaid loans would be in loan_agreements, not loan_requests)
    return borrowerLoans.filter((loan): loan is typeof borrowerLoans[0] => loan.status === "cancelled")
  }, [borrowerLoans])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      funded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      repaid: "bg-accent/20 text-accent border-accent/30",
      cancelled: "bg-muted/20 text-muted border-muted/30",
      defaulted: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status] || colors.pending
  }

  const estimatedRate = calculateInterestRate(reputationScore, loanDuration)
  const estimatedInterest = (loanAmount * estimatedRate * loanDuration) / (100 * 365)

  const handleSubmitLoanRequest = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a loan request.",
        variant: "destructive",
      })
      return
    }

    if (!loanPurpose.trim()) {
      toast({
        title: "Purpose required",
        description: "Please provide a purpose for the loan.",
        variant: "destructive",
      })
      return
    }

    if (loanAmount > stats.borrowingPower) {
      toast({
        title: "Amount exceeds borrowing power",
        description: `Your borrowing power is $${stats.borrowingPower.toLocaleString()}. Please reduce the loan amount.`,
        variant: "destructive",
      })
      return
    }

    try {
      // Generate loan ID
      const loanId = `loan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      
      await createLoanRequest({
        loanId,
        borrower: walletAddress,
        amount: loanAmount.toString(),
        durationDays: loanDuration,
        purpose: loanPurpose,
      })

      toast({
        title: "Loan request submitted!",
        description: "Your loan request has been published onchain and to the backend.",
      })

      // Reset form
      setLoanAmount(5000)
      setLoanDuration(30)
      setLoanPurpose("")

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })
      refetch()
      
      // Switch to active tab to see the new loan
      setActiveTab("active")
    } catch (err) {
      console.error("Error creating loan request:", err)
      toast({
        title: "Failed to submit loan request",
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} onConnect={handleConnect} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Borrow</h1>
          <p className="text-muted">Request loans based on your reputation score</p>
          {!address && (
            <p className="text-sm text-destructive mt-2">Connect your wallet to view your borrowing information</p>
          )}
        </div>

        {summaryLoading || reputationLoading ? (
          <Card className="bg-surface border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted">Loading your borrowing information...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Borrowing Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-muted font-bold">
                    ${stats.borrowingPower.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Based on reputation ({reputationScore.toFixed(0)})
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-muted font-bold">{stats.activeLoansCount}</div>
                  <p className="text-sm text-muted mt-2">
                    ${stats.activeLoanAmount.toLocaleString()} outstanding
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Est. Interest Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-muted text-accent">{stats.avgRate.toFixed(1)}%</div>
                  <p className="text-sm text-muted mt-2">Based on your reputation</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="active">Active Loans</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="new">New Request</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {!address ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">Connect your wallet to view your active loans</p>
                </CardContent>
              </Card>
            ) : summaryLoading ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">Loading your loans...</p>
                </CardContent>
              </Card>
            ) : activeLoans.length === 0 ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">You don't have any active loans yet</p>
                </CardContent>
              </Card>
            ) : (
              activeLoans.map((loan) => (
                <Card key={loan.loanId} className="bg-surface border-border hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-muted text-lg">${loan.amount.toLocaleString()}</h4>
                          <Badge className={`${getStatusColor(loan.status)} border capitalize`}>
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted">{loan.purpose || "No purpose specified"}</p>
                        <div className="flex gap-6 text-sm text-muted">
                          <span>{loan.durationDays} days</span>
                          {loan.reputationScoreAtRequest && (
                            <span>Reputation: {loan.reputationScoreAtRequest.toFixed(0)}</span>
                          )}
                          {loan.requestedAt && (
                            <span>Created {formatDate(loan.requestedAt)}</span>
                          )}
                        </div>
                        {loan.status === "funded" && (
                          <div className="pt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Status</span>
                              <span>Funded</span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2">
                              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: "100%" }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <Button className="btn-primary" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {!address ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">Connect your wallet to view your loan history</p>
                </CardContent>
              </Card>
            ) : summaryLoading ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">Loading loan history...</p>
                </CardContent>
              </Card>
            ) : completedLoans.length === 0 ? (
              <Card className="bg-surface border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted">No completed loans yet</p>
                </CardContent>
              </Card>
            ) : (
              completedLoans.map((loan) => (
                <Card key={loan.loanId} className="bg-surface border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">${loan.amount.toLocaleString()}</h4>
                        <p className="text-sm text-muted">{loan.purpose || "No purpose specified"}</p>
                      </div>
                      <Badge className="bg-muted/20 text-muted border-muted/30 border capitalize">
                        {loan.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
                      max={Math.min(stats.borrowingPower, 50000)}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted mt-2">
                      <span>$1,000</span>
                      <span>${Math.min(stats.borrowingPower, 50000).toLocaleString()}</span>
                    </div>
                    {loanAmount > stats.borrowingPower && (
                      <p className="text-sm text-destructive mt-2">
                        Amount exceeds your borrowing power of ${stats.borrowingPower.toLocaleString()}
                      </p>
                    )}
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
                    <Textarea
                      id="purpose"
                      placeholder="Describe how you will use the loan (e.g., Business expansion, Education, Home renovation, Emergency, etc.)"
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="bg-surface-light border-border min-h-[100px]"
                      rows={4}
                    />
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

                <Button
                  className="btn-primary w-full gap-2"
                  onClick={handleSubmitLoanRequest}
                  disabled={isCreating || !address || !loanPurpose.trim()}
                >
                  <Plus className="w-4 h-4" />
                  {isCreating ? "Submitting..." : "Submit Loan Request"}
                </Button>
                {!address && (
                  <p className="text-sm text-destructive text-center">
                    Please connect your wallet to submit a loan request
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
