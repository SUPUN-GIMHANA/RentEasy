"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

const CATEGORIES = [
  "Vehicles",
  "Properties",
  "Electronics",
  "Clothing",
  "Tools",
  "Sports",
  "Camping",
  "Events",
]

const SUBCATEGORIES: Record<string, string[]> = {
  Vehicles: ["Cars", "Motorbikes", "Bicycles", "Trucks/Lorries"],
  Properties: ["Apartments/Houses", "Office space/co-works", "Event Halls/Conference rooms", "Storage units"],
  Electronics: ["Cameras", "Laptops/monitors/projectors", "Gaming consoles", "Party items"],
  Clothing: ["Wedding dresses/suits", "Party costumes", "Theater Costumes"],
  Tools: ["Power tools", "Construction equipment"],
  Sports: ["Indoor courts", "Outdoor courts", "Swimming pools", "Badminton courts", "Grounds"],
  Camping: ["Camping items", "Tour Guiders"],
  Events: ["Electric items", "Event items"],
}

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: any) => void
}

export function AddItemModal({ open, onOpenChange, onAddItem }: AddItemModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("/placeholder.svg")

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setSubcategory("") // Reset subcategory when category changes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !category || !price) {
      alert("Please fill in all fields")
      return
    }

    const newItem = {
      id: Math.random().toString(36).substring(7),
      name,
      description,
      category,
      subcategory,
      price: parseFloat(price),
      image,
      status: "active",
      views: 0,
      createdAt: new Date().toISOString(),
    }

    onAddItem(newItem)
    setName("")
    setDescription("")
    setCategory("")
    setSubcategory("")
    setPrice("")
    setImage("/placeholder.svg")
    onOpenChange(false)
  }

  const availableSubcategories = category ? SUBCATEGORIES[category] || [] : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Create a new rental listing</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
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
          )}

          <div className="space-y-2">
            <Label htmlFor="price">Daily Rental Price (LKR)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#2B70FF] hover:bg-[#1A4FCC]">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
