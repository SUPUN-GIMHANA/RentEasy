"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function AddItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    description: "",
    minimumRentalPeriod: "",
    maximumRentalPeriod: "",
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const newFiles = Array.from(files)
      const newPreviews: string[] = []
      
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string)
            // Update preview when all files are read
            if (newPreviews.length === newFiles.length) {
              setImagePreview((prev) => [...prev, ...newPreviews])
            }
          }
        }
        reader.readAsDataURL(file)
      })
      
      // Store actual File objects
      setUploadedImages((prev) => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate required fields with specific error messages
      const missingFields: string[] = []
      
      if (!formData.name?.trim()) missingFields.push("Item Name")
      if (!formData.category?.trim()) missingFields.push("Category")
      if (!formData.subcategory?.trim()) missingFields.push("Subcategory")
      if (!formData.price?.trim()) missingFields.push("Price")
      if (!formData.location?.trim()) missingFields.push("Location")
      if (!formData.description?.trim()) missingFields.push("Description")
      
      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(", ")}`)
        setIsLoading(false)
        return
      }

      if (uploadedImages.length === 0) {
        setError("Please upload at least one image")
        setIsLoading(false)
        return
      }

      // Create item data with File objects
      const itemData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        location: formData.location,
        description: formData.description,
        minimumRentalPeriod: formData.minimumRentalPeriod ? parseInt(formData.minimumRentalPeriod) : undefined,
        maximumRentalPeriod: formData.maximumRentalPeriod ? parseInt(formData.maximumRentalPeriod) : undefined,
        available: true,
        imageFiles: uploadedImages, // Pass actual File objects
      }

      // Call API to save item
      const response = await api.items.create(itemData)
      
      // Success - redirect to items management page
      router.push("/admin/items")
    } catch (err) {
      console.error("Error creating item:", err)
      setError(err instanceof Error ? err.message : "Failed to create item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const availableSubcategories = formData.category ? SUBCATEGORIES[formData.category] || [] : []

  return (
    <div className="space-y-6 max-w-4xl" suppressHydrationWarning>
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Item</h1>
        <p className="text-muted-foreground">Create a new rental listing with images and details</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              
              {/* Upload button/area */}
              <label
                htmlFor="file-input"
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted/70 block"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
              </label>

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {imagePreview.map((image, index) => (
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
            <CardTitle>Rental Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minimum-rental">Minimum Rental Period (days)</Label>
                <Input
                  id="minimum-rental"
                  name="minimumRentalPeriod"
                  type="number"
                  placeholder="1"
                  value={formData.minimumRentalPeriod}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximum-rental">Maximum Rental Period (days)</Label>
                <Input
                  id="maximum-rental"
                  name="maximumRentalPeriod"
                  type="number"
                  placeholder="30"
                  value={formData.maximumRentalPeriod}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-[#2B70FF] hover:bg-[#1A4FCC]"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
