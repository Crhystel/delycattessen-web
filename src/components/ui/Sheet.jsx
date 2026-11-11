import { useEffect } from 'react'

const PLACEMENTS = {
  // Off-canvas drawer (mobile navigation).
  left: 'inset-y-0 left-0 w-72 max-w-[85vw]',
  // Bottom sheet (details that live beside the content on wide screens).
  bottom: 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl overflow-y-auto scroll-soft',
}

// Overlay panel with backdrop. Closes with Escape or by tapping the backdrop and
// locks the page scroll while open. `className` sets the surface (background).
export default function Sheet({ open, onClose, placement = 'left', label, children, className = 'bg-white' }) {
  useEffect(() => {
    if (!open) return undefined
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`absolute flex flex-col shadow-xl ${PLACEMENTS[placement]} ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
