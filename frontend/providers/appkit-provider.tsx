"use client"

import { useEffect, useState } from "react"
import { createAppKit } from "@reown/appkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { base } from "viem/chains"
import { http } from "wagmi"
import { projectId } from "@/lib/config"

const queryClient = new QueryClient()

let appKitInitialized = false

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const [wagmiConfig, setWagmiConfig] = useState<any>(null)

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined" || appKitInitialized) return

    // Create adapter directly with wagmi parameters
    const adapter = new WagmiAdapter({
      projectId, // required
      networks: [base], // required
      transports: {
        [base.id]: http(),
      },
    })

    // Retrieve wagmiConfig from adapter
    const config = adapter.wagmiConfig
    setWagmiConfig(config)

    // Create AppKit instance
    createAppKit({
      adapters: [adapter],
      projectId,
      networks: [base],
      metadata: {
        name: "Lean On Me",
        description: "P2P Micro-Lending Platform",
        url: window.location.origin,
        icons: [],
      },
    })

    appKitInitialized = true
  }, [])

  // Don't render children until AppKit is initialized
  if (!wagmiConfig) {
    return null
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
