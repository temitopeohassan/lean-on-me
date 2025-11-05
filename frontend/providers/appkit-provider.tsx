"use client"

import { useMemo } from "react"
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

// Initialize AppKit synchronously during module load (client-side only)
function initializeAppKit() {
  if (typeof window === "undefined") return null

  if (appKitInitialized && globalWagmiConfig) {
    return globalWagmiConfig
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
    return globalWagmiConfig
  } catch (error) {
    console.error("Failed to initialize AppKit:", error)
    return null
  }
}

// Initialize immediately if we're on the client
if (typeof window !== "undefined") {
  initializeAppKit()
}

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  // Initialize AppKit synchronously during render (client-side only)
  const wagmiConfig = useMemo(() => {
    if (typeof window === "undefined") {
      // On server, return null but don't try to initialize
      return null
    }
    // On client, initialize immediately
    const config = initializeAppKit()
    return config
  }, [])

  // Don't render children until AppKit is initialized
  // Since this component is loaded with ssr: false, this should only run on client
  if (typeof window === "undefined" || !wagmiConfig || !appKitInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted">Initializing...</div>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
