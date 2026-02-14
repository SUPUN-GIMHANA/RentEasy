"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import { Search, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = ["vehicles", "properties", "electronics", "clothing", "tools", "sports", "camping", "events"]

interface Item {
  id: string
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  available: boolean
  rating?: number
}

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    loadItems()
  }, [page, selectedCategory])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError("")
      
      let response
      if (selectedCategory === "all") {
        response = await api.items.getAll(page, 12)
      } else {
        response = await api.items.getByCategory(selectedCategory, page, 12)
      }
      
      setItems(response.content || [])
      setTotalPages(response.totalPages || 0)
    } catch (error: any) {
      console.error("Failed to load items:", error)
      setError(error.message || "Failed to load items")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadItems()
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await api.items.search(searchQuery, page, 12)
      setItems(response.content || [])
      setTotalPages(response.totalPages || 0)
    } catch (error: any) {
      console.error("Search failed:", error)
      setError(error.message || "Search failed")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items]

    // Apply price filter
    filtered = filtered.filter((item) => {
      let matchesPrice = true
      if (priceRange === "0-50") matchesPrice = item.price <= 50
      else if (priceRange === "51-100") matchesPrice = item.price > 50 && item.price <= 100
      else if (priceRange === "101-200") matchesPrice = item.price > 100 && item.price <= 200
      else if (priceRange === "201+") matchesPrice = item.price > 200
      return matchesPrice
    })

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating-high") return (b.rating || 0) - (a.rating || 0)
      if (sortBy === "rating-low") return (a.rating || 0) - (b.rating || 0)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

    return filtered
  }, [items, priceRange, sortBy])

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

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[180px]">
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                <SelectItem value="rating-low">Rating: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange("all")
                setSortBy("name")
                loadItems()
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredAndSortedItems.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'items'} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedItems.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="relative h-64">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        {!item.available && (
                          <Badge className="absolute top-2 right-2 bg-destructive">Unavailable</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl font-bold">${item.price}</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No items found matching your search." : "No items available."}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => { 
                  setSearchQuery("")
                  loadItems()
                }} 
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
