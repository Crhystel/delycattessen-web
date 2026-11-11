import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${width} bg-white rounded-2xl shadow-xl max-h-[90dvh] flex flex-col`}>
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-ink-100">
          <h3 className="min-w-0 text-lg font-semibold text-ink-900 font-display">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-5 overflow-y-auto scroll-soft">{children}</div>
        {footer && (
          // Stacked full-width buttons on phones, a right-aligned row from `sm`.
          <div className="px-4 sm:px-6 py-4 border-t border-ink-100 flex flex-col-reverse gap-2 *:w-full sm:flex-row sm:justify-end sm:gap-3 sm:*:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
