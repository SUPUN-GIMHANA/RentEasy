"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const ads = [
  { id: 1, title: "Premium Equipment Rentals", description: "Get 20% off on your first booking" },
  { id: 2, title: "Same Day Delivery Available", description: "Fast and reliable rental service" },
  { id: 3, title: "24/7 Customer Support", description: "We're always here to help" },
  { id: 4, title: "Flexible Rental Terms", description: "Choose what works best for you" },
]

export function AdCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % ads.length)
    setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + ads.length) % ads.length)
    setIsAutoPlay(false)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="min-w-full h-20 bg-gradient-to-r from-[#2B70FF] to-[#0EA5E9] flex items-center justify-between px-8 text-white"
            >
              <div>
                <h3 className="font-bold text-lg">{ad.title}</h3>
                <p className="text-sm opacity-90">{ad.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#2B70FF]"
        onClick={prev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#2B70FF]"
        onClick={next}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center gap-2 mt-2">
        {ads.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${index === current ? "bg-[#2B70FF] w-8" : "bg-gray-300 w-2"}`}
            onClick={() => {
              setCurrent(index)
              setIsAutoPlay(false)
            }}
          />
        ))}
      </div>
    </div>
  )
}
