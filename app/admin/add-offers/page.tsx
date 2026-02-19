"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface OfferItem {
  id: string
  name: string
  category: string
  price: number
  imageUrl?: string
  ownerId?: string
}

export default function AddOffersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    validFrom: "",
    validTo: "",
  })
  const [allItems, setAllItems] = useState<OfferItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [itemsError, setItemsError] = useState("")

  useEffect(() => {
    loadApplicableItems()
  }, [user?.id])

  const normalizeItems = (rawItems: any[]): OfferItem[] => {
    return (rawItems || []).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price || 0),
      imageUrl: item.imageUrl || item.image,
      ownerId: item.ownerId,
    }))
  }

  const loadApplicableItems = async () => {
    try {
      setLoadingItems(true)
      setItemsError("")

      const myItemsResponse = await api.items.getMyItems().catch(() => [])
      let normalizedItems = normalizeItems(myItemsResponse || [])

      if (normalizedItems.length === 0) {
        const allItemsResponse = await api.items.getAll(0, 200).catch(() => ({ content: [] }))
        const allItemsData = normalizeItems(allItemsResponse?.content || allItemsResponse || [])

        if (user?.id) {
          normalizedItems = allItemsData.filter((item) => item.ownerId === user.id)
        }

        if (normalizedItems.length === 0 && typeof window !== "undefined") {
          const createdIds: string[] = JSON.parse(localStorage.getItem("myCreatedItemIds") || "[]")
          if (createdIds.length > 0) {
            const createdIdSet = new Set(createdIds)
            normalizedItems = allItemsData.filter((item) => createdIdSet.has(item.id))
          }
        }
      }

      setAllItems(normalizedItems)
    } catch (error) {
      console.error("Failed to load applicable items:", error)
      setAllItems([])
      setItemsError("Failed to load your items")
    } finally {
      setLoadingItems(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === allItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(allItems.map((item) => item.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedItems.length === 0) {
      alert("Please select at least one item for this offer")
      return
    }

    const newOffer = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      discountPercentage: parseInt(formData.discountPercentage),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      applicableItems: selectedItems.map(String),
      createdAt: new Date().toISOString(),
      status: "active",
    }

    if (typeof window !== "undefined") {
      const existingOffers = JSON.parse(localStorage.getItem("offers") || "[]")
      localStorage.setItem("offers", JSON.stringify([newOffer, ...existingOffers]))
    }

    router.push("/admin/items")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add Offers</h1>
        <p className="text-muted-foreground">Create promotional offers for your rental items</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Summer Special Discount"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the offer details..."
                rows={4}
                className="resize-none"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage *</Label>
                <Input
                  id="discount"
                  name="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="20"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-from">Valid From *</Label>
                <Input
                  id="valid-from"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-to">Valid To *</Label>
                <Input
                  id="valid-to"
                  name="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Select Applicable Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={allItems.length === 0}
            >
              {allItems.length > 0 && selectedItems.length === allItems.length ? "Deselect All" : "Select All"}
            </Button>
          </CardHeader>
          <CardContent>
            {loadingItems ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your items...</p>
              </div>
            ) : itemsError ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">{itemsError}</p>
                <Button type="button" variant="outline" onClick={loadApplicableItems}>
                  Retry
                </Button>
              </div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No items found for this account. Add items first in Manage Items.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {allItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={item.id}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={item.id}
                        className="text-base font-semibold cursor-pointer"
                      >
                        {item.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-medium">LKR {item.price.toLocaleString()}/day</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="bg-[#2B70FF] hover:bg-[#1A4FCC]">
            Create Offer
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
