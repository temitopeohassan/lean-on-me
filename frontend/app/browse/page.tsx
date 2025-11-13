"use client"

import { useState, useMemo } from "react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"
import { useBrowseLoans } from "@/hooks/use-browse-loans"
import { useFundLoan } from "@/hooks/use-loan-contract"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import type { Address } from "viem"

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [rateRange, setRateRange] = useState([5, 12])
  const [sortBy, setSortBy] = useState("rate-asc")
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: loans = [], isLoading, error, refetch } = useBrowseLoans()
  const { fundLoan, isPending: isFunding, isSuccess: isFunded } = useFundLoan()

  const handleConnect = () => {
    open()
  }

  const filteredLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        const matchesSearch =
          loan.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRisk = riskFilter === "all" || loan.riskLevel === riskFilter
        const matchesRate = loan.interestRate >= rateRange[0] && loan.interestRate <= rateRange[1]
        return matchesSearch && matchesRisk && matchesRate
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rate-asc":
            return a.interestRate - b.interestRate
          case "rate-desc":
            return b.interestRate - a.interestRate
          case "amount-asc":
            return a.amount - b.amount
          case "amount-desc":
            return b.amount - a.amount
          default:
            return 0
        }
      })
  }, [loans, searchTerm, riskFilter, rateRange, sortBy])

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: "bg-accent/20 text-accent border-accent/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      high: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[risk] || colors.low
  }

  const handleFundLoan = async (loan: typeof loans[0]) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund a loan.",
        variant: "destructive",
      })
      return
    }

    try {
      await fundLoan(
        loan.loanId,
        address as Address,
        loan.amount.toString(),
        loan.interestRate
      )
      toast({
        title: "Loan funded!",
        description: `Successfully funded loan ${loan.loanId}`,
      })
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["browse-loans"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })
      refetch()
    } catch (err) {
      console.error("Error funding loan:", err)
      toast({
        title: "Failed to fund loan",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const stats = useMemo(() => {
    if (loans.length === 0) {
      return {
        totalLoans: 0,
        avgRate: "0.0",
        totalLiquidity: 0,
      }
    }
    return {
      totalLoans: loans.length,
      avgRate: (loans.reduce((sum, l) => sum + l.interestRate, 0) / loans.length).toFixed(1),
      totalLiquidity: loans.reduce((sum, l) => sum + (l.amount - l.funded), 0),
    }
  }, [loans])

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} onConnect={handleConnect} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Loans</h1>
          <p className="text-muted">Discover lending opportunities and earn competitive returns</p>
          {error && (
            <p className="text-sm text-destructive mt-2">
              Failed to load loans. Please try again.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Available Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-muted font-bold">{stats.totalLoans}</div>
              <p className="text-sm text-muted mt-2">Seeking funding</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Avg Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.avgRate}%</div>
              <p className="text-sm text-muted mt-2">Across all loans</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted">Funding Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-muted font-bold">${(stats.totalLiquidity / 1000).toFixed(1)}K</div>
              <p className="text-sm text-muted mt-2">Total available</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by borrower or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-surface border-border"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface  border-border">
              <SelectItem value="rate-asc">Rate: Low to High</SelectItem>
              <SelectItem value="rate-desc">Rate: High to Low</SelectItem>
              <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
              <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-sm text-muted font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm text-muted font-medium mb-3 block">Risk Level</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="bg-surface-light border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border">
                      <SelectItem value="all">All Risks</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted font-medium mb-3 block">
                    Interest Rate: {rateRange[0]}% - {rateRange[1]}%
                  </Label>
                  <Slider
                    value={rateRange}
                    onValueChange={setRateRange}
                    min={0}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <Card className="bg-surface border-border">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted">Loading available loans...</p>
                </CardContent>
              </Card>
            ) : filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => {
                const fundedPercent = loan.amount > 0 ? Math.round((loan.funded / loan.amount) * 100) : 0
                const shortBorrower = `${loan.borrower.slice(0, 6)}...${loan.borrower.slice(-4)}`
                
                return (
                  <Card key={loan.loanId} className="bg-surface border-border hover:border-accent/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-center">
                        <div>
                          <p className="text-xs text-muted mb-1">Borrower</p>
                          <p className="font-mono text-sm font-medium" title={loan.borrower}>
                            {shortBorrower}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Amount</p>
                          <p className="font-bold">${loan.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Interest</p>
                          <p className="font-bold text-accent">{loan.interestRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Duration</p>
                          <p className="font-bold">{loan.durationDays}d</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Risk</p>
                          <Badge className={`${getRiskColor(loan.riskLevel)} border text-xs capitalize`}>
                            {loan.riskLevel}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Reputation</p>
                          <p className="font-bold">{loan.reputationScoreAtRequest.toFixed(0)}</p>
                        </div>
                        <Button
                          className="btn-primary"
                          onClick={() => handleFundLoan(loan)}
                          disabled={isFunding || !address}
                        >
                          {isFunding ? "Funding..." : "Fund"}
                        </Button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">Purpose</span>
                          <span className="text-muted">{loan.purpose || "Not specified"}</span>
                        </div>
                        {loan.funded > 0 && (
                          <>
                            <div className="flex justify-between text-xs mb-1 mt-2">
                              <span className="text-muted">Funding Progress</span>
                              <span className="text-muted">
                                ${loan.funded.toLocaleString()} / ${loan.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all"
                                style={{ width: `${fundedPercent}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="bg-surface border-border">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted">
                    {loans.length === 0
                      ? "No loans available at the moment. Check back soon!"
                      : "No loans match your filters"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
