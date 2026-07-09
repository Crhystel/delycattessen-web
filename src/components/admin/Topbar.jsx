import { Building2 } from 'lucide-react'
import { useInstitucion } from '../../context/InstitucionContext'

export default function Topbar({ title, subtitle }) {
  const { institucionSeleccionada: selected } = useInstitucion()

  return (
    <header className="h-16 bg-white border-b border-ink-100 px-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="font-display font-bold text-lg text-ink-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-ink-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 bg-ink-50">
          <Building2 size={15} className="text-ink-300" />
          {selected.nombre}
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-ink-100">
          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-semibold flex items-center justify-center text-sm">
            MV
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-ink-900">María Vega</p>
            <p className="text-xs text-ink-500">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  )
}
