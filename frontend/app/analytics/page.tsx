// frontend/app/analytics/page.tsx
"use client";

import dynamic from "next/dynamic";

// ✅ Dynamically import the client analytics component (browser-only)
const ClientAnalytics = dynamic(() => import("./client-analytics"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics & Metrics</h1>
          <p className="text-muted">
            Track protocol performance and market insights
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted">Loading charts...</div>
        </div>
      </div>
    </div>
  ),
});

export default function AnalyticsPage() {
  return <ClientAnalytics />;
}
