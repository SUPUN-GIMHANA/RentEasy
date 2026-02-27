"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Eye, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import BoostSelectionModal from "@/components/BoostSelectionModal"
import BoostPaymentModal from "@/components/BoostPaymentModal"

const boostPlans = [
  {
    id: "basic",
    name: "Basic Boost",
    duration: "3 days",
    price: 9.99,
    features: ["2x visibility", "Featured badge", "Priority in search"],
  },
  {
    id: "premium",
    name: "Premium Boost",
    duration: "7 days",
    price: 19.99,
    features: [
      "5x visibility",
      "Featured badge",
      "Priority in search",
      "Homepage featured",
    ],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Boost",
    duration: "14 days",
    price: 34.99,
    features: [
      "10x visibility",
      "Featured badge",
      "Priority in search",
      "Homepage featured",
      "Social media promotion",
    ],
  },
]

const initialActiveBoosts = [
  {
    id: "1",
    name: "Professional Camera Kit",
    plan: "Premium Boost",
    daysLeft: 4,
    image: "/professional-camera-kit.jpg",
  },
  {
    id: "2",
    name: "Luxury Camping Tent",
    plan: "Basic Boost",
    daysLeft: 1,
    image: "/luxury-camping-tent-setup.jpg",
  },
]

const initialAvailableItems = [
  {
    id: "3",
    name: "DJ Sound System",
    category: "Events",
    price: 12000,
    image: "/professional-dj-sound-system.jpg",
  },
  {
    id: "4",
    name: "Mountain Bike",
    category: "Sports",
    price: 2000,
    image: "/mountain-bike-adventure.jpg",
  },
]

export default function BoostAdvertisementPage() {
  const searchParams = useSearchParams()
  const [activeBoosts, setActiveBoosts] = useState(initialActiveBoosts)
  const [availableItems, setAvailableItems] = useState(initialAvailableItems)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
  const [selectedBoostModal, setSelectedBoostModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)

  // Load added items from localStorage (run once on mount)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const addedItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      if (addedItems.length > 0) {
        // Add newly created items to available items, avoiding duplicates
        setAvailableItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const initialIds = new Set(initialAvailableItems.map((item) => item.id))
          
          const newItems = addedItems.filter(
            (item: any) => !existingIds.has(item.id) && !initialIds.has(item.id)
          )
          return [...prev, ...newItems]
        })
      }
    }
  }, [])

  // Check for success message from searchParams
  useEffect(() => {
    if (searchParams.get("success")) {
      setSuccessMessage("Boost activated successfully!")
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }, [searchParams])

  const handleBoostItem = (item: any) => {
    setSelectedItem(item)
    setSelectedBoostModal(true)
  }

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan)
    setPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setActiveBoosts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: selectedItem?.name || "",
        plan: selectedPlan?.name || "",
        daysLeft: parseInt(selectedPlan?.duration.replace(" days", "")),
        image: selectedItem?.image || "",
      },
    ])
    setSelectedItem(null)
    setSelectedPlan(null)
    setPaymentModal(false)
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Boost Advertisement</h1>
        <p className="text-muted-foreground">
          Increase visibility and reach more customers
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Boosts</h2>
        {activeBoosts.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">No active boosts</p>
                <p className="text-sm text-blue-700">
                  Select an item below to start boosting
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeBoosts.map((boost) => (
              <Card
                key={boost.id}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={boost.image || "/placeholder.svg"}
                        alt={boost.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{boost.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {boost.plan}
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Zap className="h-3 w-3 mr-1" />
                      {boost.daysLeft} days left
                    </Badge>
                    <Button variant="outline" size="sm">
                      Extend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Items to Boost</h2>
        {availableItems.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-900">
                All your items are already boosted or you need to add new items
                in Manage Items
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-32 w-full">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.category}
                  </p>
                  <Link href={`/admin/boost/select-plan?itemId=${item.id}`}>
                    <Button className="w-full bg-[#2B70FF] hover:bg-[#1A4FCC]">
                      <Zap className="h-4 w-4 mr-2" />
                      Boost This Item
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#2B70FF] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                Why Boost Your Listings?
              </h3>
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


    </div>
  )
}
