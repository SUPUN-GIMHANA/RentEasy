"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, ShoppingBag, DollarSign, AlertCircle, Loader2 } from "lucide-react"
import { api } from "@/lib/api-client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

interface Item {
  id: string
  name: string
  category: string
  price: number
  views?: number
}

interface Booking {
  id: string
  itemId?: string
  itemName?: string
  userId?: string
  totalPrice?: number
  createdAt?: string
}

interface Ad {
  id: string
  cost?: number
}

const chartConfig = {
  views: {
    label: "Views",
    color: "#2B70FF",
  },
  bookings: {
    label: "Bookings",
    color: "#0EA5E9",
  },
}

export default function AnalyticsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError("")

        const [itemsResponse, bookingsResponse, adsResponse] = await Promise.all([
          api.items.getMyItems(),
          api.bookings.getOwnerBookings().catch(() => []),
          api.advertisements.getAll().catch(() => []),
        ])

        setItems(itemsResponse || [])
        setBookings(bookingsResponse || [])
        setAds(adsResponse || [])
      } catch (err: any) {
        setError(err?.message || "Failed to load analytics")
        setItems([])
        setBookings([])
        setAds([])
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const totalViews = items.reduce((sum, item) => sum + Number(item.views || 0), 0)
  const uniqueVisitors = new Set(bookings.map((booking) => booking.userId).filter(Boolean)).size
  const totalBookings = bookings.length
  const bookingRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0)
  const adRevenue = ads.reduce((sum, ad) => sum + Number(ad.cost || 0), 0)
  const totalRevenue = bookingRevenue + adRevenue

  const topPerformers = useMemo(() => {
    const bookingCountMap = new Map<string, number>()
    const bookingRevenueMap = new Map<string, number>()

    for (const booking of bookings) {
      const itemId = booking.itemId || ""
      if (!itemId) {
        continue
      }
      bookingCountMap.set(itemId, (bookingCountMap.get(itemId) || 0) + 1)
      bookingRevenueMap.set(itemId, (bookingRevenueMap.get(itemId) || 0) + Number(booking.totalPrice || 0))
    }

    return [...items]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.name,
        views: Number(item.views || 0),
        bookings: bookingCountMap.get(item.id) || 0,
        revenue: bookingRevenueMap.get(item.id) || 0,
      }))
  }, [items, bookings])

  const categoryDistribution = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) || 0) + 1)
    }
    const total = Math.max(1, items.length)

    return [...counts.entries()]
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4)
  }, [items])

  const monthlyChartData = useMemo(() => {
    const now = new Date()
    const months: { key: string; label: string; views: number; bookings: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = date.toLocaleString("default", { month: "short" })
      months.push({ key, label, views: 0, bookings: 0 })
    }

    for (const item of items) {
      const createdDate = (item as any).createdAt ? new Date((item as any).createdAt) : null
      if (!createdDate || Number.isNaN(createdDate.getTime())) {
        continue
      }
      const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`
      const targetMonth = months.find((month) => month.key === key)
      if (targetMonth) {
        targetMonth.views += Number(item.views || 0)
      }
    }

    for (const booking of bookings) {
      const createdDate = booking.createdAt ? new Date(booking.createdAt) : null
      if (!createdDate || Number.isNaN(createdDate.getTime())) {
        continue
      }
      const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`
      const targetMonth = months.find((month) => month.key === key)
      if (targetMonth) {
        targetMonth.bookings += 1
      }
    }

    return months
  }, [items, bookings])

  const trafficSources = [
    {
      name: "Item Views",
      value: totalViews,
      percentage: totalViews > 0 ? 100 : 0,
      barClass: "bg-[#2B70FF]",
    },
    {
      name: "Bookings",
      value: totalBookings,
      percentage: totalViews > 0 ? Math.min(100, Math.round((totalBookings / totalViews) * 100 * 10)) : 0,
      barClass: "bg-[#0EA5E9]",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-900 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading analytics...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{totalViews.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{uniqueVisitors.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{totalBookings.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Top Performing Items</CardTitle>
            </CardHeader>
            <CardContent>
              {topPerformers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items yet.</p>
              ) : (
                <div className="space-y-4">
                  {topPerformers.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-[#2B70FF] to-[#1A4FCC] text-white font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <span>{item.views.toLocaleString()} views</span>
                          <span>{item.bookings} bookings</span>
                          <span className="text-[#2B70FF] font-medium">${item.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      {index === 0 && <Badge className="bg-linear-to-r from-yellow-400 to-orange-500">Top Performer</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trafficSources.map((source) => (
                    <div key={source.name}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{source.name}</span>
                        <span className="font-semibold">{source.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className={`${source.barClass} h-2 rounded-full`} style={{ width: `${source.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryDistribution.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No category data yet.</p>
                  ) : (
                    categoryDistribution.map((category) => (
                      <div key={category.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{category.name}</span>
                          <span className="font-semibold">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-linear-to-r from-[#2B70FF] to-[#0EA5E9] h-2 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
