"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Users, ShoppingBag, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Views",
    value: "45,231",
    change: "+20.1%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Unique Visitors",
    value: "12,482",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Bookings",
    value: "892",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Revenue",
    value: "$32,450",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
]

const topPerformers = [
  { name: "Professional Camera Kit", views: 2840, bookings: 42, revenue: "$6,300" },
  { name: "Luxury Camping Tent", views: 2120, bookings: 38, revenue: "$5,700" },
  { name: "DJ Sound System", views: 1890, bookings: 28, revenue: "$8,400" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

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
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change} from last month
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
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Top Performing Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.name}</h4>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>{item.bookings} bookings</span>
                    <span className="text-[#2B70FF] font-medium">{item.revenue}</span>
                  </div>
                </div>
                {index === 0 && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Top Performer</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Direct</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-[#2B70FF] h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Search</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-[#0EA5E9] h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Social</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-cyan-400 h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Electronics", percentage: 35 },
                { name: "Vehicles", percentage: 25 },
                { name: "Properties", percentage: 20 },
                { name: "Events", percentage: 20 },
              ].map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{category.name}</span>
                    <span className="font-semibold">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#2B70FF] to-[#0EA5E9] h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
