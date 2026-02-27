"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const locations = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Anuradhapura", "Trincomalee", "Batticaloa"]

export function LocationSelector() {
  const [selectedLocation, setSelectedLocation] = useState("Select Location")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-6 py-2 text-sm font-medium text-[#2B70FF] border-2 border-[#1A4FCC] rounded-lg bg-transparent transition-all duration-300 hover:bg-[#2B70FF]/10 hover:scale-105">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLocation}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>Choose a location to find rentals near you</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Map Placeholder - shows grid of location buttons */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 h-64 flex items-center justify-center border border-blue-200">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-[#2B70FF]/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive map view</p>
            </div>
          </div>

          {/* Location buttons grid */}
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => {
                  setSelectedLocation(location)
                  setOpen(false)
                }}
                className="p-3 rounded-lg border border-gray-200 hover:border-[#2B70FF] hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
