"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useBalance } from "wagmi"
import { formatEther } from "viem"

interface NavigationProps {
  isConnected: boolean
  onConnect: () => void
}

export default function Navigation({ isConnected, onConnect }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { address } = useAppKitAccount()
  const { open } = useAppKit()
  const { data: balance } = useBalance({
    address: address,
    enabled: !!address,
  })

  const handleDisconnect = () => {
    open({ view: "Account" })
  }

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
            {isConnected && address ? (
              <div className="flex items-center gap-4">
                {balance && (
                  <span className="text-sm text-muted">
                    {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
                  </span>
                )}
                <span className="text-sm text-primary font-medium">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <Button onClick={handleDisconnect} variant="outline" size="sm">
                  Account
                </Button>
              </div>
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
