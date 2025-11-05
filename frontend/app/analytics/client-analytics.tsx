"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"

const lineChartData = [
  { month: "Jan", tvl: 400000, loans: 45, users: 120 },
  { month: "Feb", tvl: 520000, loans: 62, users: 185 },
  { month: "Mar", tvl: 680000, loans: 89, users: 280 },
  { month: "Apr", tvl: 920000, loans: 124, users: 420 },
  { month: "May", tvl: 1200000, loans: 156, users: 580 },
  { month: "Jun", tvl: 1450000, loans: 198, users: 750 },
  { month: "Jul", tvl: 1850000, loans: 245, users: 920 },
  { month: "Aug", tvl: 2100000, loans: 287, users: 1100 },
  { month: "Sep", tvl: 2350000, loans: 312, users: 1280 },
  { month: "Oct", tvl: 2400000, loans: 340, users: 1420 },
]

const loanStatusData = [
  { name: "Active", value: 340, fill: "#10b981" },
  { name: "Completed", value: 1240, fill: "#6366f1" },
  { name: "Defaulted", value: 28, fill: "#ef4444" },
]

const interestRateData = [
  { range: "5-6%", count: 45 },
  { range: "6-7%", count: 78 },
  { range: "7-8%", count: 125 },
  { range: "8-9%", count: 89 },
  { range: "9-10%", count: 34 },
]

const userMetrics = [
  { metric: "Total Users", value: "1,420", change: "+12.5%", icon: Users },
  { metric: "Active Borrowers", value: "340", change: "+8.2%", icon: Activity },
  { metric: "Active Lenders", value: "520", change: "+15.3%", icon: DollarSign },
  { metric: "Avg Reputation", value: "712", change: "+3.1%", icon: TrendingUp },
]

export default function ClientAnalytics() {
  const [mounted, setMounted] = useState(false)
  const [Charts, setCharts] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Load charts module on client side only
    import("@/components/analytics-charts").then((mod) => {
      setCharts({
        LineChart: mod.LineChart,
        Line: mod.Line,
        BarChart: mod.BarChart,
        Bar: mod.Bar,
        PieChart: mod.PieChart,
        Pie: mod.Pie,
        Cell: mod.Cell,
        XAxis: mod.XAxis,
        YAxis: mod.YAxis,
        CartesianGrid: mod.CartesianGrid,
        Tooltip: mod.Tooltip,
        Legend: mod.Legend,
        ResponsiveContainer: mod.ResponsiveContainer,
      })
    })
  }, [])

  if (!mounted || !Charts) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics & Metrics</h1>
            <p className="text-muted">Track protocol performance and market insights</p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted">Loading charts...</div>
          </div>
        </div>
      </div>
    )
  }

  const {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } = Charts

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics & Metrics</h1>
          <p className="text-muted">Track protocol performance and market insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userMetrics.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.metric} className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                  <p className="text-sm text-accent mt-2">{item.change} this month</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="protocol" className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="protocol">Protocol Metrics</TabsTrigger>
            <TabsTrigger value="loans">Loan Analytics</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
          </TabsList>

          <TabsContent value="protocol" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Total Value Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2.4M</div>
                  <p className="text-sm text-accent mt-2">+18.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Total Loans Issued</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$8.2M</div>
                  <p className="text-sm text-accent mt-2">+22.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Protocol Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$125K</div>
                  <p className="text-sm text-accent mt-2">+31.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>TVL & Loan Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tvl"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1", r: 4 }}
                      name="TVL ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Loan Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={loanStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {loanStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Interest Rate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={interestRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="range" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Loan Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-light border border-border rounded-lg p-4">
                    <p className="text-sm text-muted mb-1">Average Loan Size</p>
                    <p className="text-2xl font-bold">$2,410</p>
                  </div>
                  <div className="bg-surface-light border border-border rounded-lg p-4">
                    <p className="text-sm text-muted mb-1">Repayment Rate</p>
                    <p className="text-2xl font-bold text-accent">94.2%</p>
                  </div>
                  <div className="bg-surface-light border border-border rounded-lg p-4">
                    <p className="text-sm text-muted mb-1">Default Rate</p>
                    <p className="text-2xl font-bold text-red-400">2.1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                      name="Total Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>User Segments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { segment: "Borrowers Only", count: 420, percentage: 29.6 },
                    { segment: "Lenders Only", count: 580, percentage: 40.8 },
                    { segment: "Both", count: 420, percentage: 29.6 },
                  ].map((item) => (
                    <div key={item.segment}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.segment}</span>
                        <span className="text-muted">{item.count} users</span>
                      </div>
                      <div className="w-full bg-surface-light rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Reputation Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { tier: "Tier S (900+)", count: 45, percentage: 3.2 },
                    { tier: "Tier A (700-899)", count: 520, percentage: 36.6 },
                    { tier: "Tier B (500-699)", count: 680, percentage: 47.9 },
                    { tier: "Tier C (<500)", count: 175, percentage: 12.3 },
                  ].map((item) => (
                    <div key={item.tier}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.tier}</span>
                        <span className="text-muted">{item.count} users</span>
                      </div>
                      <div className="w-full bg-surface-light rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Loan Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="loans" fill="#6366f1" radius={[8, 8, 0, 0]} name="Loans Issued" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Avg Interest Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">8.2%</div>
                  <p className="text-sm text-muted mt-2">Across all loans</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Avg Loan Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45 days</div>
                  <p className="text-sm text-muted mt-2">Average term length</p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted">Market Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">87.5%</div>
                  <p className="text-sm text-muted mt-2">TVL deployed in loans</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

