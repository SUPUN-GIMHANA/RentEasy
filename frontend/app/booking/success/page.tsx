import { Suspense } from "react"
import { BookingSuccessContent } from "./booking-success-content"
import { Header } from "@/components/header"

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <BookingSuccessContent />
      </Suspense>
    </div>
  )
}
