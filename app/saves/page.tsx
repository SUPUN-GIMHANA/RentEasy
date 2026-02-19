"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api-client"

interface SavedItem {
  id: string
  name: string
  imageUrl?: string
  price: number
  location?: string
  rating?: number
  available: boolean
}

export default function SavesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadSavedItems = async () => {
      try {
        setLoading(true)
        const response = await api.users.getSavedItems()
        setSavedItems(response || [])
      } catch (error) {
        console.error("Failed to load saved items:", error)
        setSavedItems([])
      } finally {
        setLoading(false)
      }
    }

    loadSavedItems()
  }, [isAuthenticated, router])

  const handleUnsave = async (itemId: string) => {
    try {
      await api.users.unsaveItem(itemId)
      setSavedItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Failed to remove saved item:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">My Saves</h1>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {savedItems.length} Items
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading saved items...</div>
          ) : savedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">You have no saved items yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white transition-all duration-300"
                      onClick={() => handleUnsave(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">
                          Currently Unavailable
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {item.location || "Unknown location"}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-[#2B70FF]">LKR {item.price.toLocaleString()}/day</p>
                      <Button
                        size="sm"
                        className="bg-[#2B70FF] hover:bg-[#1A4FCC] transition-all duration-300 hover:scale-105"
                        asChild
                        disabled={!item.available}
                      >
                        <Link href={`/items/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
