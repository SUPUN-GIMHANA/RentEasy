'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Shield, Users, Camera, Lock } from "lucide-react"

export default function SafetyGuidelinesPage() {
  const guidelines = [
    {
      icon: Shield,
      title: "Verify Listings",
      description: "Always verify seller credentials and read reviews carefully before booking. Check for verified badges and authentic user profiles.",
      tips: [
        "Look for verified badges on profiles",
        "Check rental history and customer reviews",
        "Review listing photos thoroughly",
        "Ask questions before confirming booking"
      ]
    },
    {
      icon: Camera,
      title: "Document Everything",
      description: "Take photos and videos of items before and after rental to document condition. This protects both you and the rental owner.",
      tips: [
        "Document item condition on receipt",
        "Take photos from multiple angles",
        "Record any existing damage",
        "Keep all correspondence saved"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Identify Red Flags",
      description: "Be cautious of unusual requests, prices that seem too good to be true, or sellers unwilling to meet in safe locations.",
      tips: [
        "Avoid deals that seem unrealistic",
        "Never pay outside the platform",
        "Beware of seller pressure tactics",
        "Trust your instincts"
      ]
    },
    {
      icon: Users,
      title: "Meeting Safety",
      description: "Always meet in safe, public locations during daylight hours. Let someone know where you're going and when you'll return.",
      tips: [
        "Meet in busy public places",
        "Go during daylight hours",
        "Bring a trusted companion",
        "Share your location with a friend"
      ]
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      description: "Use our secure payment system and never share personal banking details directly with renters. Report suspicious activity immediately.",
      tips: [
        "Use platform payment only",
        "Don't share passwords or PINs",
        "Report suspicious sellers",
        "Use secure WiFi for transactions"
      ]
    },
    {
      icon: CheckCircle,
      title: "Rental Item Care",
      description: "Handle rented items with care and return them in the condition specified. Follow all usage guidelines provided by the owner.",
      tips: [
        "Follow usage instructions",
        "Return items on time",
        "Maintain items properly",
        "Report damage immediately"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative py-16 bg-gradient-to-br from-[#2B70FF] via-[#1A4FCC] to-[#0F3A99] text-white overflow-hidden">
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#0EA5E9]/40 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-gradient-to-tl from-[#4A90FF]/50 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Safety Guidelines</h1>
            <p className="text-lg text-white/90 text-pretty">
              Your safety is our top priority. Follow these guidelines to ensure a secure rental experience on RentHub.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon
              return (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{guideline.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-pretty">{guideline.description}</p>
                    <ul className="space-y-2">
                      {guideline.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
            <p className="text-muted-foreground mb-4 text-pretty">
              If you experience any safety concerns or suspicious activity on RentHub, please contact our support team immediately. We take all reports seriously and will investigate promptly.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> safety@renthub.com</p>
              <p><span className="font-semibold">Phone:</span> +1-800-RENTHUB (736-8482)</p>
              <p><span className="font-semibold">Report a Problem:</span> Use the "Report" button on any listing or contact us immediately</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
