import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I rent an item on RentHub?",
        a: "Browse our catalog, select an item, choose your rental dates, and complete the booking. You'll need to create an account first.",
      },
      {
        q: "Do I need an account to browse items?",
        a: "No, you can browse all available items without an account. However, you'll need to sign up to make bookings.",
      },
    ],
  },
  {
    category: "Payments & Pricing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and digital payment methods like PayPal and Apple Pay.",
      },
      {
        q: "Are there any additional fees?",
        a: "Pricing is transparent. The daily rate is shown upfront, and any security deposits or insurance fees are clearly stated before checkout.",
      },
    ],
  },
  {
    category: "Rentals & Returns",
    questions: [
      {
        q: "How do I return an item?",
        a: "Return procedures vary by item. Most owners offer delivery/pickup services or you can arrange a meetup. Details are provided in your booking confirmation.",
      },
      {
        q: "What if I need to extend my rental?",
        a: "Contact the owner through our messaging system before your rental period ends to request an extension, subject to availability.",
      },
    ],
  },
  {
    category: "Safety & Insurance",
    questions: [
      {
        q: "Are rentals insured?",
        a: "All rentals come with basic protection. Optional premium insurance is available during checkout for added peace of mind.",
      },
      {
        q: "What if an item is damaged?",
        a: "Report any damage immediately. Depending on the insurance coverage, you may be covered for accidental damage. Intentional damage is the renter's responsibility.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground text-pretty">Find answers to common questions about RentHub</p>
          </div>

          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center">
                              <HelpCircle className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#2B70FF] hover:bg-[#1A4FCC] text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
