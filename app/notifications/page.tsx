"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

const notifications = [
  {
    id: "1",
    type: "success",
    title: "Booking Confirmed",
    message: "Your booking for Professional Camera Kit has been confirmed.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Message",
    message: "John Doe sent you a message about your camera rental inquiry.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Rental Ending Soon",
    message: "Your rental for DJ Sound System ends in 2 days. Please arrange return.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Review Request",
    message: "Please share your experience with the Luxury Camping Tent rental.",
    time: "2 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-300 hover:shadow-lg ${
                  !notification.read ? "border-l-4 border-l-[#2B70FF] bg-blue-50/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
