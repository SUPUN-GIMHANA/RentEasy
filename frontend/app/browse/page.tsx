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
import { useSearchParams } from "next/navigation"
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

const cityCoordinates: Record<string, { label: string; lat: number; lng: number }> = {
  colombo: { label: "Colombo", lat: 6.9271, lng: 79.8612 },
  kandy: { label: "Kandy", lat: 7.2906, lng: 80.6337 },
  galle: { label: "Galle", lat: 6.0535, lng: 80.221 },
  jaffna: { label: "Jaffna", lat: 9.6615, lng: 80.0255 },
  negombo: { label: "Negombo", lat: 7.2083, lng: 79.8358 },
  anuradhapura: { label: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  trincomalee: { label: "Trincomalee", lat: 8.5874, lng: 81.2152 },
  batticaloa: { label: "Batticaloa", lat: 7.717, lng: 81.7 },
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
  location?: string
  latitude?: number
  longitude?: number
  distanceKm?: number
  rating?: number
}

const normalizeLocationText = (value?: string) => (value || "").trim().toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ")

const calculateDistanceKm = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
  const earthRadiusKm = 6371
  const dLat = ((toLat - fromLat) * Math.PI) / 180
  const dLng = ((toLng - fromLng) * Math.PI) / 180
  const lat1 = (fromLat * Math.PI) / 180
  const lat2 = (toLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

const getLocationCoordinatesFromText = (locationText?: string): { lat: number; lng: number } | null => {
  const normalized = normalizeLocationText(locationText)
  if (!normalized) {
    return null
  }

  for (const [key, city] of Object.entries(cityCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { lat: city.lat, lng: city.lng }
    }
  }

  return null
}

export default function BrowsePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [selectedRadiusKm, setSelectedRadiusKm] = useState("10")
  const [sortBy, setSortBy] = useState("name")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLng, setSelectedLng] = useState<number | null>(null)
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set())
  const [savingItemId, setSavingItemId] = useState<string | null>(null)
  const [offers, setOffers] = useState<StoredOffer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<StoredOffer | null>(null)

  useEffect(() => {
    const categoryFromParams = searchParams.get("category")
    const subcategoryFromParams = searchParams.get("subcategory")
    const locationFromParams = searchParams.get("location") || ""
    const radiusFromParams = searchParams.get("radiusKm") || "10"
    const latFromParams = searchParams.get("lat")
    const lngFromParams = searchParams.get("lng")

    if (categoryFromParams && categories.includes(categoryFromParams)) {
      setSelectedCategory(categoryFromParams)
    }
    if (subcategoryFromParams) {
      setSelectedSubcategory(subcategoryFromParams)
    }
    setSelectedLocation(locationFromParams)
    setSelectedRadiusKm(radiusFromParams)

    if (latFromParams && lngFromParams) {
      const parsedLat = Number(latFromParams)
      const parsedLng = Number(lngFromParams)
      if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
        setSelectedLat(parsedLat)
        setSelectedLng(parsedLng)
        setHasSubmittedSearch(Boolean(locationFromParams))
      } else {
        setSelectedLat(null)
        setSelectedLng(null)
        setHasSubmittedSearch(false)
      }
    } else {
      setSelectedLat(null)
      setSelectedLng(null)
      setHasSubmittedSearch(false)
    }
  }, [searchParams])

  useEffect(() => {
    const geocodeLocationForNearby = async () => {
      if (!selectedLocation.trim() || selectedLat !== null || selectedLng !== null) {
        return
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(selectedLocation)}&format=json&limit=1`,
          {
            headers: {
              "Accept": "application/json",
            },
          }
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()
        const first = Array.isArray(data) ? data[0] : null
        if (!first) {
          return
        }

        const lat = Number(first.lat)
        const lng = Number(first.lon)
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          return
        }

        setSelectedLat(lat)
        setSelectedLng(lng)

        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set("lat", String(lat))
        nextParams.set("lng", String(lng))
        if (!nextParams.get("radiusKm")) {
          nextParams.set("radiusKm", "10")
        }
        router.replace(`/browse?${nextParams.toString()}`)
      } catch {
        // Ignore geocoding failures and keep text-only browsing
      }
    }

    geocodeLocationForNearby()
  }, [selectedLocation, selectedLat, selectedLng, router, searchParams])

  useEffect(() => {
    loadItems()
  }, [page, selectedCategory, selectedSubcategory, selectedLat, selectedLng, selectedRadiusKm, appliedSearchQuery, hasSubmittedSearch])

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
      let effectiveTotalPages = 0
      console.log("Loading items:", { selectedCategory, selectedSubcategory, page })

      const hasNearbyCoordinates = typeof selectedLat === "number" && typeof selectedLng === "number"
      const radiusKmNumber = Number(selectedRadiusKm)
      const safeRadius = Number.isNaN(radiusKmNumber) ? 10 : radiusKmNumber
      const normalizedKeyword = appliedSearchQuery.trim().toLowerCase()

      if (hasNearbyCoordinates && selectedLocation && !hasSubmittedSearch) {
        setItems([])
        setTotalPages(0)
        return
      }
      
      if (hasNearbyCoordinates && selectedCategory === "all") {
        let nearbyResponse: { content: Item[]; totalPages: number } = { content: [], totalPages: 0 }
        let locationResponse: { content: Item[]; totalPages: number } = { content: [], totalPages: 0 }

        try {
          const nearbyApiResponse = await api.items.getNearby(selectedLat as number, selectedLng as number, safeRadius, page, 12)
          nearbyResponse = {
            content: nearbyApiResponse.content || [],
            totalPages: nearbyApiResponse.totalPages || 0,
          }
        } catch {
          nearbyResponse = { content: [], totalPages: 0 }
        }

        if (selectedLocation.trim()) {
          try {
            const locationApiResponse = await api.items.searchByLocation(selectedLocation.trim(), page, 12)
            locationResponse = {
              content: locationApiResponse.content || [],
              totalPages: locationApiResponse.totalPages || 0,
            }
          } catch {
            locationResponse = { content: [], totalPages: 0 }
          }
        }

        if (nearbyResponse.content.length === 0 && locationResponse.content.length === 0) {
          response = {
            content: [],
            totalPages: 0,
          }
          effectiveTotalPages = 0
          console.log("API Response:", response)
          setItems([])
          setTotalPages(0)
          return
        }

        const combinedMap = new Map<string, Item>()
        ;(nearbyResponse.content || []).forEach((item: Item) => combinedMap.set(item.id, item))
        ;(locationResponse.content || []).forEach((item: Item) => {
          if (!combinedMap.has(item.id)) {
            combinedMap.set(item.id, item)
          }
        })

        const normalizedSelectedLocation = normalizeLocationText(selectedLocation)
        const mergedItems = Array.from(combinedMap.values())
          .map((item) => {
            const itemLat = item.latitude
            const itemLng = item.longitude

            if (typeof itemLat === "number" && typeof itemLng === "number") {
              const distanceKm = calculateDistanceKm(selectedLat as number, selectedLng as number, itemLat, itemLng)
              return { ...item, distanceKm }
            }

            const coordsFromText = getLocationCoordinatesFromText(item.location)
            if (coordsFromText) {
              const distanceKm = calculateDistanceKm(
                selectedLat as number,
                selectedLng as number,
                coordsFromText.lat,
                coordsFromText.lng
              )
              return { ...item, distanceKm }
            }

            return item
          })
          .filter((item) => {
            if (typeof item.distanceKm === "number") {
              return item.distanceKm <= safeRadius
            }

            const itemLocation = normalizeLocationText(item.location)
            if (!itemLocation || !normalizedSelectedLocation) {
              return false
            }

            return itemLocation.includes(normalizedSelectedLocation) || normalizedSelectedLocation.includes(itemLocation)
          })
          .sort((a, b) => {
            const distanceA = typeof a.distanceKm === "number" ? a.distanceKm : Number.MAX_SAFE_INTEGER
            const distanceB = typeof b.distanceKm === "number" ? b.distanceKm : Number.MAX_SAFE_INTEGER
            return distanceA - distanceB
          })

        response = {
          ...nearbyResponse,
          content: mergedItems,
          totalPages: Math.max(nearbyResponse.totalPages || 0, locationResponse.totalPages || 0, mergedItems.length > 0 ? 1 : 0),
        }
        effectiveTotalPages = response.totalPages || 0
      } else if (selectedCategory === "all" && normalizedKeyword) {
        response = await api.items.search(appliedSearchQuery, page, 12)
        effectiveTotalPages = response.totalPages || 0
      } else if (selectedCategory === "all") {
        response = await api.items.getAll(page, 12)
        effectiveTotalPages = response.totalPages || 0
      } else if (selectedSubcategory === "all") {
        console.log("Fetching by category only:", selectedCategory)
        response = await api.items.getByCategory(selectedCategory, page, 12)
        effectiveTotalPages = response.totalPages || 0
      } else {
        console.log("Fetching by category and subcategory:", selectedCategory, selectedSubcategory)
        response = await api.items.getByCategory(selectedCategory, page, 12, selectedSubcategory)
        effectiveTotalPages = response.totalPages || 0
      }
      
      console.log("API Response:", response)
      let nextItems: Item[] = response.content || []

      if (normalizedKeyword && (hasNearbyCoordinates || selectedCategory !== "all")) {
        nextItems = nextItems.filter((item) => {
          const searchableText = [
            item.name,
            item.description,
            item.category,
            item.subcategory || "",
            item.location || "",
          ]
            .join(" ")
            .toLowerCase()

          return searchableText.includes(normalizedKeyword)
        })
      }

      setItems(nextItems)
      setTotalPages(hasNearbyCoordinates && normalizedKeyword ? 1 : effectiveTotalPages)
    } catch (error: any) {
      console.error("Failed to load items:", error)
      setError(error.message || "Failed to load items")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) {
      setHasSubmittedSearch(false)
      setAppliedSearchQuery("")
      loadItems()
      return
    }

    try {
      setPage(0)
      setHasSubmittedSearch(true)
      const normalizedQuery = trimmedQuery.toLowerCase()
      const cleanedLocationQuery = normalizedQuery
        .replace(/\b(near|around|in|at)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim()

      let resolvedLocation: { name: string; lat: number; lng: number } | null = null
      let keywordOnlyQuery = trimmedQuery

      for (const [cityKey, cityValue] of Object.entries(cityCoordinates)) {
        if (normalizedQuery.includes(cityKey) || (cleanedLocationQuery && cleanedLocationQuery.includes(cityKey))) {
          resolvedLocation = { name: cityValue.label, lat: cityValue.lat, lng: cityValue.lng }
          keywordOnlyQuery = keywordOnlyQuery.replace(new RegExp(`\\b${cityValue.label}\\b`, "ig"), " ")
          break
        }
      }

      if (!resolvedLocation && cleanedLocationQuery) {
        try {
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanedLocationQuery)}&format=json&limit=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          )

          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            const first = Array.isArray(geocodeData) ? geocodeData[0] : null
            if (first) {
              const lat = Number(first.lat)
              const lng = Number(first.lon)
              if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                resolvedLocation = {
                  name: cleanedLocationQuery,
                  lat,
                  lng,
                }
                keywordOnlyQuery = ""
              }
            }
          }
        } catch {
          // Fallback to text search if geocoding fails
        }
      }

      const normalizedKeywordOnly = keywordOnlyQuery
        .replace(/\b(items?|rentals?|search|show|me|find)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim()

      if (resolvedLocation) {
        setError("")
        setSelectedLocation(resolvedLocation.name)
        setSelectedLat(resolvedLocation.lat)
        setSelectedLng(resolvedLocation.lng)
        setSelectedRadiusKm("10")
        setAppliedSearchQuery(normalizedKeywordOnly)

        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set("location", resolvedLocation.name)
        nextParams.set("lat", String(resolvedLocation.lat))
        nextParams.set("lng", String(resolvedLocation.lng))
        nextParams.set("radiusKm", "10")
        router.replace(`/browse?${nextParams.toString()}`)
        return
      }

      setAppliedSearchQuery(trimmedQuery)

      setLoading(true)
      setError("")
      const response = await api.items.search(trimmedQuery, page, 12)
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
    console.log(`Toggling save for item ${itemId}, currently saved:`, isSaved)

    try {
      if (isSaved) {
        console.log(`Unsaving item ${itemId}`)
        await api.users.unsaveItem(itemId)
        setSavedItemIds((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      } else {
        console.log(`Saving item ${itemId}`)
        await api.users.saveItem(itemId)
        setSavedItemIds((prev) => new Set([...prev, itemId]))
      }
      console.log(`Successfully toggled save for item ${itemId}`)
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

            {selectedLat !== null && selectedLng !== null && (
              <Select
                value={selectedRadiusKm}
                onValueChange={(value) => {
                  setSelectedRadiusKm(value)
                  const nextParams = new URLSearchParams(searchParams.toString())
                  nextParams.set("radiusKm", value)
                  router.replace(`/browse?${nextParams.toString()}`)
                }}
              >
                <SelectTrigger className="w-full md:w-45">
                  <SelectValue placeholder="Radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setAppliedSearchQuery("")
                setHasSubmittedSearch(false)
                setSelectedCategory("all")
                setSelectedSubcategory("all")
                setSortBy("name")
                setSelectedRadiusKm("10")
                setSelectedLocation("")
                setSelectedLat(null)
                setSelectedLng(null)
                router.replace("/browse")
              }}
            >
              Reset
            </Button>
          </div>

          {selectedLocation && (
            <p className="text-sm text-muted-foreground">
              Searching near: {selectedLocation}
              {selectedLat !== null && selectedLng !== null ? ` (${selectedRadiusKm} km radius)` : ""}
            </p>
          )}
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
                      {typeof item.distanceKm === "number" && (
                        <p className="text-xs text-muted-foreground mb-2">{item.distanceKm.toFixed(2)} km away</p>
                      )}
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
              {selectedLat !== null && selectedLng !== null && selectedLocation && !hasSubmittedSearch
                ? "Search for an item to see nearby results in this location."
                : searchQuery
                ? "No items found matching your search."
                : "No items available."}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => { 
                  setSearchQuery("")
                  setAppliedSearchQuery("")
                  setHasSubmittedSearch(false)
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
