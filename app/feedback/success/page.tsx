"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home, Package } from "lucide-react"
import Link from "next/link"

export default function FeedbackSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#CC7000] flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Thank You!</CardTitle>
              <CardDescription className="text-lg">Your feedback has been submitted successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                We appreciate you taking the time to share your experience. Your feedback helps us improve our service
                and assists other users in making informed decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1 bg-[#2B70FF] hover:bg-[#1A4FCC]">
                  <Link href="/orders">
                    <Package className="h-4 w-4 mr-2" />
                    View My Orders
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
