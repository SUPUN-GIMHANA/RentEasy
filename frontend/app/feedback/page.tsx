import { Suspense } from "react"
import { FeedbackContent } from "./feedback-content"
import { Header } from "@/components/header"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <FeedbackContent />
      </Suspense>
    </div>
  )
}
