"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  icon: LucideIcon
  label: string
  href: string
  accentColor: string
}

export function CategoryCard({ icon: Icon, label, href, accentColor }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="relative rounded-full bg-gradient-to-br p-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: `linear-gradient(to bottom right, ${accentColor}15, ${accentColor}08)`,
              }}
            >
              <Icon
                className="h-8 w-8 transition-all duration-500 group-hover:text-white group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>
          </div>
          <h3 className="text-base font-semibold text-center transition-all duration-300 group-hover:scale-105">
            {label}
          </h3>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-500 group-hover:opacity-100 rounded-xl group-hover:from-blue-500/20 group-hover:via-blue-500/10 group-hover:to-transparent"
          style={{
            background: `linear-gradient(to bottom right, ${accentColor}20, ${accentColor}00)`,
          }}
        />
      </div>
    </Link>
  )
}
