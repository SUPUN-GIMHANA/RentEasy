"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { mockItems } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import type { Booking } from "@/lib/types"
import { ArrowLeft, CalendarIcon, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export function BookingContent() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")
  const dateStr = searchParams.get("date")
  const item = mockItems.find((i) => i.id === itemId)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  if (!isAuthenticated) {
    router.push(`/login?redirect=/booking?itemId=${itemId}&date=${dateStr}`)
    return null
  }

  if (!item || !dateStr) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
        <Button asChild>
          <Link href="/browse">Back to Browse</Link>
        </Button>
      </div>
    )
  }

  const bookingDate = new Date(dateStr)
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleBooking = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const booking: Booking = {
      id: Math.random().toString(36).substring(7),
      itemId: item.id,
      itemName: item.name,
      userId: user?.id || "",
      date: dateStr,
      status: "confirmed",
      totalPrice: item.price,
      createdAt: new Date().toISOString(),
    }

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]))

    setIsProcessing(false)
    router.push(`/booking/success?bookingId=${booking.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/items/${item.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Item
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm font-medium mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium mt-1">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>This is a demo - no real payment will be processed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input
                      id="card-cvc"
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <div className="leading-relaxed">
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#2B70FF] hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#2B70FF] hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2 text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Rental Date:</span>
                  </div>
                  <p className="text-sm font-medium">{formattedDate}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rental Fee (1 day)</span>
                    <span>${item.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>${Math.round(item.price * 0.05 * 100) / 100}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#2B70FF]">
                    <span>Booking Fee (10%)</span>
                    <span>${Math.round(item.price * 0.1 * 100) / 100}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Booking Fee Total</span>
                  <span className="text-[#2B70FF]">${Math.round(item.price * 0.1 * 100) / 100}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-[#FF8C00] hover:bg-[#CC7000] text-white"
                  disabled={isProcessing || !agreedToTerms || !cardNumber || !cardExpiry || !cardCvc}
                  onClick={handleBooking}
                >
                  {isProcessing ? "Processing..." : "Confirm Booking"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">Your booking will be confirmed instantly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
