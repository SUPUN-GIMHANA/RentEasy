"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye, EyeOff, AlertCircle, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api-client"
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
  category: string
  price: number
  status: "ACTIVE" | "INACTIVE"
  views?: number
  imageUrl?: string
  description?: string
}

export default function ManageItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.items.getMyItems()
      setItems(response || [])
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

  const handleDeleteItem = async (itemId: string) => {
    setIsDeleting(true)
    try {
      await api.items.delete(itemId)
      setItems(items.filter((item) => item.id !== itemId))
      setDeleteItemId(null)
    } catch (err) {
      console.error("Failed to delete item:", err)
      setError("Failed to delete item")
    } finally {
      setIsDeleting(false)
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
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
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
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
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
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive bg-transparent"
                      onClick={() => setDeleteItemId(item.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
