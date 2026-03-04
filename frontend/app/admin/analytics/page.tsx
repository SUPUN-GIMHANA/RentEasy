"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, ShoppingBag, DollarSign, Zap } from "lucide-react"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { api } from "@/lib/api-client"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

type AnalyticsItem = {
  id: string
  name: string
  category: string
  views: number
  price: number
  createdAt?: string
}

type AnalyticsBooking = {
  id: string
  itemName?: string
  status?: string
  totalPrice?: number
  createdAt?: string
}

type AnalyticsAd = {
  id: string
  cost?: number
  active?: boolean
}

const lineChartConfig = {
  views: {
    label: "Views",
    color: "#2B70FF",
  },
} satisfies ChartConfig

const topItemsChartConfig = {
  views: {
    label: "Views",
    color: "#2B70FF",
  },
  bookings: {
    label: "Bookings",
    color: "#0EA5E9",
  },
} satisfies ChartConfig

const bookingStatusConfig = {
  confirmed: { label: "Confirmed", color: "#2B70FF" },
  pending: { label: "Pending", color: "#0EA5E9" },
  completed: { label: "Completed", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
  other: { label: "Other", color: "#A3A3A3" },
} satisfies ChartConfig

const categoryChartConfig = {
  items: {
    label: "Items",
    color: "#2B70FF",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [items, setItems] = useState<AnalyticsItem[]>([])
  const [bookings, setBookings] = useState<AnalyticsBooking[]>([])
  const [ads, setAds] = useState<AnalyticsAd[]>([])

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError("")

        const [itemsRes, bookingsRes, adsRes] = await Promise.allSettled([
          api.items.getMyItems(),
          api.bookings.getOwnerBookings(),
          api.advertisements.getAll(),
        ])

        const normalizedItems: AnalyticsItem[] =
          itemsRes.status === "fulfilled"
            ? (itemsRes.value || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category || "Uncategorized",
                views: Number(item.views || 0),
                price: Number(item.price || 0),
                createdAt: item.createdAt,
              }))
            : []

        const normalizedBookings: AnalyticsBooking[] =
          bookingsRes.status === "fulfilled"
            ? (bookingsRes.value || []).map((booking: any) => ({
                id: booking.id,
                itemName: booking.itemName,
                status: booking.status,
                totalPrice: Number(booking.totalPrice || 0),
                createdAt: booking.createdAt,
              }))
            : []

        const normalizedAds: AnalyticsAd[] =
          adsRes.status === "fulfilled"
            ? (adsRes.value || []).map((ad: any) => ({
                id: ad.id,
                cost: Number(ad.cost || 0),
                active: Boolean(ad.active),
              }))
            : []

        setItems(normalizedItems)
        setBookings(normalizedBookings)
        setAds(normalizedAds)

        if (itemsRes.status === "rejected" && bookingsRes.status === "rejected" && adsRes.status === "rejected") {
          setError("Failed to load analytics data")
        }
      } catch (e) {
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  const totalViews = useMemo(() => items.reduce((sum, item) => sum + item.views, 0), [items])
  const totalBookings = useMemo(() => bookings.length, [bookings])
  const bookingRevenue = useMemo(() => bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0), [bookings])
  const adRevenue = useMemo(() => ads.reduce((sum, ad) => sum + (ad.cost || 0), 0), [ads])

  const stats = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      change: `${items.length} published items`,
      trend: totalViews > 0 ? "up" : "down",
      icon: Eye,
    },
    {
      title: "Total Bookings",
      value: totalBookings.toLocaleString(),
      change: `${bookings.filter((b) => String(b.status || "").toLowerCase() === "confirmed").length} confirmed`,
      trend: totalBookings > 0 ? "up" : "down",
      icon: ShoppingBag,
    },
    {
      title: "Booking Revenue",
      value: formatCurrency(bookingRevenue),
      change: "From owner bookings",
      trend: bookingRevenue > 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Ad Revenue",
      value: formatCurrency(adRevenue),
      change: `${ads.filter((ad) => ad.active).length} active ads`,
      trend: adRevenue > 0 ? "up" : "down",
      icon: Zap,
    },
  ] as const

  const trafficOverviewData = useMemo(() => {
    const points: { month: string; views: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = monthDate.toLocaleString("en-US", { month: "short" })
      points.push({ month: monthLabel, views: 0 })
    }

    items.forEach((item) => {
      if (!item.createdAt) {
        points[points.length - 1].views += item.views
        return
      }

      const created = new Date(item.createdAt)
      const diffMonths = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth())
      if (diffMonths >= 0 && diffMonths < 6) {
        const index = points.length - 1 - diffMonths
        points[index].views += item.views
      }
    })

    return points
  }, [items])

  const topPerformers = useMemo(() => {
    const bookingsByItemName = bookings.reduce<Record<string, number>>((acc, booking) => {
      const key = booking.itemName || "Unknown item"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return [...items]
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)
      .map((item) => ({
        name: item.name,
        shortName: item.name.length > 14 ? `${item.name.slice(0, 14)}…` : item.name,
        views: item.views,
        bookings: bookingsByItemName[item.name] || 0,
        revenue: (bookingsByItemName[item.name] || 0) * item.price,
      }))
  }, [items, bookings])

  const bookingStatusData = useMemo(() => {
    const counters = {
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      other: 0,
    }

    bookings.forEach((booking) => {
      const status = String(booking.status || "").toLowerCase()
      if (status === "confirmed") counters.confirmed += 1
      else if (status === "pending") counters.pending += 1
      else if (status === "completed") counters.completed += 1
      else if (status === "cancelled") counters.cancelled += 1
      else counters.other += 1
    })

    return [
      { status: "confirmed", value: counters.confirmed, fill: "var(--color-confirmed)" },
      { status: "pending", value: counters.pending, fill: "var(--color-pending)" },
      { status: "completed", value: counters.completed, fill: "var(--color-completed)" },
      { status: "cancelled", value: counters.cancelled, fill: "var(--color-cancelled)" },
      { status: "other", value: counters.other, fill: "var(--color-other)" },
    ].filter((entry) => entry.value > 0)
  }, [bookings])

  const categoryData = useMemo(() => {
    const map = items.reduce<Record<string, number>>((acc, item) => {
      const key = item.category || "Uncategorized"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(map)
      .map(([category, count]) => ({ category, items: count }))
      .sort((a, b) => b.items - a.items)
      .slice(0, 6)
  }, [items])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-red-700 text-sm">{error}</CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{loading ? "..." : stat.value}</div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
          ) : (
            <ChartContainer config={lineChartConfig} className="h-64 w-full">
              <LineChart data={trafficOverviewData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Top Performing Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
          ) : topPerformers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No item performance data yet.</p>
          ) : (
            <>
              <ChartContainer config={topItemsChartConfig} className="h-72 w-full">
                <BarChart data={topPerformers}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="shortName" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>

              <div className="space-y-3 mt-4">
                {topPerformers.slice(0, 3).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.views.toLocaleString()} views • {item.bookings} bookings
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#2B70FF]">{formatCurrency(item.revenue)}</span>
                      {index === 0 && <Badge className="bg-linear-to-r from-yellow-400 to-orange-500">Top Performer</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
            ) : bookingStatusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No booking status data yet.</p>
            ) : (
              <ChartContainer config={bookingStatusConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                  <Pie data={bookingStatusData} dataKey="value" nameKey="status" innerRadius={50} outerRadius={85} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
            ) : categoryData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No category data yet.</p>
            ) : (
              <ChartContainer config={categoryChartConfig} className="h-64 w-full">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="items" fill="var(--color-items)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
