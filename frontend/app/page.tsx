"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import DashboardPreview from "@/components/dashboard-preview"
import FeaturesSection from "@/components/features-section"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} onConnect={() => setIsConnected(true)} />

      {!isConnected ? (
        <>
          <HeroSection onConnect={() => setIsConnected(true)} />
          <FeaturesSection />
        </>
      ) : (
        <DashboardPreview />
      )}
    </div>
  )
}
