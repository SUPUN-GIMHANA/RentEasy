"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Package, User, LogOut, Heart, Bell, LayoutDashboard, UserCircle } from "lucide-react"
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

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-gradient-to-b from-[#0EA5E9]/30 to-[#0EA5E9]/10 border-b border-[#0EA5E9]/20 supports-[backdrop-filter]:bg-gradient-to-b supports-[backdrop-filter]:from-[#0EA5E9]/30 supports-[backdrop-filter]:to-[#0EA5E9]/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] transition-transform duration-300 group-hover:scale-110">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">RentHub</span>
          </Link>
          <LocationSelector />
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link
            href="/browse"
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
                  <p className="font-medium">{user?.name}</p>
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
