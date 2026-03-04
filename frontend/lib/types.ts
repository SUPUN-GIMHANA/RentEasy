export interface Item {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  imageUrl: string
  additionalImages?: string[]
  available: boolean
  availableDates: string[]
  location?: string
  latitude?: number
  longitude?: number
  distanceKm?: number
  minimumRentalPeriod?: number
  maximumRentalPeriod?: number
  ownerPhoneNumber?: string
}

export interface Booking {
  id: string
  itemId: string
  itemName: string
  userId: string
  date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalPrice: number
  createdAt: string
}

export interface Feedback {
  id: string
  bookingId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}
