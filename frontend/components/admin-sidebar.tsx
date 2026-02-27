"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  MessageSquare,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Manage Items", href: "/admin/items" },
  { icon: PlusCircle, label: "Add Offers", href: "/admin/add-offers" },
  { icon: TrendingUp, label: "Boost Advertisement", href: "/admin/boost" },
  { icon: DollarSign, label: "Commercial Ads", href: "/admin/commercial" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] transition-transform duration-300 group-hover:scale-110">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive ? "bg-[#2B70FF] text-white" : "text-muted-foreground hover:bg-blue-50 hover:text-[#2B70FF]",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
