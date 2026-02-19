"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api-client"

const SUBCATEGORIES: Record<string, string[]> = {
  vehicles: ["Cars", "Motorbikes", "Bicycles", "Trucks/Lorries"],
  properties: ["Apartments/Houses", "Office space/co-works", "Event Halls/Conference rooms", "Storage units"],
  electronics: ["Cameras", "Laptops/monitors/projectors", "Gaming consoles", "Party items"],
  clothing: ["Wedding dresses/suits", "Party costumes", "Theater Costumes"],
  tools: ["Power tools", "Construction equipment"],
  sports: ["Indoor courts", "Outdoor courts", "Swimming pools", "Badminton courts", "Grounds"],
  camping: ["Camping items", "Tour Guiders"],
  events: ["Electric items", "Event items"],
}

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    description: "",
    availableFrom: "",
    availableTo: "",
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        setError("")

        const myItems = await api.items.getMyItems()
        const item = (myItems || []).find((entry: any) => entry.id === itemId)

        if (!item) {
          setError("Item not found in your account")
          return
        }

        setFormData({
          name: item.name,
          category: item.category,
          subcategory: item.subcategory || "",
          price: String(item.price || ""),
          location: item.location || "",
          description: item.description || "",
          availableFrom: "",
          availableTo: "",
        })
        setUploadedImages(item.additionalImages?.length ? item.additionalImages : [item.imageUrl].filter(Boolean))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item")
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [itemId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "", // Reset subcategory when category changes
    }))
  }

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategory: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedItem = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      price: parseInt(formData.price),
      location: formData.location,
      description: formData.description,
      available: true,
      imageUrl: uploadedImages[0] || "/placeholder.svg",
      additionalImages: uploadedImages,
    }

    try {
      await api.items.update(itemId, updatedItem)
      router.push("/admin/items")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item")
    }
  }

  const availableSubcategories = formData.category ? SUBCATEGORIES[formData.category] || [] : []

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl" suppressHydrationWarning>
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Item</h1>
        <p className="text-muted-foreground">Update rental item details and images</p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-sm text-red-900">{error}</CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" suppressHydrationWarning>
            <div className="grid gap-4 sm:grid-cols-2" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  name="name"
                  placeholder="Professional Camera Kit"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory *</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={handleSubcategoryChange}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder={formData.category ? "Select subcategory" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Day (LKR) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Colombo"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your item in detail..."
                rows={4}
                className="resize-none"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Images *</Label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 w-full rounded-lg overflow-hidden bg-gray-100">
                        <Image src={image || "/placeholder.svg"} alt={`Preview ${index}`} fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="available-from">Available From</Label>
                <Input
                  id="available-from"
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available-to">Available To</Label>
                <Input
                  id="available-to"
                  name="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="bg-[#2B70FF] hover:bg-[#1A4FCC]">
            Save Changes
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
