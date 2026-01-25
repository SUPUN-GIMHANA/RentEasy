import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RentHub</h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty leading-relaxed">
            Your trusted platform for renting premium items across Poland
          </p>

          <div className="prose max-w-none mb-12">
            <p className="text-lg mb-6 leading-relaxed">
              RentHub is Poland's leading rental marketplace, connecting item owners with people who need quality
              rentals for any occasion. Founded in 2020, we've grown to serve thousands of customers across the country,
              facilitating over 50,000 successful rentals.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Our mission is simple: make renting as easy as buying, while promoting sustainable consumption and helping
              people access premium items without the commitment of ownership. Whether you're looking for camera
              equipment for a weekend shoot, camping gear for your next adventure, or tools for a home project, RentHub
              has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To create a sustainable sharing economy where everyone can access quality items without the burden of
                  ownership, reducing waste and promoting community connections.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the most trusted rental platform in Europe, empowering people to experience more while
                  owning less, and building a more sustainable future for generations to come.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize building trust and fostering connections within our community of renters and owners.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  Promoting responsible consumption by enabling sharing and reducing unnecessary purchases.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] flex items-center justify-center mb-4 mx-auto">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  Ensuring every rental meets our high standards for safety, cleanliness, and functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
