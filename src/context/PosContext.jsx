import { createContext, useContext, useMemo, useState } from 'react'
import { productos } from '../data/mockData'

const PosContext = createContext(null)

export function PosProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [cart, setCart] = useState([]) // [{ productId, qty }]
  const [paymentResult, setPaymentResult] = useState(null)

  function addToCart(productId) {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { productId, qty: 1 }]
    })
  }

  function decreaseFromCart(productId) {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    )
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }

  function resetSession() {
    setSelectedUser(null)
    setCart([])
    setPaymentResult(null)
  }

  const cartDetailed = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        product: productos.find((p) => p.id === item.productId),
      })),
    [cart]
  )

  const cartTotal = useMemo(
    () => cartDetailed.reduce((sum, i) => sum + (i.product?.precio || 0) * i.qty, 0),
    [cartDetailed]
  )

  // Cruce de carrito contra alergenos del usuario identificado (RF-02 / RF-06)
  const allergenConflicts = useMemo(() => {
    if (!selectedUser) return []
    const userAllergens = selectedUser.alergenos || []
    if (userAllergens.length === 0) return []
    const conflicts = new Set()
    cartDetailed.forEach(({ product }) => {
      product?.alergenos?.forEach((a) => {
        if (userAllergens.includes(a)) conflicts.add(`${product.nombre} · ${a}`)
      })
    })
    return Array.from(conflicts)
  }, [cartDetailed, selectedUser])

  // Validacion de control parental (RF-04): limite de gasto diario
  const parentalControlBlock = useMemo(() => {
    if (!selectedUser?.controlParental) return null
    const { limiteDiario } = selectedUser.controlParental
    const proyectado = (selectedUser.gastoHoy || 0) + cartTotal
    if (proyectado > limiteDiario) {
      return {
        limiteDiario,
        proyectado: Number(proyectado.toFixed(2)),
      }
    }
    return null
  }, [selectedUser, cartTotal])

  const value = {
    selectedUser,
    setSelectedUser,
    cart,
    cartDetailed,
    cartTotal,
    addToCart,
    decreaseFromCart,
    removeFromCart,
    resetSession,
    allergenConflicts,
    parentalControlBlock,
    paymentResult,
    setPaymentResult,
  }

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}

export function usePos() {
  const ctx = useContext(PosContext)
  if (!ctx) throw new Error('usePos debe usarse dentro de PosProvider')
  return ctx
}
