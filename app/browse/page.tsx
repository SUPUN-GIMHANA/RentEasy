"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockItems } from "@/lib/mock-data"
import { Search, SlidersHorizontal, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = ["Vehicles", "Properties", "Electronics", "Clothing", "Tools", "Sports", "Camping", "Events"]

const categorySubcategories: Record<string, string[]> = {
  Vehicles: ["Cars", "Motorcycles", "Bicycles", "Trucks"],
  Properties: ["Apartments", "Houses", "Villas", "Offices"],
  Electronics: ["Cameras", "Gaming", "Audio", "Computers"],
  Clothing: ["Formal", "Casual", "Sports", "Accessories"],
  Tools: ["Power Tools", "Hand Tools", "Gardening", "Construction"],
  Sports: ["Equipment", "Bikes", "Water Sports", "Winter Sports"],
  Camping: ["Tents", "Sleeping Bags", "Cooking", "Navigation"],
  Events: ["Decorations", "Sound Systems", "Lighting", "Tables & Chairs"],
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredAndSortedItems = useMemo(() => {
    const filtered = mockItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesSubcategory = selectedSubcategory === "all" || true // Placeholder for subcategory matching

      let matchesPrice = true
      if (priceRange === "0-50") matchesPrice = item.price <= 50
      else if (priceRange === "51-100") matchesPrice = item.price > 50 && item.price <= 100
      else if (priceRange === "101-200") matchesPrice = item.price > 100 && item.price <= 200
      else if (priceRange === "201+") matchesPrice = item.price > 200

      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice
    })

    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating-high") return (b.rating || 0) - (a.rating || 0)
      if (sortBy === "rating-low") return (a.rating || 0) - (b.rating || 0)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedSubcategory, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground text-lg">
            Discover our collection of premium rental items across all categories
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:hidden bg-transparent">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setSelectedSubcategory("all")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory !== "all" && (
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {categorySubcategories[selectedCategory]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="51-100">$51 - $100</SelectItem>
                <SelectItem value="101-200">$101 - $200</SelectItem>
                <SelectItem value="201+">$201+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Newest</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedSubcategory("all")
                setPriceRange("all")
                setSortBy("name")
              }}
              className="bg-transparent"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedItems.length} of {mockItems.length} items
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative aspect-video bg-muted">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-base">
                        Unavailable
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-[#2B70FF]">${item.price}</span>
                  <span className="text-sm text-muted-foreground">/day</span>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-[#2B70FF] hover:bg-[#1A4FCC]" disabled={!item.available}>
                  <Link href={`/items/${item.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No items found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedSubcategory("all")
                setPriceRange("all")
                setSortBy("name")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
