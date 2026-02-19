"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Search, Trash2, AlertCircle, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getActiveOfferForItem, getStoredOffers, type StoredOffer } from "@/lib/offer-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Item {
  id: string
  name: string
  description?: string
  category: string
  subcategory?: string
  price: number
  status: "ACTIVE" | "INACTIVE"
  ownerId?: string
  views?: number
  imageUrl?: string
  additionalImages?: string[]
  available?: boolean
  availableDates?: string[]
  location?: string
  ownerPhoneNumber?: string
  minimumRentalPeriod?: number
  maximumRentalPeriod?: number
}

export default function ManageItemsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bookingDatesItem, setBookingDatesItem] = useState<Item | null>(null)
  const [selectedBookingDates, setSelectedBookingDates] = useState<Date[]>([])
  const [isLoadingBookingDates, setIsLoadingBookingDates] = useState(false)
  const [isSavingBookingDates, setIsSavingBookingDates] = useState(false)
  const [offers, setOffers] = useState<StoredOffer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<StoredOffer | null>(null)

  useEffect(() => {
    loadItems()
    setOffers(getStoredOffers())
  }, [user?.id])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError("")

      const normalizeItems = (rawItems: any[]): Item[] => {
        return (rawItems || []).map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price || 0),
          status: item.status || (item.available ? "ACTIVE" : "INACTIVE"),
          ownerId: item.ownerId,
          views: item.views,
          imageUrl: item.imageUrl,
          description: item.description,
          subcategory: item.subcategory,
          additionalImages: item.additionalImages,
          available: item.available,
          availableDates: item.availableDates,
          location: item.location,
          ownerPhoneNumber: item.ownerPhoneNumber,
          minimumRentalPeriod: item.minimumRentalPeriod,
          maximumRentalPeriod: item.maximumRentalPeriod,
        }))
      }

      const myItemsResponse = await api.items.getMyItems().catch(() => [])
      let normalizedItems = normalizeItems(myItemsResponse || [])

      if (normalizedItems.length === 0) {
        const allItemsResponse = await api.items.getAll(0, 200).catch(() => ({ content: [] }))
        const allItems = normalizeItems(allItemsResponse?.content || allItemsResponse || [])

        if (user?.id) {
          normalizedItems = allItems.filter((item) => item.ownerId === user.id)
        }

        if (normalizedItems.length === 0 && typeof window !== "undefined") {
          const createdItemsKey = user?.id ? `myCreatedItemIds:${user.id}` : "myCreatedItemIds"
          const createdIds: string[] = JSON.parse(localStorage.getItem(createdItemsKey) || "[]")
          if (createdIds.length > 0) {
            const createdIdSet = new Set(createdIds)
            normalizedItems = allItems.filter((item) => createdIdSet.has(item.id))
          }
        }
      }

      setItems(normalizedItems)
    } catch (err) {
      console.error("Failed to load items:", err)
      setError("Failed to load items")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [items, searchQuery])

  const offerByItemId = useMemo(() => {
    const nextMap = new Map<string, StoredOffer>()
    for (const item of filteredItems) {
      const activeOffer = getActiveOfferForItem(item.id, offers)
      if (activeOffer) {
        nextMap.set(item.id, activeOffer)
      }
    }
    return nextMap
  }, [filteredItems, offers])

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

  const handleDeleteItem = async (itemId: string) => {
    setIsDeleting(true)
    try {
      await api.items.delete(itemId)
      if (typeof window !== "undefined") {
        const createdItemsKey = user?.id ? `myCreatedItemIds:${user.id}` : "myCreatedItemIds"
        const createdIds: string[] = JSON.parse(localStorage.getItem(createdItemsKey) || "[]")
        localStorage.setItem(createdItemsKey, JSON.stringify(createdIds.filter((id) => id !== itemId)))
      }
      setItems(items.filter((item) => item.id !== itemId))
      setDeleteItemId(null)
    } catch (err) {
      console.error("Failed to delete item:", err)
      setError("Failed to delete item")
    } finally {
      setIsDeleting(false)
    }
  }

  const toDateFromIso = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, (month || 1) - 1, day || 1)
  }

  const toIsoDate = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const handleOpenBookingDates = async (itemId: string) => {
    setIsLoadingBookingDates(true)
    setError("")
    try {
      const itemDetails = await api.items.getById(itemId)
      setBookingDatesItem(itemDetails)
      setSelectedBookingDates((itemDetails.availableDates || []).map((date: string) => toDateFromIso(date)))
    } catch (err) {
      console.error("Failed to load item booking dates:", err)
      setError("Failed to load booking dates")
      setBookingDatesItem(null)
      setSelectedBookingDates([])
    } finally {
      setIsLoadingBookingDates(false)
    }
  }

  const handleSaveBookingDates = async () => {
    if (!bookingDatesItem) {
      return
    }

    setIsSavingBookingDates(true)
    setError("")

    try {
      const nextDates = selectedBookingDates.map(toIsoDate)
      await api.items.updateBookingDates(bookingDatesItem.id, nextDates, bookingDatesItem)

      setItems((prev) =>
        prev.map((item) =>
          item.id === bookingDatesItem.id
            ? { ...item, availableDates: nextDates }
            : item
        )
      )

      setBookingDatesItem(null)
      setSelectedBookingDates([])
    } catch (err) {
      console.error("Failed to save booking dates:", err)
      setError("Failed to save booking dates")
    } finally {
      setIsSavingBookingDates(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Items</h1>
          <p className="text-muted-foreground">View and manage all your rental items</p>
        </div>
        <Link href="/admin/add-item">
          <Button className="bg-[#2B70FF] hover:bg-[#1A4FCC]">
            Add New Item
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={loadItems}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={loadItems}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-6 w-6 animate-spin text-[#2B70FF]" />
          <span className="ml-2 text-muted-foreground">Loading items...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                {searchQuery ? "No items found" : "No items yet"}
              </p>
              <p className="text-sm text-blue-700">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first rental item to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {offerByItemId.get(item.id) && (
                        <button type="button" onClick={() => setSelectedOffer(offerByItemId.get(item.id) || null)}>
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Offer</Badge>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>LKR {item.price.toLocaleString()}/day</span>
                      {item.views && (
                        <>
                          <span>•</span>
                          <span>{item.views} views</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        item.status === "ACTIVE"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {item.status === "ACTIVE" ? "Active" : "Inactive"}
                    </Badge>
                    <Link href={`/admin/edit-item/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenBookingDates(item.id)}
                      disabled={isLoadingBookingDates}
                    >
                      {isLoadingBookingDates ? "Loading..." : "Block Days"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive bg-transparent"
                      onClick={() => setDeleteItemId(item.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteItemId !== null} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={bookingDatesItem !== null} onOpenChange={(open) => !open && setBookingDatesItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Blocked Booking Days</DialogTitle>
            <DialogDescription>
              Select dates that users cannot book for this item. These marked days will appear as red circles.
            </DialogDescription>
          </DialogHeader>

          {bookingDatesItem && (
            <div className="space-y-4">
              <p className="text-sm font-medium">{bookingDatesItem.name}</p>
              <Calendar
                mode="multiple"
                selected={selectedBookingDates}
                onSelect={(dates) => setSelectedBookingDates(dates || [])}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                modifiersClassNames={{
                  selected: "bg-red-500 text-white rounded-full",
                }}
                className="rounded-md border"
              />
              <p className="text-sm text-muted-foreground">{selectedBookingDates.length} blocked dates selected</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDatesItem(null)} disabled={isSavingBookingDates}>
              Cancel
            </Button>
            <Button onClick={handleSaveBookingDates} disabled={isSavingBookingDates || !bookingDatesItem}>
              {isSavingBookingDates ? "Saving..." : "Save Blocked Days"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  )
}
