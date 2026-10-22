import { useEffect, useRef, useState } from 'react'
import { X, PlusCircle } from 'lucide-react'

// Ingredients combobox: suggests matches from the master catalog
// (synced via API with the allergen validation system) so each
// ingredient always keeps the same name/format. If it doesn't exist,
// it can be added as a new catalog ingredient.
export default function IngredientsInput({ value, catalog, onChange, onNewIngredient }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchTerm = draft.trim().toLowerCase()
  const suggestions = searchTerm
    ? catalog
        .filter(
          (i) => i.toLowerCase().includes(searchTerm) && !value.some((v) => v.toLowerCase() === i.toLowerCase())
        )
        .slice(0, 6)
    : []
  const exactMatch = catalog.some((i) => i.toLowerCase() === searchTerm)
  const canCreate = searchTerm.length > 0 && !exactMatch
  const options = canCreate ? [...suggestions, { isNew: true, text: draft.trim() }] : suggestions

  function selectOption(option) {
    const name = typeof option === 'string' ? option : option.text
    const trimmed = name.trim()
    if (!trimmed) return
    const alreadyExists = value.some((i) => i.toLowerCase() === trimmed.toLowerCase())
    if (!alreadyExists) {
      onChange([...value, trimmed])
      if (typeof option !== 'string') onNewIngredient(trimmed)
    }
    setDraft('')
    setActiveIndex(0)
    setOpen(false)
  }

  function remove(index) {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (options.length > 0) setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (options[activeIndex]) selectOption(options[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      remove(value.length - 1)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="rounded-xl border border-ink-100 px-3 py-2.5 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50 transition">
        <div className="flex flex-wrap items-center gap-1.5">
          {value.map((ingredient, i) => (
            <span
              key={`${ingredient}-${i}`}
              className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full pl-2.5 pr-1.5 py-1"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => remove(i)}
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
              setActiveIndex(0)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length ? 'Agregar otro...' : 'Buscar ingrediente del catálogo...'}
            className="flex-1 min-w-[160px] outline-none text-sm text-ink-900 placeholder:text-ink-300 py-0.5"
          />
        </div>
      </div>

      {open && options.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-ink-100 rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((option, i) => {
            const isNew = typeof option !== 'string'
            return (
              <button
                key={isNew ? `new-${option.text}` : option}
                type="button"
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                  i === activeIndex ? 'bg-teal-50 text-teal-700' : 'text-ink-700'
                }`}
              >
                {isNew ? (
                  <>
                    <PlusCircle size={14} className="shrink-0" />
                    Agregar «{option.text}» como nuevo ingrediente
                  </>
                ) : (
                  option
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
