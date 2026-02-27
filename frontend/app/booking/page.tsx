import { Suspense } from "react"
import { BookingContent } from "./booking-content"
import { Header } from "@/components/header"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <BookingContent />
      </Suspense>
    </div>
  )
}
