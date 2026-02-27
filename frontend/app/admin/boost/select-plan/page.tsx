"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { api } from "@/lib/api-client"

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

export default function SelectPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSelectedItem = async () => {
      const itemId = searchParams.get("itemId")
      if (!itemId) {
        setLoading(false)
        return
      }

      try {
        const myItems = await api.items.getMyItems()
        const item = (myItems || []).find((entry: any) => entry.id === itemId)
        setSelectedItem(item || null)
      } catch {
        setSelectedItem(null)
      } finally {
        setLoading(false)
      }
    }

    loadSelectedItem()
  }, [searchParams])

  const handleSelectPlan = (planId: string, planName: string, price: number) => {
    const itemId = searchParams.get("itemId")
    router.push(`/admin/boost/payment?itemId=${itemId}&planId=${planId}&planName=${planName}&price=${price}`)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  if (!selectedItem) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Select Boost Plan</h1>
        </div>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <p className="text-blue-900">Item not found. Please select an item from the Boost Advertisement page.</p>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => router.push("/admin/boost")}>
          Back to Boost
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Select Boost Plan</h1>
        <p className="text-muted-foreground">Choose a plan to boost your item visibility</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={selectedItem.imageUrl || selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {boostPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              plan.popular ? "border-[#2B70FF] border-2 relative" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B70FF]">Most Popular</Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">LKR {(plan.price * 280).toLocaleString()}</span>
                <span className="text-muted-foreground">/ {plan.duration}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#2B70FF]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-[#2B70FF] hover:bg-[#1A4FCC]"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={() => handleSelectPlan(plan.id, plan.name, plan.price)}
              >
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={() => router.push("/admin/boost")}>
        Back to Boost
      </Button>
    </div>
  )
}
