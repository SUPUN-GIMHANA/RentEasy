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
import { Search, Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getActiveOfferForItem, getStoredOffers, type StoredOffer } from "@/lib/offer-utils"

const categories = ["vehicles", "properties", "electronics", "clothing", "tools", "sports", "camping", "events"]

const subcategories: Record<string, string[]> = {
  vehicles: ["Cars", "Motorbikes", "Bicycles", "Trucks/Lorries"],
  properties: ["Apartments/Houses", "Office space/co-works", "Event Halls/Conference rooms", "Storage units"],
  electronics: ["Cameras", "Laptops/monitors/projectors", "Gaming consoles", "Party items"],
  clothing: ["Wedding dresses/suits", "Party costumes", "Theater Costumes"],
  tools: ["Power tools", "Construction equipment"],
  sports: ["Indoor courts", "Outdoor courts", "Swimming pools", "Badminton courts", "Grounds"],
  camping: ["Camping items", "Tour Guiders"],
  events: ["Electric items", "Event items"],
}

interface Item {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  imageUrl: string
  available: boolean
  rating?: number
}

export default function BrowsePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set())
  const [savingItemId, setSavingItemId] = useState<string | null>(null)
  const [offers, setOffers] = useState<StoredOffer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<StoredOffer | null>(null)

  useEffect(() => {
    loadItems()
  }, [page, selectedCategory, selectedSubcategory])

  useEffect(() => {
    const loadSavedItems = async () => {
      if (!isAuthenticated) {
        setSavedItemIds(new Set())
        return
      }

      try {
        const savedItems = await api.users.getSavedItems()
        setSavedItemIds(new Set((savedItems || []).map((item: any) => item.id)))
      } catch {
        setSavedItemIds(new Set())
      }
    }

    loadSavedItems()
  }, [isAuthenticated])

  useEffect(() => {
    // Reset subcategory and page when category changes
    setSelectedSubcategory("all")
    setPage(0)
  }, [selectedCategory])

  useEffect(() => {
    setOffers(getStoredOffers())
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError("")
      
      let response
      console.log("Loading items:", { selectedCategory, selectedSubcategory, page })
      
      if (selectedCategory === "all") {
        response = await api.items.getAll(page, 12)
      } else if (selectedSubcategory === "all") {
        console.log("Fetching by category only:", selectedCategory)
        response = await api.items.getByCategory(selectedCategory, page, 12)
      } else {
        console.log("Fetching by category and subcategory:", selectedCategory, selectedSubcategory)
        response = await api.items.getByCategory(selectedCategory, page, 12, selectedSubcategory)
      }
      
      console.log("API Response:", response)
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

    // Apply subcategory filter
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((item) => item.subcategory === selectedSubcategory)
    }

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
  }, [items, selectedSubcategory, sortBy])

  const availableSubcategories = selectedCategory !== "all" ? subcategories[selectedCategory] || [] : []

  const offerByItemId = useMemo(() => {
    const nextMap = new Map<string, StoredOffer>()
    for (const item of filteredAndSortedItems) {
      const activeOffer = getActiveOfferForItem(item.id, offers)
      if (activeOffer) {
        nextMap.set(item.id, activeOffer)
      }
    }
    return nextMap
  }, [filteredAndSortedItems, offers])

  const formatOfferDate = (dateString: string) => {
    if (!dateString) {
      return "-"
    }

    const parsedDate = new Date(dateString)
    if (Number.isNaN(parsedDate.getTime())) {
      return dateString
    }

    return parsedDate.toLocaleDateString()
  }

  const handleToggleSaveItem = async (itemId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/browse`)
      return
    }

    setSavingItemId(itemId)
    const isSaved = savedItemIds.has(itemId)

    try {
      if (isSaved) {
        await api.users.unsaveItem(itemId)
        setSavedItemIds((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      } else {
        const itemData = items.find((entry) => entry.id === itemId)
        await api.users.saveItem(itemId, itemData)
        setSavedItemIds((prev) => new Set([...prev, itemId]))
      }
    } catch (error) {
      console.error("Failed to update saved item:", error)
    } finally {
      setSavingItemId(null)
    }
  }

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

          <div className="flex flex-wrap gap-4" suppressHydrationWarning>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-45">
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

            {availableSubcategories.length > 0 && (
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="w-full md:w-50">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {availableSubcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-45">
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
                setSelectedSubcategory("all")
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
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleToggleSaveItem(item.id)
                          }}
                          disabled={savingItemId === item.id}
                          className="absolute top-2 left-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors disabled:opacity-60"
                        >
                          <Heart
                            className={`h-4 w-4 ${savedItemIds.has(item.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                          />
                        </button>
                        {offerByItemId.get(item.id) && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedOffer(offerByItemId.get(item.id) || null)
                            }}
                            className="absolute top-2 right-2"
                          >
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Offer</Badge>
                          </button>
                        )}
                        {!item.available && (
                          <Badge className="absolute top-11 right-2 bg-destructive">Unavailable</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.subcategory && (
                            <Badge variant="secondary" className="text-xs">{item.subcategory}</Badge>
                          )}
                        </div>
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

        <Dialog open={selectedOffer !== null} onOpenChange={() => setSelectedOffer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedOffer?.title || "Offer Details"}</DialogTitle>
              <DialogDescription>Special discount details for this item</DialogDescription>
            </DialogHeader>
            {selectedOffer && (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-semibold">{selectedOffer.discountPercentage}% OFF</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p>{selectedOffer.description || "No additional description"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground">Valid From</p>
                    <p>{formatOfferDate(selectedOffer.validFrom)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid To</p>
                    <p>{formatOfferDate(selectedOffer.validTo)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
