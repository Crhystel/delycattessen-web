import { Pencil, Trash2 } from 'lucide-react'

// Edit / delete icon buttons of a list row. Touch-sized (40px) on phones, where
// DataTable shows cards, and compact (32px) from `md`. `label` names the item
// for screen readers ("producto", "descuento"...).
export default function RowIconActions({ onEdit, onDelete, label }) {
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Editar ${label}`}
        className="w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Eliminar ${label}`}
        className="w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
