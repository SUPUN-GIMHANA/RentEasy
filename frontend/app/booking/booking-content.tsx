"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-context"
import { api, ApiError } from "@/lib/api-client"
import type { Booking } from "@/lib/types"
import { safeJsonParse } from "@/lib/utils"
import { ArrowLeft, CalendarIcon, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export function BookingContent() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")
  const startDateStr = searchParams.get("startDate")
  const endDateStr = searchParams.get("endDate")
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking?itemId=${itemId}&startDate=${startDateStr}&endDate=${endDateStr}`)
      return
    }

    const loadItem = async () => {
      if (!itemId) {
        setLoading(false)
        return
      }

      try {
        const itemData = await api.items.getById(itemId)
        setItem(itemData)
      } catch (err) {
        console.error("Failed to load item:", err)
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [itemId, isAuthenticated, router, startDateStr, endDateStr])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to login...</h1>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  if (!item || !startDateStr || !endDateStr) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
        <Button asChild>
          <Link href="/browse">Back to Browse</Link>
        </Button>
      </div>
    )
  }

  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  
  // Calculate number of days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1) // +1 to include both start and end date

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const rentalFee = item.price * diffDays
  const serviceFee = Math.round(rentalFee * 0.05 * 100) / 100
  const bookingFee = Math.round(rentalFee * 0.1 * 100) / 100
  const totalAmount = Math.round((rentalFee + serviceFee + bookingFee) * 100) / 100

  const handleBooking = async () => {
    setBookingError("")
    setIsProcessing(true)

    try {
      // Create booking via API
      const bookingData = {
        itemId: item.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        deliveryAddress: "",
        specialInstructions: `Payment method: ${paymentMethod}`,
      }

      await api.bookings.create(bookingData)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const booking: Booking = {
        id: Math.random().toString(36).substring(7),
        itemId: item.id,
        itemName: item.name,
        userId: user?.id || "",
        date: startDateStr,
        status: "confirmed",
        totalPrice: totalAmount,
        createdAt: new Date().toISOString(),
      }

      const existingBookings = safeJsonParse<Booking[]>(localStorage.getItem("bookings"), [])
      localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]))

      setIsProcessing(false)
      router.push("/orders")
    } catch (error) {
      if (error instanceof ApiError && error.message.toLowerCase().includes("already booked")) {
        setBookingError("This item is already booked for the selected dates. Please choose different dates.")
      } else if (error instanceof ApiError) {
        setBookingError(error.message || "Failed to create booking. Please try again.")
      } else {
        setBookingError("Failed to create booking. Please try again.")
      }
      setIsProcessing(false)
    }
  }

  const isPaymentValid = () => {
    if (paymentMethod === "card") {
      return cardNumber && cardExpiry && cardCvc
    }
    return true // Other payment methods don't require validation in this demo
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

        {bookingError && (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {bookingError}
          </div>
        )}

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

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Landmark className="h-5 w-5" />
                      <span>Bank Transfer</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <span>Mobile Payment</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Info - Show only for card */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Card Information
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
            )}

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
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
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
                    <span className="text-muted-foreground">Rental Period:</span>
                  </div>
                  <p className="text-sm font-medium">{formattedStartDate} - {formattedEndDate}</p>
                  <p className="text-xs text-muted-foreground">{diffDays} {diffDays === 1 ? "day" : "days"}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rental Fee ({diffDays} {diffDays === 1 ? "day" : "days"} × ${item.price})</span>
                    <span>${rentalFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee (5%)</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#2B70FF]">
                    <span>Booking Fee (10%)</span>
                    <span>${bookingFee.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-[#2B70FF]">${totalAmount.toFixed(2)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-[#FF8C00] hover:bg-[#CC7000] text-white"
                  disabled={isProcessing || !agreedToTerms || !isPaymentValid()}
                  onClick={handleBooking}
                >
                  {isProcessing ? "Processing Payment..." : "Confirm Booking & Pay"}
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
