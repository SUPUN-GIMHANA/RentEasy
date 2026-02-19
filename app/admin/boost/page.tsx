"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Eye, AlertCircle } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api-client"
import { BoostSelectionModal } from "@/components/boost-selection-modal"
import { BoostPaymentModal } from "@/components/boost-payment-modal"

const boostPlans = [
  {
    id: "basic",
    name: "Basic Boost",
    duration: "3 days",
    durationDays: 3,
    price: 9.99,
    features: ["2x visibility", "Featured badge", "Priority in search"],
  },
  {
    id: "premium",
    name: "Premium Boost",
    duration: "7 days",
    durationDays: 7,
    price: 19.99,
    features: ["5x visibility", "Featured badge", "Priority in search", "Homepage featured"],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Boost",
    duration: "14 days",
    durationDays: 14,
    price: 34.99,
    features: ["10x visibility", "Featured badge", "Priority in search", "Homepage featured", "Social media promotion"],
  },
]

interface Item {
  id: string
  name: string
  category: string
  price: number
  imageUrl?: string
  boosted?: boolean
  boostedUntil?: string
}

export default function BoostAdvertisementPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<(typeof boostPlans)[number] | null>(null)
  const [selectedBoostModal, setSelectedBoostModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)

  const loadItems = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.items.getMyItems()
      setItems(response || [])
    } catch (err: any) {
      setError(err?.message || "Failed to load items")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const activeBoosts = useMemo(() => {
    const now = new Date()
    return items
      .filter((item) => item.boosted && item.boostedUntil && new Date(item.boostedUntil) > now)
      .map((item) => {
        const daysLeft = Math.max(1, Math.ceil((new Date(item.boostedUntil as string).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        return {
          ...item,
          daysLeft,
        }
      })
  }, [items])

  const availableItems = useMemo(() => {
    const boostedIds = new Set(activeBoosts.map((item) => item.id))
    return items.filter((item) => !boostedIds.has(item.id))
  }, [items, activeBoosts])

  const handleBoostItem = (item: Item) => {
    setSelectedItem(item)
    setSelectedBoostModal(true)
  }

  const handleSelectPlan = (planId: string) => {
    const plan = boostPlans.find((entry) => entry.id === planId)
    if (!plan) {
      return
    }
    setSelectedPlan(plan)
    setPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    if (!selectedItem || !selectedPlan) {
      return
    }

    try {
      await api.items.boost(selectedItem.id, selectedPlan.durationDays)
      setSuccessMessage("Boost activated successfully!")
      setTimeout(() => setSuccessMessage(null), 5000)
      await loadItems()
    } catch (err: any) {
      setError(err?.message || "Failed to activate boost")
    } finally {
      setSelectedItem(null)
      setSelectedPlan(null)
      setPaymentModal(false)
      setSelectedBoostModal(false)
    }
  }

  return (
    <div className="space-y-8">
      {successMessage && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            <p className="text-green-900 font-medium">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-900 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h1 className="text-3xl font-bold mb-2">Boost Advertisement</h1>
        <p className="text-muted-foreground">Increase visibility and reach more customers</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Boosts</h2>
        {loading ? (
          <Card>
            <CardContent className="p-6 text-muted-foreground">Loading boosts...</CardContent>
          </Card>
        ) : activeBoosts.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">No active boosts</p>
                <p className="text-sm text-blue-700">Select an item below to start boosting</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeBoosts.map((boost) => (
              <Card key={boost.id} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={boost.imageUrl || "/placeholder.svg"} alt={boost.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{boost.name}</h3>
                      <p className="text-sm text-muted-foreground">Boost active</p>
                    </div>
                    <Badge className="bg-linear-to-r from-yellow-400 to-orange-500">
                      <Zap className="h-3 w-3 mr-1" />
                      {boost.daysLeft} days left
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Items to Boost</h2>
        {loading ? (
          <Card>
            <CardContent className="p-6 text-muted-foreground">Loading items...</CardContent>
          </Card>
        ) : availableItems.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-900">All your items are already boosted or you need to add new items in Manage Items.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-32 w-full">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.category}</p>
                  <Button className="w-full bg-[#2B70FF] hover:bg-[#1A4FCC]" onClick={() => handleBoostItem(item)}>
                    <Zap className="h-4 w-4 mr-2" />
                    Boost This Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="bg-linear-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#2B70FF] flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Why Boost Your Listings?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Get 2-10x more views on your listings
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Appear at the top of search results
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Book rentals faster with increased visibility
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <BoostSelectionModal
        open={selectedBoostModal}
        onOpenChange={setSelectedBoostModal}
        itemName={selectedItem?.name || ""}
        itemImage={selectedItem?.imageUrl || ""}
        plans={boostPlans}
        onSelectPlan={(planId) => handleSelectPlan(planId)}
      />

      <BoostPaymentModal
        open={paymentModal}
        onOpenChange={setPaymentModal}
        itemName={selectedItem?.name || ""}
        planName={selectedPlan?.name || ""}
        amount={selectedPlan?.price || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
