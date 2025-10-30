"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onConnect: () => void
}

export default function HeroSection({ onConnect }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-balance leading-tight">
                Finance without the middleman
              </h1>
              <p className="text-xl text-muted leading-relaxed">
                Peer-to-peer lending powered by onchain reputation. Borrow or lend with confidence using wallet history
                and verified income proofs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={onConnect} className="btn-primary gap-2 text-lg px-8 py-6">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button className="btn-secondary gap-2 text-lg px-8 py-6">Learn More</Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-accent">$2.4M</div>
                <div className="text-sm text-muted">Total Liquidity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">1,240</div>
                <div className="text-sm text-muted">Active Loans</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">94.2%</div>
                <div className="text-sm text-muted">Repayment Rate</div>
              </div>
            </div>
          </div>

          <div className="relative h-96 sm:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-3xl" />
            <div className="relative bg-surface border border-border rounded-2xl p-8 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-sm text-muted">Your Reputation Score</div>
                <div className="text-4xl font-bold text-accent">742</div>
                <div className="w-full bg-surface-light rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-3/4" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Wallet Age</span>
                  <span className="text-foreground font-medium">3.2 years</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Transaction Volume</span>
                  <span className="text-foreground font-medium">$1.2M+</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Verified Income</span>
                  <span className="text-accent font-medium">✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
