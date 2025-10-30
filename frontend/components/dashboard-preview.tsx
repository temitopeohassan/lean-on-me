"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoanRequestsList from "./dashboard/loan-requests-list"
import LenderOpportunities from "./dashboard/lender-opportunities"
import GovernanceOverview from "./dashboard/governance-overview"
import UserProfile from "./user-profile"
import ReputationBreakdown from "./reputation-breakdown"

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfile />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted">Manage your loans, reputation, and lending activities</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="lend">Lend</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ReputationBreakdown />
              </div>
              <div className="space-y-6">
                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted">Active Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                    <p className="text-sm text-muted mt-2">$5,000 total borrowed</p>
                  </CardContent>
                </Card>
                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted">Yield Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">$342.50</div>
                    <p className="text-sm text-muted mt-2">From lending activities</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-medium">Loan Repayment</p>
                      <p className="text-sm text-muted">Loan #1024</p>
                    </div>
                    <span className="text-accent font-medium">-$500</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-medium">Interest Earned</p>
                      <p className="text-sm text-muted">Loan #1018</p>
                    </div>
                    <span className="text-accent font-medium">+$45.20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">New Loan Funded</p>
                      <p className="text-sm text-muted">Loan #1025</p>
                    </div>
                    <span className="text-accent font-medium">+$1,000</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Protocol Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Total Liquidity</span>
                    <span className="font-bold">$2.4M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Active Loans</span>
                    <span className="font-bold">1,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Repayment Rate</span>
                    <span className="font-bold text-accent">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Avg Interest Rate</span>
                    <span className="font-bold">8.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="borrow">
            <LoanRequestsList />
          </TabsContent>

          <TabsContent value="lend">
            <LenderOpportunities />
          </TabsContent>

          <TabsContent value="governance">
            <GovernanceOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
