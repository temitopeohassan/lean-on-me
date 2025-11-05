import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"

// Dynamically import AppKitProvider to prevent SSR hydration issues
const AppKitProvider = dynamic(() => import("@/providers/appkit-provider").then((mod) => mod.AppKitProvider), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading...</div>
      </div>
    </div>
  ),
})

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lean On Me - P2P Micro-Lending",
  description: "Onchain peer-to-peer lending powered by reputation and income proofs",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  )
}
