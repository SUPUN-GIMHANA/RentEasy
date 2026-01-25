"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Booking, Feedback as FeedbackType } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function FeedbackContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/feedback")
      return
    }

    if (bookingId) {
      const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      const foundBooking = storedBookings.find((b: Booking) => b.id === bookingId && b.userId === user?.id)
      setBooking(foundBooking || null)
    }
  }, [bookingId, isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking || rating === 0) return

    setIsSubmitting(true)

    const feedback: FeedbackType = {
      id: Math.random().toString(36).substring(7),
      bookingId: booking.id,
      userId: user?.id || "",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    }

    const existingFeedback = JSON.parse(localStorage.getItem("feedback") || "[]")
    localStorage.setItem("feedback", JSON.stringify([...existingFeedback, feedback]))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    router.push("/feedback/success")
  }

  if (!isAuthenticated) {
    return null
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Leave Feedback</CardTitle>
            <CardDescription className="text-base">
              Share your experience renting <span className="font-semibold">{booking.itemName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">How would you rate your experience?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? "fill-[#FF8C00] text-[#FF8C00]"
                            : "fill-none text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {rating === 1 && "Poor - Not satisfied"}
                    {rating === 2 && "Fair - Below expectations"}
                    {rating === 3 && "Good - Met expectations"}
                    {rating === 4 && "Very Good - Exceeded expectations"}
                    {rating === 5 && "Excellent - Outstanding experience"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment" className="text-base">
                  Tell us more about your experience (optional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share details about the item condition, delivery, customer service, etc."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#FF8C00] hover:bg-[#CC7000] text-white"
                disabled={rating === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
