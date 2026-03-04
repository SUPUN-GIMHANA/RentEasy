"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Package, User, LogOut, Heart, Bell, LayoutDashboard, UserCircle, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LocationSelector } from "@/components/location-selector"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [locationText, setLocationText] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const location = searchParams.get("location")
    const radius = searchParams.get("radiusKm") || "10"

    if (location) {
      setLocationText(location)
    }

    if (lat && lng) {
      const parsedLat = Number(lat)
      const parsedLng = Number(lng)
      if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
        setCoordinates({ lat: parsedLat, lng: parsedLng })
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("topBarLocationSearch")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (!location && parsed?.locationText) {
            setLocationText(parsed.locationText)
          }
          if ((!lat || !lng) && typeof parsed?.lat === "number" && typeof parsed?.lng === "number") {
            setCoordinates({ lat: parsed.lat, lng: parsed.lng })
          }
        } catch {
          // Ignore invalid storage values
        }
      }

      if (location || (lat && lng)) {
        localStorage.setItem(
          "topBarLocationSearch",
          JSON.stringify({
            locationText: location || locationText,
            lat: lat ? Number(lat) : coordinates?.lat,
            lng: lng ? Number(lng) : coordinates?.lng,
            radiusKm: Number(radius) || 10,
          })
        )
      }
    }
  }, [searchParams])

  const browseHref = useMemo(() => {
    const query = new URLSearchParams()
    if (locationText.trim()) {
      query.set("location", locationText.trim())
    }
    if (coordinates) {
      query.set("lat", String(coordinates.lat))
      query.set("lng", String(coordinates.lng))
      query.set("radiusKm", "10")
    }
    const serialized = query.toString()
    return serialized ? `/browse?${serialized}` : "/browse"
  }, [locationText, coordinates])

  const executeTopBarLocationSearch = async () => {
    const rawLocation = locationText.trim()
    let nextCoordinates = coordinates

    if (!nextCoordinates && rawLocation) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(rawLocation)}&format=json&limit=1`,
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
              nextCoordinates = { lat, lng }
              setCoordinates(nextCoordinates)
            }
          }
        }
      } catch {
        // Keep location text search fallback
      }
    }

    const query = new URLSearchParams()
    if (rawLocation) {
      query.set("location", rawLocation)
    }
    if (nextCoordinates) {
      query.set("lat", String(nextCoordinates.lat))
      query.set("lng", String(nextCoordinates.lng))
      query.set("radiusKm", "10")
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "topBarLocationSearch",
        JSON.stringify({
          locationText: rawLocation,
          lat: nextCoordinates?.lat,
          lng: nextCoordinates?.lng,
          radiusKm: 10,
        })
      )
    }

    const target = `/browse${query.toString() ? `?${query.toString()}` : ""}`
    if (pathname === "/browse") {
      router.replace(target)
      return
    }
    router.push(target)
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-linear-to-b from-[#0EA5E9]/30 to-[#0EA5E9]/10 border-b border-[#0EA5E9]/20 supports-backdrop-filter:bg-linear-to-b supports-backdrop-filter:from-[#0EA5E9]/30 supports-backdrop-filter:to-[#0EA5E9]/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-[#2B70FF] to-[#1A4FCC] transition-transform duration-300 group-hover:scale-110">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">RentEasy</span>
          </Link>
          <LocationSelector
            value={locationText}
            onChange={setLocationText}
            onCoordinatesChange={setCoordinates}
          />
          <Button
            type="button"
            variant="outline"
            className="hidden sm:flex bg-transparent"
            onClick={executeTopBarLocationSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link
            href={browseHref}
            className="px-6 py-2 text-sm font-medium text-[#2B70FF] border-2 border-[#1A4FCC] rounded-lg transition-all duration-300 hover:bg-[#2B70FF]/10 hover:scale-105"
          >
            Browse Items
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-transparent transition-all duration-300 hover:scale-110"
                >
                  <User className="h-5 w-5 text-[#2B70FF]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-background/95">
                <div className="px-2 py-2 text-sm">
                  <p className="font-medium">{`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saves" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Saves
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="transition-all duration-300 hover:scale-105 bg-transparent" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-[#2B70FF] hover:bg-[#1A4FCC] transition-all duration-300 hover:scale-105" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
