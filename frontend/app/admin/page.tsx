"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Zap, DollarSign, ShoppingBag, PlusCircle, BarChart3 } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

type DashboardItem = {
  id: string
  name: string
  views: number
  price: number
  status: string
  boosted: boolean
  imageUrl?: string
  available?: boolean
  createdAt?: string
  updatedAt?: string
}

type DashboardAd = {
  id: string
  title: string
  cost?: number
  active?: boolean
  createdAt?: string
}

type DashboardBooking = {
  id: string
  itemName?: string
  totalPrice?: number
  status?: string
  createdAt?: string
}

type DashboardStat = {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: typeof ShoppingBag
}

type ActivityEntry = {
  label: string
  date: Date
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [items, setItems] = useState<DashboardItem[]>([])
  const [ads, setAds] = useState<DashboardAd[]>([])
  const [ownerBookings, setOwnerBookings] = useState<DashboardBooking[]>([])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError("")

        const [myItemsRes, adsRes, bookingsRes] = await Promise.allSettled([
          api.items.getMyItems(),
          api.advertisements.getAll(),
          api.bookings.getOwnerBookings(),
        ])

        const normalizedItems: DashboardItem[] =
          myItemsRes.status === "fulfilled"
            ? (myItemsRes.value || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                views: Number(item.views || 0),
                price: Number(item.price || 0),
                status: String(item.status || ""),
                boosted: Boolean(item.boosted),
                imageUrl: item.imageUrl,
                available: item.available,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              }))
            : []

        const normalizedAds: DashboardAd[] =
          adsRes.status === "fulfilled"
            ? (adsRes.value || []).map((ad: any) => ({
                id: ad.id,
                title: ad.title,
                cost: Number(ad.cost || 0),
                active: Boolean(ad.active),
                createdAt: ad.createdAt,
              }))
            : []

        const normalizedBookings: DashboardBooking[] =
          bookingsRes.status === "fulfilled"
            ? (bookingsRes.value || []).map((booking: any) => ({
                id: booking.id,
                itemName: booking.itemName,
                totalPrice: Number(booking.totalPrice || 0),
                status: booking.status,
                createdAt: booking.createdAt,
              }))
            : []

        setItems(normalizedItems)
        setAds(normalizedAds)
        setOwnerBookings(normalizedBookings)

        if (
          myItemsRes.status === "rejected" &&
          adsRes.status === "rejected" &&
          bookingsRes.status === "rejected"
        ) {
          setError("Failed to load dashboard data")
        }
      } catch (e) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user?.id])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount)

  const stats = useMemo<DashboardStat[]>(() => {
    const totalItems = items.length
    const activeItems = items.filter(
      (item) => item.available !== false && String(item.status).toUpperCase() !== "INACTIVE"
    ).length
    const totalViews = items.reduce((sum, item) => sum + (Number(item.views) || 0), 0)
    const bookingRevenue = ownerBookings.reduce((sum, booking) => sum + (Number(booking.totalPrice) || 0), 0)
    const commercialRevenue = ads.reduce((sum, ad) => sum + (Number(ad.cost) || 0), 0)

    return [
      {
        title: "Total Items",
        value: totalItems.toLocaleString(),
        change: `${activeItems} active now`,
        trend: activeItems > 0 ? "up" : "down",
        icon: ShoppingBag,
      },
      {
        title: "Active Items",
        value: activeItems.toLocaleString(),
        change: `${Math.max(totalItems - activeItems, 0)} inactive`,
        trend: activeItems >= Math.max(totalItems - activeItems, 0) ? "up" : "down",
        icon: Zap,
      },
      {
        title: "Total Views",
        value: totalViews.toLocaleString(),
        change: "Across all your items",
        trend: totalViews > 0 ? "up" : "down",
        icon: Eye,
      },
      {
        title: "Booking Revenue",
        value: formatCurrency(bookingRevenue),
        change: `${ownerBookings.length} owner bookings`,
        trend: bookingRevenue > 0 ? "up" : "down",
        icon: TrendingUp,
      },
      {
        title: "Commercial Revenue",
        value: formatCurrency(commercialRevenue),
        change: `${ads.filter((ad) => ad.active).length} active campaigns`,
        trend: commercialRevenue > 0 ? "up" : "down",
        icon: DollarSign,
      },
    ]
  }, [items, ownerBookings, ads])

  const mostViewedItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3)
      .map((item) => ({
        ...item,
        image: item.imageUrl || "/placeholder.svg",
      }))
  }, [items])

  const recentActivity = useMemo(() => {
    const entries: ActivityEntry[] = []

    items.forEach((item) => {
      if (item.createdAt) {
        entries.push({ label: `Item created: '${item.name}'`, date: new Date(item.createdAt) })
      }
      if (item.boosted) {
        entries.push({
          label: `Boost active on '${item.name}'`,
          date: new Date(item.updatedAt || item.createdAt || Date.now()),
        })
      }
    })

    ownerBookings.forEach((booking) => {
      entries.push({
        label: `Booking ${String(booking.status || "PENDING").toLowerCase()} for '${booking.itemName || "item"}'`,
        date: new Date(booking.createdAt || Date.now()),
      })
    })

    ads.forEach((ad) => {
      if (ad.createdAt) {
        entries.push({ label: `Commercial ad created: '${ad.title}'`, date: new Date(ad.createdAt) })
      }
    })

    return entries
      .filter((entry) => !Number.isNaN(entry.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map((entry) => entry.label)
  }, [items, ownerBookings, ads])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your rental business.</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              asChild
            >
              <a href="/admin/boost">
                <Zap className="h-6 w-6" />
                <span>Boost Item</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              asChild
            >
              <a href="/admin/commercial">
                <DollarSign className="h-6 w-6" />
                <span>Create Commercial Ad</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              asChild
            >
              <a href="/admin/add-ad">
                <PlusCircle className="h-6 w-6" />
                <span>Add New Item</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
              asChild
            >
              <a href="/admin/analytics">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Most Viewed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!loading && mostViewedItems.length === 0 && (
                <p className="text-sm text-muted-foreground">No item data available yet.</p>
              )}
              {mostViewedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-[#2B70FF] to-[#1A4FCC] text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.views.toLocaleString()} views • {formatCurrency(item.price || 0)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {String(item.status).toLowerCase() === "sold" && (
                      <Badge variant="secondary" className="bg-gray-200">
                        sold
                      </Badge>
                    )}
                    {(item.available !== false || String(item.status).toLowerCase() === "active") && (
                      <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
                    )}
                    {item.boosted && <Badge className="bg-linear-to-r from-yellow-400 to-orange-500">Boosted</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!loading && recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              )}
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-[#2B70FF] mt-2" />
                  <p className="text-sm text-muted-foreground flex-1">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
