"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Eye, Clock } from "lucide-react"

const commercialAds = [
  {
    id: "1",
    title: "Homepage Banner Ad",
    impressions: 12450,
    clicks: 842,
    revenue: "$249.98",
    status: "active",
    endsIn: "12 days",
  },
  {
    id: "2",
    title: "Search Results Sidebar",
    impressions: 8320,
    clicks: 523,
    revenue: "$199.00",
    status: "active",
    endsIn: "5 days",
  },
]

const adPlacements = [
  {
    name: "Homepage Banner",
    price: "$99.99",
    duration: "30 days",
    impressions: "~15,000",
    description: "Prime placement at the top of homepage",
  },
  {
    name: "Search Results",
    price: "$79.99",
    duration: "30 days",
    impressions: "~10,000",
    description: "Sidebar placement in search results",
  },
  {
    name: "Category Featured",
    price: "$59.99",
    duration: "30 days",
    impressions: "~8,000",
    description: "Featured spot in category pages",
  },
]

export default function CommercialAdsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commercial Ads</h1>
        <p className="text-muted-foreground">Manage your commercial advertising campaigns</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2B70FF]">$449.98</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20,770</div>
            <p className="text-xs text-muted-foreground mt-1">All active campaigns</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,365</div>
            <p className="text-xs text-muted-foreground mt-1">6.6% CTR</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Running now</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
        <div className="grid gap-4">
          {commercialAds.map((ad) => (
            <Card key={ad.id} className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{ad.title}</h3>
                      <Badge className="bg-green-500 hover:bg-green-600">{ad.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-[#2B70FF]">{ad.revenue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ends In</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {ad.endsIn}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Pause
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Ad Placements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {adPlacements.map((placement) => (
            <Card key={placement.name} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>{placement.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{placement.price}</span>
                  <span className="text-muted-foreground">/ {placement.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{placement.description}</p>
                <div className="flex items-center gap-2 text-sm mb-6">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{placement.impressions} impressions</span>
                </div>
                <Button className="w-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
