"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Zap, DollarSign, ShoppingBag, PlusCircle, BarChart3 } from "lucide-react"
import Image from "next/image"

const stats = [
  {
    title: "Total Items",
    value: "4",
    change: "+12% from last month",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Active Items",
    value: "2",
    change: "-8% from last month",
    trend: "down",
    icon: Zap,
  },
  {
    title: "Total Views",
    value: "1,124",
    change: "+23% from last month",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Boost Revenue",
    value: "$319.97",
    change: "+15% from last month",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Commercial Revenue",
    value: "$449.98",
    change: "+25% from last month",
    trend: "up",
    icon: DollarSign,
  },
]

const mostViewedItems = [
  {
    id: "1",
    name: "Modern House for Sale",
    views: 567,
    price: "$530,000",
    status: "sold",
    image: "/modern-house.png",
  },
  {
    id: "2",
    name: "Luxury Apartment Downtown",
    views: 245,
    price: "$1,200",
    status: "active",
    boosted: true,
    image: "/luxury-apartment-interior.png",
  },
  {
    id: "3",
    name: "Cozy Studio Near University",
    views: 189,
    price: "$810",
    status: "active",
    image: "/cozy-studio.png",
  },
]

const recentActivity = [
  "New comment on 'Luxury Apartment Downtown'",
  "Item 'Modern House for Sale' marked as sold",
  "New inquiry for 'Cozy Studio Near University'",
  "Item 'Office Space Downtown' deactivated",
  "Boost activated for 'Luxury Apartment Downtown'",
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your rental business.</p>
      </div>

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
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
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
              className="flex flex-col items-center gap-2 h-auto py-6 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              asChild
            >
              <a href="/admin/boost">
                <Zap className="h-6 w-6" />
                <span>Boost Item</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              asChild
            >
              <a href="/admin/commercial">
                <DollarSign className="h-6 w-6" />
                <span>Create Commercial Ad</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              asChild
            >
              <a href="/admin/add-ad">
                <PlusCircle className="h-6 w-6" />
                <span>Add New Item</span>
              </a>
            </Button>
            <Button
              className="flex flex-col items-center gap-2 h-auto py-6 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
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
              {mostViewedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.views} views • {item.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.status === "sold" && (
                      <Badge variant="secondary" className="bg-gray-200">
                        sold
                      </Badge>
                    )}
                    {item.status === "active" && <Badge className="bg-green-500 hover:bg-green-600">active</Badge>}
                    {item.boosted && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Boosted</Badge>}
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
