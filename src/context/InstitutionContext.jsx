import { createContext, useContext, useState } from 'react'
import { instituciones } from '../data/mockData'

const InstitucionContext = createContext(null)

export function InstitucionProvider({ children }) {
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState(instituciones[0])

  return (
    <InstitucionContext.Provider value={{ institucionSeleccionada, setInstitucionSeleccionada }}>
      {children}
    </InstitucionContext.Provider>
  )
}

export function useInstitucion() {
  const ctx = useContext(InstitucionContext)
  if (!ctx) throw new Error('useInstitucion debe usarse dentro de InstitucionProvider')
  return ctx
}
