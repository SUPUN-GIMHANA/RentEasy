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
import { ArrowLeft, CalendarIcon, CheckCircle2, Copy, MessageCircle, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [item, setItem] = useState<Item | null>(null)
  const [bookedDateSet, setBookedDateSet] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [copiedNumber, setCopiedNumber] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadItem = async () => {
      try {
        setLoading(true)
        setError("")
        const [data, bookings] = await Promise.all([
          api.items.getById(id),
          api.bookings.getItemBookings(id).catch(() => []),
        ])

        const nextBookedDates = new Set<string>()
        for (const booking of bookings || []) {
          const startDate = new Date(booking.startDate)
          const endDate = new Date(booking.endDate)
          const currentDate = new Date(startDate)

          while (currentDate <= endDate) {
            const yyyy = currentDate.getFullYear()
            const mm = String(currentDate.getMonth() + 1).padStart(2, "0")
            const dd = String(currentDate.getDate()).padStart(2, "0")
            nextBookedDates.add(`${yyyy}-${mm}-${dd}`)
            currentDate.setDate(currentDate.getDate() + 1)
          }
        }

        if (isMounted) {
          setItem(data)
          setBookedDateSet(nextBookedDates)
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

  const normalizedPhone = (item.ownerPhoneNumber || "").replace(/[^\d+]/g, "")
  const whatsappPhone = (() => {
    const digitsOnly = normalizedPhone.replace(/\D/g, "")
    if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
      return `94${digitsOnly.slice(1)}`
    }
    return digitsOnly
  })()
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in booking your item: ${item.name}`)

  const handleCopyNumber = async () => {
    if (!normalizedPhone) {
      return
    }

    try {
      await navigator.clipboard.writeText(normalizedPhone)
      setCopiedNumber(true)
      setTimeout(() => setCopiedNumber(false), 2000)
    } catch {
      setCopiedNumber(false)
    }
  }

  const handleOpenWhatsApp = () => {
    if (!whatsappPhone) {
      return
    }

    const appLink = `whatsapp://send?phone=${whatsappPhone}&text=${whatsappMessage}`
    const webLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`

    window.location.href = appLink
    setTimeout(() => {
      window.open(webLink, "_blank", "noopener,noreferrer")
    }, 500)
  }

  const blockedDateSet = new Set(item.availableDates || [])

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
                    modifiers={{
                      blockedByOwner: (date) => {
                        const yyyy = date.getFullYear()
                        const mm = String(date.getMonth() + 1).padStart(2, "0")
                        const dd = String(date.getDate()).padStart(2, "0")
                        return blockedDateSet.has(`${yyyy}-${mm}-${dd}`)
                      },
                      booked: (date) => {
                        const yyyy = date.getFullYear()
                        const mm = String(date.getMonth() + 1).padStart(2, "0")
                        const dd = String(date.getDate()).padStart(2, "0")
                        return bookedDateSet.has(`${yyyy}-${mm}-${dd}`)
                      },
                    }}
                    modifiersClassNames={{
                      blockedByOwner: "bg-red-500 text-white rounded-full !opacity-100",
                      booked: "bg-red-200 text-red-700 border border-red-400 rounded-full line-through !opacity-100",
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      if (date < today) {
                        return true
                      }

                      const yyyy = date.getFullYear()
                      const mm = String(date.getMonth() + 1).padStart(2, "0")
                      const dd = String(date.getDate()).padStart(2, "0")
                      const dateStr = `${yyyy}-${mm}-${dd}`
                      if (bookedDateSet.has(`${yyyy}-${mm}-${dd}`)) {
                        return true
                      }
                      return blockedDateSet.has(dateStr)
                    }}
                    className="rounded-md border"
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    {`${blockedDateSet.size} dates blocked by owner • ${bookedDateSet.size} dates already booked`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Red circles are blocked dates and cannot be booked.</p>
                </CardContent>
              </Card>
            )}

            {/* Booking Button */}
            {item.available && (
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-[#FF8C00] hover:bg-[#CC7000] text-white"
                  disabled={!selectedDate}
                  onClick={handleBooking}
                >
                  {isAuthenticated ? "Proceed to Booking" : "Login to Book"}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleCopyNumber}
                    disabled={!normalizedPhone}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedNumber ? "Number Copied" : "Copy Contact No"}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" disabled={!normalizedPhone} onClick={handleOpenWhatsApp}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
                {!normalizedPhone && (
                  <p className="text-sm text-muted-foreground">Owner mobile number is not available for this item yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
