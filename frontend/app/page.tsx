"use client"

import dynamic from "next/dynamic"

// Dynamically import the client component to prevent SSR
const ClientHome = dynamic(() => import("./client-home"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted">Loading...</div>
    </div>
  ),
})

export default function Home() {
  return <ClientHome />
}
