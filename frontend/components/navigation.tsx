"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface NavigationProps {
  isConnected: boolean
  onConnect: () => void
}

export default function Navigation({ isConnected, onConnect }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-primary">
            Lean On Me
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isConnected && (
              <>
                <Link href="/borrow" className="text-sm text-muted hover:text-foreground transition-colors">
                  Borrow
                </Link>
                <Link href="/browse" className="text-sm text-muted hover:text-foreground transition-colors">
                  Browse
                </Link>
                <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <span className="text-sm text-primary font-medium">Connected</span>
            ) : (
              <Button onClick={onConnect} className="btn-primary gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
