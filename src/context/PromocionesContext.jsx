import { createContext, useContext, useState } from 'react'
import { promociones as promocionesIniciales } from '../data/mockData'

export const HOY = new Date('2026-07-06')

export function pad2(n) {
  return String(n).padStart(2, '0')
}

// HOY se construye a partir de un string ISO (medianoche UTC); usamos
// getters UTC para no correr la fecha un día según el huso horario del navegador.
export function formatFechaISO(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`
}

export function sumarDias(date, dias) {
  const copia = new Date(date)
  copia.setUTCDate(copia.getUTCDate() + dias)
  return copia
}

// Al vencer vigenciaFin, la promoción pasa a "Vencida" automáticamente: no
// se guarda un estado manual en ningún lado, se deriva siempre de la fecha.
export function calcularEstadoPromo(promo) {
  return new Date(promo.vigenciaFin) < HOY ? 'Vencida' : 'Activa'
}

export function promoActivaDe(productoId, promociones, excludeId) {
  return promociones.find(
    (p) => p.id !== excludeId && p.productos.includes(productoId) && calcularEstadoPromo(p) === 'Activa'
  )
}

const PromocionesContext = createContext(null)

export function PromocionesProvider({ children }) {
  const [promociones, setPromociones] = useState(promocionesIniciales)

  return (
    <PromocionesContext.Provider value={{ promociones, setPromociones }}>
      {children}
    </PromocionesContext.Provider>
  )
}

export function usePromociones() {
  const ctx = useContext(PromocionesContext)
  if (!ctx) throw new Error('usePromociones debe usarse dentro de PromocionesProvider')
  return ctx
}
