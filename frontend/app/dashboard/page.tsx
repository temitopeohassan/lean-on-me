"use client"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import Navigation from "@/components/navigation"
import DashboardPreview from "@/components/dashboard-preview"

export default function DashboardPage() {
  const { isConnected } = useAppKitAccount()
  const { open } = useAppKit()

  const handleConnect = () => {
    open()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} onConnect={handleConnect} />
      <DashboardPreview />
    </div>
  )
}
