"use client"

import { use, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { api } from "@/lib/api-client"
import type { Item } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, CalendarIcon, CheckCircle2, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadItem = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await api.items.getById(id)
        if (isMounted) {
          setItem(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load item")
          setItem(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadItem()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading item...</h1>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error ? "Unable to load item" : "Item Not Found"}
          </h1>
          {error && <p className="text-muted-foreground mb-6">{error}</p>}
          <Button asChild>
            <Link href="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/items/${item.id}`)
      return
    }
    if (selectedDate) {
      router.push(`/booking?itemId=${item.id}&date=${selectedDate.toISOString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {item.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#2B70FF]">${item.price}</span>
                <span className="text-xl text-muted-foreground">/day</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Availability Status */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Availability Status
                </h3>
              </CardHeader>
              <CardContent>
                {item.available ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Available for booking</span>
                  </div>
                ) : (
                  <div className="text-destructive font-medium">Currently Unavailable</div>
                )}
              </CardContent>
            </Card>

            {/* Date Selection */}
            {item.available && (
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select a Date
                  </h3>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const dateStr = date.toISOString().split("T")[0]
                      const availableDates = item.availableDates || []
                      return !availableDates.includes(dateStr)
                    }}
                    className="rounded-md border"
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    {(item.availableDates?.length ?? 0)} dates available for booking
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Booking Button */}
            {item.available && (
              <Button
                size="lg"
                className="w-full bg-[#FF8C00] hover:bg-[#CC7000] text-white"
                disabled={!selectedDate}
                onClick={handleBooking}
              >
                {isAuthenticated ? "Proceed to Booking" : "Login to Book"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
