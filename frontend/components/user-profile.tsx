"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserProfileProps {
  address?: string
  reputation?: number
  tier?: string
}

export default function UserProfile({
  address = "0x742d35Cc6634C0532925a3b844Bc9e7595f8f2a",
  reputation = 742,
  tier = "A",
}: UserProfileProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      S: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      A: "bg-primary/20 text-primary border-primary/30",
      B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      C: "bg-muted/20 text-muted border-muted/30",
    }
    return colors[tier] || colors["C"]
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 bg-primary/20 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/30 text-primary font-bold">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium">{shortAddress}</p>
                <button className="text-muted hover:text-foreground transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted mt-1">Connected Wallet</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-muted mb-1">Reputation Score</p>
            <p className="text-2xl font-bold text-primary">{reputation}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Tier</p>
            <Badge className={`${getTierColor(tier)} border`}>Tier {tier}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Status</p>
            <Badge className="bg-accent/20 text-accent border-accent/30 border">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
