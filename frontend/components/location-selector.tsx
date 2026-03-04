"use client"

import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const locations = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Anuradhapura", "Trincomalee", "Batticaloa"]

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Galle: { lat: 6.0535, lng: 80.221 },
  Jaffna: { lat: 9.6615, lng: 80.0255 },
  Negombo: { lat: 7.2083, lng: 79.8358 },
  Anuradhapura: { lat: 8.3114, lng: 80.4037 },
  Trincomalee: { lat: 8.5874, lng: 81.2152 },
  Batticaloa: { lat: 7.717, lng: 81.7 },
}

const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false })

interface LocationSelectorProps {
  value?: string
  onChange?: (value: string) => void
  onCoordinatesChange?: (coordinates: { lat: number; lng: number } | null) => void
}

export function LocationSelector({ value, onChange, onCoordinatesChange }: LocationSelectorProps) {
  const isControlled = typeof value === "string" && typeof onChange === "function"
  const [internalLocation, setInternalLocation] = useState("")
  const [tempLocation, setTempLocation] = useState("")
  const [tempCoordinates, setTempCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.9271, 79.8612])
  const [marker, setMarker] = useState<[number, number] | null>(null)
  const [open, setOpen] = useState(false)

  const selectedLocation = isControlled ? value || "" : internalLocation

  useEffect(() => {
    if (!open) {
      return
    }
    setTempLocation(selectedLocation || "")
    setTempCoordinates(null)
  }, [open, selectedLocation])

  const triggerLabel = useMemo(() => {
    if (!selectedLocation?.trim()) {
      return "Select Location"
    }

    const maxLength = 36
    if (selectedLocation.length <= maxLength) {
      return selectedLocation
    }

    return `${selectedLocation.slice(0, maxLength)}...`
  }, [selectedLocation])

  const updateLocation = (nextLocation: string) => {
    if (isControlled) {
      onChange(nextLocation)
      return
    }
    setInternalLocation(nextLocation)
  }

  const handleMapSelect = async (lat: number, lng: number) => {
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    setMarker([lat, lng])
    setMapCenter([lat, lng])
    setTempLocation(fallback)
    setTempCoordinates({ lat, lng })

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()
      const resolved = data?.display_name || fallback
      setTempLocation(resolved)
    } catch {
      // Keep fallback coordinate string when reverse geocoding fails
    }
  }

  const handleSearchLocation = async () => {
    const query = tempLocation.trim()
    if (!query) {
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()
      const first = Array.isArray(data) ? data[0] : null
      if (!first) {
        return
      }

      const lat = Number(first.lat)
      const lng = Number(first.lon)
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return
      }

      setMapCenter([lat, lng])
      setMarker([lat, lng])
      setTempCoordinates({ lat, lng })
      if (first.display_name) {
        setTempLocation(first.display_name)
      }
    } catch {
      // Ignore network/search failures and keep current input
    }
  }

  const handleCityQuickSelect = (city: string) => {
    const knownCoordinates = cityCoordinates[city]
    setTempLocation(city)
    setTempCoordinates(knownCoordinates || null)
    if (knownCoordinates) {
      setMapCenter([knownCoordinates.lat, knownCoordinates.lng])
      setMarker([knownCoordinates.lat, knownCoordinates.lng])
    }
    if (onCoordinatesChange) {
      onCoordinatesChange(knownCoordinates || null)
    }
    updateLocation(city)
    setOpen(false)
  }

  const handleConfirm = async () => {
    const nextValue = tempLocation.trim()
    if (!nextValue) {
      return
    }

    let resolvedCoordinates = tempCoordinates
    if (!resolvedCoordinates) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nextValue)}&format=json&limit=1`,
          {
            headers: {
              "Accept": "application/json",
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const first = Array.isArray(data) ? data[0] : null
          if (first) {
            const lat = Number(first.lat)
            const lng = Number(first.lon)
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              resolvedCoordinates = { lat, lng }
              setMapCenter([lat, lng])
              setMarker([lat, lng])
            }
          }
        }
      } catch {
        // Keep text-only location when geocoding fails
      }
    }

    updateLocation(nextValue)
    if (onCoordinatesChange) {
      onCoordinatesChange(resolvedCoordinates)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-6 py-2 text-sm font-medium text-[#2B70FF] border-2 border-[#1A4FCC] rounded-lg bg-transparent transition-all duration-300 hover:bg-[#2B70FF]/10">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{triggerLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>Click on the map or choose a city shortcut</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="h-72 rounded-lg overflow-hidden border">
            <LocationMap center={mapCenter} marker={marker} onSelect={handleMapSelect} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected location</p>
            <div className="flex gap-2">
              <Input
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="Pick from map or search location"
              />
              <Button type="button" variant="outline" onClick={handleSearchLocation}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => handleCityQuickSelect(location)}
                className="p-3 rounded-lg border border-gray-200 hover:border-[#2B70FF] hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
              >
                {location}
              </button>
            ))}
          </div>

          <Button className="w-full bg-[#2B70FF] hover:bg-[#1A4FCC]" onClick={handleConfirm} disabled={!tempLocation.trim()}>
            Use This Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
