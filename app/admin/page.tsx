"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, DollarSign, ShoppingBag, PlusCircle, BarChart3, CalendarCheck2, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api-client"

interface Item {
  id: string
  name: string
  category: string
  price: number
  available?: boolean
  views?: number
  imageUrl?: string
  boosted?: boolean
  boostedUntil?: string
  createdAt?: string
}

interface Booking {
  id: string
  itemName?: string
  status?: string
  createdAt?: string
}

export default function AdminDashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError("")

        const [itemsResponse, ownerBookingsResponse] = await Promise.all([
          api.items.getMyItems(),
          api.bookings.getOwnerBookings().catch(() => []),
        ])

        setItems(itemsResponse || [])
        setOwnerBookings(ownerBookingsResponse || [])
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard data")
        setItems([])
        setOwnerBookings([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const now = new Date()

  const totalItems = items.length
  const activeItems = items.filter((item) => item.available).length
  const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0)
  const activeBoosts = items.filter((item) => item.boosted && item.boostedUntil && new Date(item.boostedUntil) > now).length
  const totalBookings = ownerBookings.length

  const stats = [
    { title: "Total Items", value: totalItems.toString(), icon: ShoppingBag },
    { title: "Active Items", value: activeItems.toString(), icon: Zap },
    { title: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
    { title: "Active Boosts", value: activeBoosts.toString(), icon: DollarSign },
    { title: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck2 },
  ]

  const mostViewedItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
  }, [items])

  const recentActivity = useMemo(() => {
    const activities: string[] = []

    const recentBookings = [...ownerBookings]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3)
      .map((booking) => `New booking (${booking.status || "PENDING"}) for '${booking.itemName || "your item"}'`)

    const recentlyBoostedItems = items
      .filter((item) => item.boosted)
      .slice(0, 2)
      .map((item) => `Boost active for '${item.name}'`)

    activities.push(...recentBookings, ...recentlyBoostedItems)

    if (activities.length === 0) {
      activities.push("No recent activity yet")
    }

    return activities.slice(0, 5)
  }, [items, ownerBookings])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your rental business.</p>
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
          <CardContent className="p-8 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dashboard data...
          </CardContent>
        </Card>
      ) : (
        <>
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
                    <div className="text-2xl font-bold">{stat.value}</div>
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
                  <Link href="/admin/boost">
                    <Zap className="h-6 w-6" />
                    <span>Boost Item</span>
                  </Link>
                </Button>
                <Button
                  className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  asChild
                >
                  <Link href="/admin/commercial">
                    <DollarSign className="h-6 w-6" />
                    <span>Create Commercial Ad</span>
                  </Link>
                </Button>
                <Button
                  className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  asChild
                >
                  <Link href="/admin/add-ad">
                    <PlusCircle className="h-6 w-6" />
                    <span>Add New Item</span>
                  </Link>
                </Button>
                <Button
                  className="flex flex-col items-center gap-2 h-auto py-6 bg-linear-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                  asChild
                >
                  <Link href="/admin/analytics">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Link>
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
                {mostViewedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items yet.</p>
                ) : (
                  <div className="space-y-4">
                    {mostViewedItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-[#2B70FF] to-[#1A4FCC] text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.views || 0} views • LKR {Number(item.price || 0).toLocaleString()}/day</p>
                        </div>
                        <div className="flex gap-2">
                          {item.available ? (
                            <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-200">inactive</Badge>
                          )}
                          {item.boosted && <Badge className="bg-linear-to-r from-yellow-400 to-orange-500">Boosted</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
        </>
      )}
    </div>
  )
}
