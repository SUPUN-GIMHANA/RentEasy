"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { CategoryCard } from "@/components/category-card"
import { FeaturedRentalCard } from "@/components/featured-rental-card"
import { AdCarousel } from "@/components/ad-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Package,
  Shield,
  Clock,
  Star,
  Car,
  Home,
  Laptop,
  ShirtIcon,
  Wrench,
  Trophy,
  Tent,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[280px] md:h-[320px] overflow-hidden bg-gradient-to-br from-[#2B70FF] via-[#1A4FCC] to-[#0F3A99]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%232B70FF;stop-opacity:1" /><stop offset="100%" style="stop-color:%231A4FCC;stop-opacity:1" /></linearGradient></defs><rect width="1200" height="400" fill="url(%23grad)"/></svg>')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Decorative circular shapes */}
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#0EA5E9]/40 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-gradient-to-tl from-[#4A90FF]/50 to-transparent blur-3xl"></div>
        <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full bg-[#1E5EE8]/30 blur-xl"></div>

        <HeroSlideshow />
        <div className="absolute inset-0 z-10 flex items-center justify-end">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl ml-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-balance">RentEasy</h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link href="/browse">Browse Items</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <AdCarousel />
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-radial from-[#2B70FF]/20 to-transparent blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-radial from-[#4A90FF]/15 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-radial from-indigo-200/20 to-transparent blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Find exactly what you need from our wide selection of rental categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard icon={Car} label="Vehicles" href="/browse?category=vehicles" accentColor="#2B70FF" />
            <CategoryCard icon={Home} label="Properties" href="/browse?category=properties" accentColor="#0EA5E9" />
            <CategoryCard icon={Laptop} label="Electronics" href="/browse?category=electronics" accentColor="#4A90FF" />
            <CategoryCard icon={ShirtIcon} label="Clothing" href="/browse?category=clothing" accentColor="#1E5EE8" />
            <CategoryCard icon={Wrench} label="Tools" href="/browse?category=tools" accentColor="#2563EB" />
            <CategoryCard icon={Trophy} label="Sports" href="/browse?category=sports" accentColor="#0284C7" />
            <CategoryCard icon={Tent} label="Camping" href="/browse?category=camping" accentColor="#0369A1" />
            <CategoryCard icon={Sparkles} label="Events" href="/browse?category=events" accentColor="#3B82F6" />
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-white via-blue-50 to-white border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600 font-medium">Google Ad Space (300x250 or 728x90)</p>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-gradient-radial from-[#2B70FF]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full bg-[#1E5EE8]/30 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-gradient-radial from-[#4A90FF]/50 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Rentals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover our most popular and highly-rated rental items
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturedRentalCard
              id="1"
              name="Luxury Toyota Camry 2023"
              description="Comfortable sedan perfect for city drives and long trips. Features leather seats, GPS navigation, and excellent fuel economy."
              price={8000}
              imageUrl="/professional-camera-kit.jpg"
              location="Colombo"
              rating={4.8}
              reviews={2}
              owner="John Doe"
              responseTime="< 1 hour"
              features={["GPS Navigation", "Leather Seats", "Air Conditioning"]}
            />
            <FeaturedRentalCard
              id="2"
              name="Modern 2BR Apartment in Colombo"
              description="Beautiful apartment with city view, fully furnished with modern amenities. Perfect for short-term stays."
              price={15000}
              imageUrl="/luxury-camping-tent-setup.jpg"
              location="Colombo"
              rating={4.9}
              reviews={1}
              owner="Sarah Wilson"
              responseTime="< 30 min"
              features={["WiFi", "Kitchen", "Washing Machine"]}
            />
            <FeaturedRentalCard
              id="3"
              name="Professional DSLR Camera Kit"
              description="Canon EOS R5 with multiple lenses, tripod, and accessories. Perfect for photography and videography."
              price={5000}
              imageUrl="/professional-dj-sound-system.jpg"
              location="Kandy"
              rating={4.7}
              reviews={1}
              owner="Mike Johnson"
              responseTime="< 2 hours"
              features={["Multiple Lenses", "Tripod", "Memory Cards"]}
            />
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-white via-blue-50 to-white border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600 font-medium">Google Ad Space (300x250 or 728x90)</p>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
        {/* Circular decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-gradient-radial from-[#2B70FF]/10 to-transparent blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-radial from-cyan-300/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 rounded-full bg-gradient-radial from-blue-200/15 to-transparent blur-xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RentHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              We make renting easy, secure, and convenient for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-muted-foreground text-pretty">
                  Browse hundreds of premium items across multiple categories
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                <p className="text-muted-foreground text-pretty">
                  Safe and secure payment processing with buyer protection
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
                <p className="text-muted-foreground text-pretty">
                  Check availability instantly and book items on the spot
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-muted-foreground text-pretty">
                  All items verified and maintained to the highest standards
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-white via-blue-50 to-white border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600 font-medium">Google Ad Space (300x250 or 728x90)</p>
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#1E5EE8] via-[#2B70FF] to-[#4A90FF] text-white">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-radial from-[#0EA5E9]/60 via-[#0EA5E9]/30 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#4A90FF]/50 via-cyan-300/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-white/20 via-white/10 to-transparent blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-radial from-[#1A4FCC]/40 to-transparent blur-2xl"></div>

        <div className="absolute top-10 right-1/3 w-48 h-48 rounded-full bg-gradient-radial from-cyan-200/30 to-transparent blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-56 h-56 rounded-full bg-gradient-radial from-blue-300/25 to-transparent blur-xl"></div>

        <div className="absolute top-20 left-1/4 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute bottom-32 right-1/4 w-32 h-32 rounded-full bg-[#0EA5E9]/20"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-cyan-300/15"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-white/15"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied customers who trust RentHub for their rental needs
          </p>
          <Button
            size="lg"
            className="bg-white text-[#2B70FF] hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            asChild
          >
            <Link href="/browse">Start Browsing</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
