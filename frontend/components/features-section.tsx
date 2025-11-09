"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Reputation-Based",
    description: "Borrow based on your onchain history, not traditional credit scores",
  },
  {
    icon: TrendingUp,
    title: "Earn Yield",
    description: "Lend your assets and earn competitive returns on your capital",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description: "Fast onchain transactions with transparent smart contract execution",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-surface/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why Lean On Me?</h2>
          <p className="text-xl max-w-2xl mx-auto">
            A transparent, community-driven lending protocol built for the future of finance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-surface border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-muted" />
                  </div>
                  <CardTitle className="text-lg text-muted">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
