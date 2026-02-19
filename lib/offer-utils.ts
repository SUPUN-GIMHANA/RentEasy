export interface StoredOffer {
  id: string
  title: string
  description: string
  discountPercentage: number
  validFrom: string
  validTo: string
  applicableItems: string[]
  createdAt: string
  status?: string
}

const toIsoDay = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export const getStoredOffers = (): StoredOffer[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = JSON.parse(localStorage.getItem("offers") || "[]")
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export const getActiveOfferForItem = (itemId: string, offers: StoredOffer[], now = new Date()) => {
  const today = toIsoDay(now)

  return offers
    .filter((offer) => {
      const status = (offer.status || "active").toLowerCase()
      if (status !== "active") {
        return false
      }

      if (!offer.applicableItems?.includes(itemId)) {
        return false
      }

      if (offer.validFrom && today < offer.validFrom) {
        return false
      }

      if (offer.validTo && today > offer.validTo) {
        return false
      }

      return true
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
}
