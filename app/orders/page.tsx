"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { CalendarIcon, Package, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OrdersPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders")
      return
    }

    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const userBookings = storedBookings.filter((booking: Booking) => booking.userId === user?.id)
    setBookings(userBookings)
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) {
    return null
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground text-lg">Track and manage your rental bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">Start browsing items to make your first booking</p>
              <Button asChild className="bg-[#2B70FF] hover:bg-[#1A4FCC]">
                <Link href="/browse">Browse Items</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.date)
              const formattedDate = bookingDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              const createdDate = new Date(booking.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">{booking.itemName}</CardTitle>
                        <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Rental Date</span>
                        </div>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Booked On</p>
                        <p className="font-medium">{createdDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="font-bold text-lg text-[#2B70FF]">${booking.totalPrice}</p>
                      </div>
                    </div>

                    {booking.status === "completed" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-transparent border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00]/10"
                        >
                          <Link href={`/feedback?bookingId=${booking.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Leave Feedback
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
