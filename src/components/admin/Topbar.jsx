import { Bell, ChevronDown } from 'lucide-react'
import { instituciones } from '../../data/mockData'

export default function Topbar({ title, subtitle }) {
  return (
    <header className="h-16 bg-white border-b border-ink-100 px-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="font-display font-bold text-lg text-ink-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-ink-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 hover:bg-ink-50">
          {instituciones[0].nombre}
          <ChevronDown size={15} className="text-ink-300" />
        </button>

        <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-100">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-ink-100">
          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-semibold flex items-center justify-center text-sm">
            CV
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-ink-900">Crhystel Velasco</p>
            <p className="text-xs text-ink-500">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  )
}
