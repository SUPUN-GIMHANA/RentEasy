import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    id: "1",
    title: "10 Tips for First-Time Renters on RentHub",
    excerpt: "New to renting? Here's everything you need to know to have a smooth experience.",
    category: "Guide",
    author: "Sarah Wilson",
    date: "Jan 1, 2026",
    image: "/professional-camera-kit.jpg",
  },
  {
    id: "2",
    title: "How to Maximize Your Rental Income",
    excerpt: "Owner tips for getting the most out of your rental items on our platform.",
    category: "Business",
    author: "John Doe",
    date: "Dec 28, 2025",
    image: "/luxury-camping-tent-setup.jpg",
  },
  {
    id: "3",
    title: "The Future of the Sharing Economy in Poland",
    excerpt: "Exploring trends and predictions for rental marketplaces in the coming years.",
    category: "Industry",
    author: "Mike Johnson",
    date: "Dec 25, 2025",
    image: "/professional-dj-sound-system.jpg",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">RentHub Blog</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Tips, guides, and insights from the rental marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-[#2B70FF]">{post.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-3 leading-snug">
                    <Link href={`/blog/${post.id}`} className="hover:text-[#2B70FF] transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
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
