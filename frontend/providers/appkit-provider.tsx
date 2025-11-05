"use client"

import { useEffect, useState, useLayoutEffect } from "react"
import { createAppKit } from "@reown/appkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { base } from "viem/chains"
import { http } from "wagmi"
import { projectId } from "@/lib/config"

const queryClient = new QueryClient()

let appKitInitialized = false
let globalWagmiConfig: any = null

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [wagmiConfig, setWagmiConfig] = useState<any>(null)

  // Use useLayoutEffect to run synchronously before paint
  useLayoutEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return

    // If already initialized, use the existing config
    if (appKitInitialized && globalWagmiConfig) {
      setWagmiConfig(globalWagmiConfig)
      setMounted(true)
      return
    }

    // Validate project ID
    if (!projectId || projectId === "your-project-id" || projectId === "your-project-id-here") {
      console.warn(
        "⚠️  Reown AppKit Project ID not configured. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your environment variables."
      )
      console.warn("⚠️  Get your project ID from https://dashboard.reown.com")
    }

    try {
      // Create adapter directly with wagmi parameters
      const adapter = new WagmiAdapter({
        projectId: projectId || "your-project-id",
        networks: [base],
        transports: {
          [base.id]: http(),
        },
      })

      // IMPORTANT: Create AppKit instance FIRST before getting config
      // This initializes the AppKit system before any hooks can be used
      createAppKit({
        adapters: [adapter],
        projectId: projectId || "your-project-id",
        networks: [base],
        metadata: {
          name: "Lean On Me",
          description: "P2P Micro-Lending Platform",
          url: window.location.origin,
          icons: [],
        },
      })

      // Now retrieve wagmiConfig from adapter
      globalWagmiConfig = adapter.wagmiConfig
      appKitInitialized = true
      setWagmiConfig(globalWagmiConfig)
      setMounted(true)
    } catch (error) {
      console.error("Failed to initialize AppKit:", error)
    }
  }, [])

  // Don't render children until mounted and AppKit is initialized
  if (!mounted || !wagmiConfig || !appKitInitialized) {
    return null
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
