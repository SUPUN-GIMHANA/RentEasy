"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Eye, Clock, AlertCircle, Loader2 } from "lucide-react"
import { api } from "@/lib/api-client"

interface CommercialAd {
  id: string
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  position: "BANNER_TOP" | "BANNER_BOTTOM" | "SIDEBAR" | "CAROUSEL" | "POPUP"
  active: boolean
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  cost?: number
}

const adPlacements = [
  {
    name: "Homepage Banner",
    price: 99.99,
    durationDays: 30,
    impressions: "~15,000",
    description: "Prime placement at the top of homepage",
    position: "BANNER_TOP" as const,
  },
  {
    name: "Search Results",
    price: 79.99,
    durationDays: 30,
    impressions: "~10,000",
    description: "Sidebar placement in search results",
    position: "SIDEBAR" as const,
  },
  {
    name: "Category Featured",
    price: 59.99,
    durationDays: 30,
    impressions: "~8,000",
    description: "Featured spot in category pages",
    position: "CAROUSEL" as const,
  },
]

export default function CommercialAdsPage() {
  const [commercialAds, setCommercialAds] = useState<CommercialAd[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadAds = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.advertisements.getAll()
      setCommercialAds(response || [])
    } catch (err: any) {
      setError(err?.message || "Failed to load commercial ads")
      setCommercialAds([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAds()
  }, [])

  const activeAds = useMemo(() => commercialAds.filter((ad) => ad.active), [commercialAds])
  const totalRevenue = useMemo(() => commercialAds.reduce((sum, ad) => sum + Number(ad.cost || 0), 0), [commercialAds])
  const totalImpressions = useMemo(() => commercialAds.reduce((sum, ad) => sum + Number(ad.impressions || 0), 0), [commercialAds])
  const totalClicks = useMemo(() => commercialAds.reduce((sum, ad) => sum + Number(ad.clicks || 0), 0), [commercialAds])
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0"

  const getEndsIn = (endDate: string) => {
    const diffMs = new Date(endDate).getTime() - Date.now()
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    return `${days} days`
  }

  const handleCreateCampaign = async (placement: (typeof adPlacements)[number]) => {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + placement.durationDays)

      await api.advertisements.create({
        title: placement.name,
        description: placement.description,
        imageUrl: "/placeholder.svg",
        linkUrl: "/",
        position: placement.position,
        active: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        cost: placement.price,
      })

      await loadAds()
    } catch (err: any) {
      setError(err?.message || "Failed to create campaign")
    }
  }

  const handleToggleStatus = async (adId: string, nextActive: boolean) => {
    try {
      await api.advertisements.updateStatus(adId, nextActive)
      await loadAds()
    } catch (err: any) {
      setError(err?.message || "Failed to update campaign status")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commercial Ads</h1>
        <p className="text-muted-foreground">Manage your commercial advertising campaigns</p>
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
            Loading commercial ads...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2B70FF]">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Based on all campaigns
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{ctr}% CTR</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAds.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Running now</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
            {activeAds.length === 0 ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-blue-900">No active campaigns yet.</CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeAds.map((ad) => (
                  <Card key={ad.id} className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{ad.title}</h3>
                            <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Impressions</p>
                              <p className="font-semibold">{Number(ad.impressions || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Clicks</p>
                              <p className="font-semibold">{Number(ad.clicks || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="font-semibold text-[#2B70FF]">${Number(ad.cost || 0).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ends In</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getEndsIn(ad.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleStatus(ad.id, false)}>
                            Pause
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Available Ad Placements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {adPlacements.map((placement) => (
                <Card key={placement.name} className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>{placement.name}</CardTitle>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${placement.price.toFixed(2)}</span>
                      <span className="text-muted-foreground">/ {placement.durationDays} days</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{placement.description}</p>
                    <div className="flex items-center gap-2 text-sm mb-6">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{placement.impressions} impressions</span>
                    </div>
                    <Button
                      className="w-full bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      onClick={() => handleCreateCampaign(placement)}
                    >
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
