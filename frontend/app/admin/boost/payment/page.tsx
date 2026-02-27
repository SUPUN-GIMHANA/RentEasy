"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const [processing, setProcessing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const planName = searchParams.get("planName") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const itemId = searchParams.get("itemId") || ""

  useEffect(() => {
    const loadSelectedItem = async () => {
      if (!itemId) {
        setSelectedItem(null)
        return
      }

      try {
        const myItems = await api.items.getMyItems()
        const item = (myItems || []).find((entry: any) => entry.id === itemId)
        setSelectedItem(item || null)
      } catch {
        setSelectedItem(null)
      }
    }

    loadSelectedItem()
  }, [itemId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4)
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (selectedItem && planName) {
      const daysMap: { [key: string]: number } = {
        "Basic Boost": 3,
        "Premium Boost": 7,
        "Ultimate Boost": 14,
      }

      const newBoost = {
        id: selectedItem.id,
        name: selectedItem.name,
        plan: planName,
        daysLeft: daysMap[planName] || 7,
        image: selectedItem.imageUrl || selectedItem.image,
      }

      if (typeof window !== "undefined") {
        const boostedItemsKey = user?.id ? `boostedItems:${user.id}` : "boostedItems"
        const activeBoosts = JSON.parse(localStorage.getItem(boostedItemsKey) || "[]")
        localStorage.setItem(boostedItemsKey, JSON.stringify([...activeBoosts, newBoost]))
      }
    }

    setProcessing(false)
    router.push("/admin/boost?success=true")
  }

  const lkrPrice = (price * 280).toLocaleString()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
        <p className="text-muted-foreground">Secure payment for boost plan</p>
      </div>

      <Card className="bg-linear-to-r from-blue-50 to-cyan-50">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-semibold text-lg">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-semibold text-lg">LKR {lkrPrice}</p>
            </div>
          </div>
          {selectedItem && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Item</p>
              <p className="font-semibold">{selectedItem.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name *</Label>
              <Input
                id="card-name"
                name="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number *</Label>
              <Input
                id="card-number"
                name="cardNumber"
                placeholder="4532 1234 5678 9010"
                maxLength={19}
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input
                  id="expiry"
                  name="expiryDate"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-[#2B70FF] hover:bg-[#1A4FCC]"
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
