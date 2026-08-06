import { useEffect, useRef, useState } from 'react'
import { X, PlusCircle } from 'lucide-react'

// Combobox de ingredientes: sugiere coincidencias del catálogo maestro
// (sincronizado por API con el sistema de alérgenos) para que cada
// ingrediente quede siempre con el mismo nombre/formato. Si no existe,
// permite darlo de alta como nuevo ingrediente del catálogo.
export default function IngredientesInput({ value, catalogo, onChange, onNuevoIngrediente }) {
  const [draft, setDraft] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [indiceActivo, setIndiceActivo] = useState(0)
  const contenedorRef = useRef(null)

  useEffect(() => {
    function handleClickFuera(e) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const termino = draft.trim().toLowerCase()
  const sugerencias = termino
    ? catalogo
        .filter(
          (i) => i.toLowerCase().includes(termino) && !value.some((v) => v.toLowerCase() === i.toLowerCase())
        )
        .slice(0, 6)
    : []
  const coincideExacto = catalogo.some((i) => i.toLowerCase() === termino)
  const puedeCrear = termino.length > 0 && !coincideExacto
  const opciones = puedeCrear ? [...sugerencias, { nuevo: true, texto: draft.trim() }] : sugerencias

  function elegir(opcion) {
    const nombre = typeof opcion === 'string' ? opcion : opcion.texto
    const limpio = nombre.trim()
    if (!limpio) return
    const yaExiste = value.some((i) => i.toLowerCase() === limpio.toLowerCase())
    if (!yaExiste) {
      onChange([...value, limpio])
      if (typeof opcion !== 'string') onNuevoIngrediente(limpio)
    }
    setDraft('')
    setIndiceActivo(0)
    setAbierto(false)
  }

  function quitar(index) {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (opciones.length > 0) setIndiceActivo((i) => Math.min(i + 1, opciones.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceActivo((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (opciones[indiceActivo]) elegir(opciones[indiceActivo])
    } else if (e.key === 'Escape') {
      setAbierto(false)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      quitar(value.length - 1)
    }
  }

  return (
    <div className="relative" ref={contenedorRef}>
      <div className="rounded-xl border border-ink-100 px-3 py-2.5 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50 transition">
        <div className="flex flex-wrap items-center gap-1.5">
          {value.map((ingrediente, i) => (
            <span
              key={`${ingrediente}-${i}`}
              className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full pl-2.5 pr-1.5 py-1"
            >
              {ingrediente}
              <button
                type="button"
                onClick={() => quitar(i)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-teal-100"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              setIndiceActivo(0)
              setAbierto(true)
            }}
            onFocus={() => setAbierto(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length ? 'Agregar otro...' : 'Buscar ingrediente del catálogo...'}
            className="flex-1 min-w-[160px] outline-none text-sm text-ink-900 placeholder:text-ink-300 py-0.5"
          />
        </div>
      </div>

      {abierto && opciones.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-ink-100 rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {opciones.map((opcion, i) => {
            const esNuevo = typeof opcion !== 'string'
            return (
              <button
                key={esNuevo ? `nuevo-${opcion.texto}` : opcion}
                type="button"
                onClick={() => elegir(opcion)}
                onMouseEnter={() => setIndiceActivo(i)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                  i === indiceActivo ? 'bg-teal-50 text-teal-700' : 'text-ink-700'
                }`}
              >
                {esNuevo ? (
                  <>
                    <PlusCircle size={14} className="shrink-0" />
                    Agregar «{opcion.texto}» como nuevo ingrediente
                  </>
                ) : (
                  opcion
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
