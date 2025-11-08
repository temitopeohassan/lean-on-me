"use client";

import { ReactNode } from "react";
import { createAppKit, AppKitProvider as Provider } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "viem/chains";
import { http } from "wagmi";
import { projectId } from "@/lib/config";

const queryClient = new QueryClient();

// Initialize adapter + AppKit once globally
const adapter = new WagmiAdapter({
  projectId: projectId || "your-project-id",
  networks: [base],
  transports: {
    [base.id]: http(),
  },
});

const appKit = createAppKit({
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

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider appKit={appKit}>{children}</Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
