"use client"

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
import { Calendar } from "@/components/ui/calendar"

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

export default function AddAdvertisementPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    ownerPhoneNumber: "",
    description: "",
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<Date[]>([])
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
            if (newPreviews.length === newFiles.length) {
              setImagePreview((prev) => [...prev, ...newPreviews])
            }
          }
        }
        reader.readAsDataURL(file)
      })
      
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
      if (!formData.ownerPhoneNumber?.trim()) missingFields.push("Mobile Number")
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
        ownerPhoneNumber: formData.ownerPhoneNumber,
        description: formData.description,
        availableDates: availableDates.map((date) => {
          const yyyy = date.getFullYear()
          const mm = String(date.getMonth() + 1).padStart(2, "0")
          const dd = String(date.getDate()).padStart(2, "0")
          return `${yyyy}-${mm}-${dd}`
        }),
        available: true,
        imageFiles: uploadedImages,
      }

      // Call API to save item
      const response = await api.items.create(itemData)

      const createdItemId = response?.data?.id || response?.id
      if (createdItemId && typeof window !== "undefined") {
        const existingIds = JSON.parse(localStorage.getItem("myCreatedItemIds") || "[]")
        const nextIds = Array.from(new Set([...existingIds, createdItemId]))
        localStorage.setItem("myCreatedItemIds", JSON.stringify(nextIds))
      }
      
      // Success - redirect to items management page
      router.push("/admin/items")
    } catch (err) {
      console.error("Error creating advertisement:", err)
      setError(err instanceof Error ? err.message : "Failed to create advertisement. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const availableSubcategories = formData.category ? SUBCATEGORIES[formData.category] || [] : []

  return (
    <div className="space-y-6 max-w-4xl" suppressHydrationWarning>
      <div>
        <h1 className="text-3xl font-bold mb-2">Add Advertisement</h1>
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
          <CardContent className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="ownerPhoneNumber">Mobile Number *</Label>
                <Input
                  id="ownerPhoneNumber"
                  name="ownerPhoneNumber"
                  type="tel"
                  placeholder="0771234567"
                  value={formData.ownerPhoneNumber}
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

            <div className="space-y-2">
              <Label>Blocked Booking Days</Label>
              <Calendar
                mode="multiple"
                selected={availableDates}
                onSelect={(dates) => setAvailableDates(dates || [])}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                modifiersClassNames={{
                  selected: "bg-red-500 text-white rounded-full",
                }}
                className="rounded-md border"
              />
              <p className="text-sm text-muted-foreground">{availableDates.length} blocked dates selected</p>
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
