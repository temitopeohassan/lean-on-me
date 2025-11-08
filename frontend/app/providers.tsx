"use client";

import { AppKitProvider } from "@/providers/appkit-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppKitProvider>{children}</AppKitProvider>;
}
