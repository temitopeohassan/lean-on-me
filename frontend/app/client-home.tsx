"use client"

import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import DashboardPreview from "@/components/dashboard-preview"
import FeaturesSection from "@/components/features-section"

export default function ClientHome() {
  const { isConnected } = useAppKitAccount()
  const { open } = useAppKit()

  const handleConnect = () => {
    open()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} onConnect={handleConnect} />

      {!isConnected ? (
        <>
          <HeroSection onConnect={handleConnect} />
          <FeaturesSection />
        </>
      ) : (
        <DashboardPreview />
      )}
    </div>
  )
}

