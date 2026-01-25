"use client"

import Link from "next/link"
import { Package, Facebook, Twitter, Youtube } from "lucide-react"
import { FaTiktok } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-[#0D3B8E] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-8">
          {/* More from RentHub */}
          <div>
            <h3 className="font-semibold text-base mb-4">More from RentHub</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  List Your Items
                </Link>
              </li>
              <li>
                <Link href="/admin/commercial" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Commercial Ads
                </Link>
              </li>
              <li>
                <Link href="/admin/boost" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Boost Your Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-base mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety-guidelines" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* About RentHub */}
          <div>
            <h3 className="font-semibold text-base mb-4">About RentHub</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog & Guides */}
          <div>
            <h3 className="font-semibold text-base mb-4">Blog & Guides</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link href="/blog" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Official Blog
                </Link>
              </li>
              <li>
                <Link href="/rental-guides" className="hover:text-[#0EA5E9] transition-colors duration-200">
                  Rental Guides
                </Link>
              </li>
            </ul>
            <div className="flex space-x-4 text-lg">
              <a href="#" className="hover:text-[#0EA5E9] transition-colors duration-200" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors duration-200" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors duration-200" aria-label="TikTok">
                <FaTiktok className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors duration-200" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* App Download */}
          <div>
            <h3 className="font-semibold text-base mb-4">Download our app</h3>
            <div className="flex flex-col space-y-3 mb-6">
              <a href="#" className="transition-transform duration-200 hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </a>
              <a href="#" className="transition-transform duration-200 hover:scale-105">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-10"
                />
              </a>
            </div>
            <h3 className="font-semibold text-sm mb-2">Other countries</h3>
            <a href="#" className="flex items-center gap-2 text-sm hover:text-[#0EA5E9] transition-colors duration-200">
              <span className="h-3 w-3 bg-green-600 rounded-full"></span> Poland
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span className="font-bold">RentHub</span>
            </div>
            <p className="text-white/80">© 2026 RentHub Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
