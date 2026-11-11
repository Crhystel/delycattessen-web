import { Search } from 'lucide-react'

// Full width on phones, a fixed 18rem field from `sm`.
export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-base sm:text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
      />
    </div>
  )
}
