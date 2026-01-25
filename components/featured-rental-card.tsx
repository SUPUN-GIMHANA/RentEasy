"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Star, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface FeaturedRentalCardProps {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  location: string
  rating: number
  reviews: number
  owner: string
  responseTime: string
  features: string[]
}

export function FeaturedRentalCard({
  id,
  name,
  description,
  price,
  imageUrl,
  location,
  rating,
  reviews,
  owner,
  responseTime,
  features,
}: FeaturedRentalCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <Badge className="absolute top-3 left-3 bg-green-500 text-white border-none">Verified</Badge>
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-300 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-[#2B70FF] transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">
              {rating} <span className="text-muted-foreground">({reviews})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{features.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">LKR {price.toLocaleString()}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
          <Button variant="ghost" size="sm" className="text-[#0EA5E9] hover:text-[#0284C7]">
            <Calendar className="h-4 w-4 mr-1" />
            Check Calendar
          </Button>
        </div>

        <Button
          className="w-full mt-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white transition-all duration-300 hover:scale-105"
          asChild
        >
          <Link href={`/items/${id}`}>Check and Book Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
