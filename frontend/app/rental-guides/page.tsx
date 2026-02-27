'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Home, Laptop, Wrench, Trophy, Tent, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function RentalGuidesPage() {
  const guides = [
    {
      icon: Car,
      category: "Vehicles",
      title: "Car Rental Guide",
      description: "Learn how to rent vehicles safely and what to inspect before taking them out.",
      tips: [
        "Check vehicle documentation and insurance",
        "Inspect for existing damage",
        "Verify fuel level and mileage",
        "Understand mileage limits and fuel policies",
        "Know the emergency procedures"
      ]
    },
    {
      icon: Home,
      category: "Properties",
      title: "Property Rental Guide",
      description: "Essential tips for renting properties for short-term stays and special events.",
      tips: [
        "Review house rules carefully",
        "Check amenities and utilities",
        "Understand check-in/check-out times",
        "Know cancellation policies",
        "Clarify house maintenance expectations"
      ]
    },
    {
      icon: Laptop,
      category: "Electronics",
      title: "Electronics Rental Guide",
      description: "How to safely rent high-value electronics and protect your rental investment.",
      tips: [
        "Verify device condition and functionality",
        "Check all included accessories",
        "Understand warranty coverage",
        "Know about damage deposits",
        "Learn return procedures"
      ]
    },
    {
      icon: Wrench,
      category: "Tools",
      title: "Tools Rental Guide",
      description: "Tips for renting tools and equipment for your DIY or professional projects.",
      tips: [
        "Verify tool condition before use",
        "Understand safety guidelines",
        "Know maintenance requirements",
        "Check fuel/power specifications",
        "Learn proper storage and handling"
      ]
    },
    {
      icon: Trophy,
      category: "Sports Equipment",
      title: "Sports Equipment Guide",
      description: "Rent sports equipment safely and ensure proper fit and functionality.",
      tips: [
        "Verify equipment condition",
        "Ensure proper sizing/fit",
        "Understand safety certifications",
        "Know usage limitations",
        "Check insurance coverage"
      ]
    },
    {
      icon: Tent,
      category: "Camping Gear",
      title: "Camping & Outdoor Guide",
      description: "Complete guide to renting camping equipment for your outdoor adventures.",
      tips: [
        "Check all components are included",
        "Verify equipment is clean and functional",
        "Understand weather limitations",
        "Know proper setup procedures",
        "Learn packing and storage"
      ]
    }
  ]

  const faqItems = [
    {
      question: "How much should I expect to pay for rentals?",
      answer: "Prices vary widely based on item type, quality, and duration. Short-term rentals are generally 10-20% of purchase price per day. Compare multiple listings to find the best value."
    },
    {
      question: "What if rented items get damaged?",
      answer: "Most owners require a damage deposit. Minor wear is normal, but significant damage may result in charges. Document everything with photos and communicate with the owner immediately."
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes! Contact the owner before your return date. Many owners allow extensions if the item isn't booked again. Discounts may apply for longer periods."
    },
    {
      question: "What payment methods are accepted?",
      answer: "RentHub accepts credit cards, debit cards, and digital wallets through our secure platform. Never pay outside the platform to protect yourself from fraud."
    },
    {
      question: "How do I know if a rental is trustworthy?",
      answer: "Check the owner's verification status, review scores, rental history, and response time. Verified owners with 4+ stars and detailed listings are typically reliable."
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Rental Guides</h1>
            <p className="text-lg text-white/90 text-pretty">
              Master the art of renting with our comprehensive guides for every category. Learn tips, best practices, and insider knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {guides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm text-[#0EA5E9] font-semibold mb-1">{guide.category}</div>
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-muted-foreground text-pretty text-sm">{guide.description}</p>
                    <ul className="space-y-2">
                      {guide.tips.slice(0, 3).map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <span className="text-[#0EA5E9] font-bold">•</span>
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

      <section className="py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Find answers to common questions about renting on RentHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-pretty">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-white via-blue-50 to-white border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#0EA5E9]" />
              Pro Tips for Successful Rentals
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-[#0EA5E9]">1.</span>
                <span><strong>Plan Ahead:</strong> Book items well in advance, especially during peak seasons, to get better availability and rates.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0EA5E9]">2.</span>
                <span><strong>Read Reviews:</strong> Always check what previous renters say about the owner and item condition.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0EA5E9]">3.</span>
                <span><strong>Ask Questions:</strong> Don't hesitate to message owners before booking for clarifications.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0EA5E9]">4.</span>
                <span><strong>Return on Time:</strong> Late returns can result in additional fees and damage your rental history.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0EA5E9]">5.</span>
                <span><strong>Leave Feedback:</strong> Help other users by leaving honest reviews of your rental experience.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
