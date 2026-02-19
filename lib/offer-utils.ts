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

const GLOBAL_OFFERS_KEY = "offers"

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
    const globalRaw = JSON.parse(localStorage.getItem(GLOBAL_OFFERS_KEY) || "[]")
    const globalOffers = Array.isArray(globalRaw) ? globalRaw : []

    const scopedOffers: StoredOffer[] = []
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (!key || !key.startsWith("offers:")) {
        continue
      }

      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]")
        if (Array.isArray(parsed)) {
          scopedOffers.push(...parsed)
        }
      } catch {
      }
    }

    const merged = [...globalOffers, ...scopedOffers]
    const dedupedMap = new Map<string, StoredOffer>()
    for (const offer of merged) {
      if (!offer?.id) {
        continue
      }
      const existingOffer = dedupedMap.get(offer.id)
      if (!existingOffer || new Date(offer.createdAt || 0).getTime() > new Date(existingOffer.createdAt || 0).getTime()) {
        dedupedMap.set(offer.id, offer)
      }
    }

    return Array.from(dedupedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  } catch {
    return []
  }
}

export const saveStoredOffer = (offer: StoredOffer) => {
  if (typeof window === "undefined") {
    return
  }

  const existingOffers = getStoredOffers().filter((entry) => entry.id !== offer.id)
  localStorage.setItem(GLOBAL_OFFERS_KEY, JSON.stringify([offer, ...existingOffers]))
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
