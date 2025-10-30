"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export default function ReputationCard() {
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
          <div className="text-4xl font-bold text-primary">742</div>
          <Badge className="mt-2 bg-accent/20 text-accent border-accent/30">Tier A</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Wallet Age</span>
            <span className="text-foreground">3.2 years</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">TX Volume</span>
            <span className="text-foreground">$1.2M+</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Verified Income</span>
            <span className="text-accent">✓ Yes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
