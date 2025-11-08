"use client";

import { useMemo } from "react";
import { createAppKit } from "@reown/appkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "viem/chains";
import { http } from "wagmi";
import { projectId } from "@/lib/config";

const queryClient = new QueryClient();

// Create adapter + AppKit ONCE globally
const adapter = new WagmiAdapter({
  projectId: projectId || "your-project-id",
  networks: [base],
  transports: {
    [base.id]: http(),
  },
});

createAppKit({
  adapters: [adapter],
  projectId: projectId || "your-project-id",
  networks: [base],
  metadata: {
    name: "Lean On Me",
    description: "P2P Micro-Lending Platform",
    url: typeof window !== "undefined" ? window.location.origin : "",
    icons: [],
  },
});

const wagmiConfig = adapter.wagmiConfig;

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  // No conditional render, no hydration mismatch
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
