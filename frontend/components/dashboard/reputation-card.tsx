"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { useAppKitAccount } from "@reown/appkit/react"
import { useReputation } from "@/hooks/use-reputation"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReputationCard() {
  const { address } = useAppKitAccount()
  const { reputation, isLoading } = useReputation(address)

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted">Reputation Score</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!reputation) {
    return (
      <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted">Reputation Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted">No reputation data available</p>
        </CardContent>
      </Card>
    )
  }

  const tierColors = {
    A: "bg-green-500/20 text-green-500 border-green-500/30",
    B: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    C: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    D: "bg-red-500/20 text-red-500 border-red-500/30",
  }

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted">Reputation Score</CardTitle>
          <TrendingUp className="w-4 h-4 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-4xl font-bold text-primary">{reputation.score.toFixed(0)}</div>
          <Badge className={`mt-2 ${tierColors[reputation.tier]}`}>Tier {reputation.tier}</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Wallet Address</span>
            <span className="text-foreground font-mono text-xs">
              {reputation.walletAddress.slice(0, 6)}...{reputation.walletAddress.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Last Updated</span>
            <span className="text-foreground">
              {new Date(reputation.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
