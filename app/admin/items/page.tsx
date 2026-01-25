"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddItemModal from "@/components/AddItemModal" // Import AddItemModal component
import { handleAddItem, handleEditItem } from "@/utils/itemUtils"; // Declare the handleAddItem and handleEditItem variables

const initialItems = [
  {
    id: "1",
    name: "Professional Camera Kit",
    category: "Electronics",
    price: 5000,
    status: "active" as const,
    views: 567,
    image: "/professional-camera-kit.jpg",
  },
  {
    id: "2",
    name: "Luxury Camping Tent",
    category: "Camping",
    price: 3000,
    status: "active" as const,
    views: 245,
    image: "/luxury-camping-tent-setup.jpg",
  },
  {
    id: "3",
    name: "DJ Sound System",
    category: "Events",
    price: 12000,
    status: "inactive" as const,
    views: 189,
    image: "/professional-dj-sound-system.jpg",
  },
]

export default function ManageItemsPage() {
  const [items, setItems] = useState(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [items, searchQuery])



  const handleToggleStatus = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, status: item.status === "active" ? "inactive" : "active" }
          : item
      )
    )
  }

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
    setDeleteItemId(null)
    if (typeof window !== "undefined") {
      const existingItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      const updated = existingItems.filter((item: any) => item.id !== itemId)
      localStorage.setItem("rentalItems", JSON.stringify(updated))
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
        <Button variant="outline">Filter</Button>
      </div>

      {filteredItems.length === 0 && searchQuery && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">No items found</p>
              <p className="text-sm text-blue-700">Try adjusting your search query</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>LKR {item.price.toLocaleString()}/day</span>
                    <span>•</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === "active" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">Inactive</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleStatus(item.id)}
                    title={
                      item.status === "active"
                        ? "Deactivate item"
                        : "Activate item"
                    }
                  >
                    {item.status === "active" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteItemId !== null} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
