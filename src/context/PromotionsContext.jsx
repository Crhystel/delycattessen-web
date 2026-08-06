import { createContext, useContext, useState } from 'react'
import { promotions as initialPromotions } from '../data/mockData'

export const TODAY = new Date('2026-07-06')

export function pad2(n) {
  return String(n).padStart(2, '0')
}

// TODAY is built from an ISO string (UTC midnight); we use UTC getters so
// the date doesn't shift a day depending on the browser's timezone.
export function formatDateISO(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`
}

export function addDays(date, days) {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

// Once endDate passes, the promotion automatically becomes "Vencida": no
// manual status is stored anywhere, it's always derived from the date.
export function calculatePromoStatus(promo) {
  return new Date(promo.endDate) < TODAY ? 'Vencida' : 'Activa'
}

export function activePromoFor(productId, promotions, excludeId) {
  return promotions.find(
    (p) => p.id !== excludeId && p.products.includes(productId) && calculatePromoStatus(p) === 'Activa'
  )
}

const PromotionsContext = createContext(null)

export function PromotionsProvider({ children }) {
  const [promotions, setPromotions] = useState(initialPromotions)

  return (
    <PromotionsContext.Provider value={{ promotions, setPromotions }}>
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext)
  if (!ctx) throw new Error('usePromotions must be used within PromotionsProvider')
  return ctx
}
