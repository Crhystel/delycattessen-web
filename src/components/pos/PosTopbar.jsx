import { NavLink, useLocation } from 'react-router-dom'
import { ArrowLeftRight, ScanFace } from 'lucide-react'

const steps = [
  { path: '/pos/identificacion', label: '1. Identificación' },
  { path: '/pos/venta', label: '2. Venta' },
  { path: '/pos/confirmacion', label: '3. Cobro' },
]

export default function PosTopbar() {
  const { pathname } = useLocation()
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path))

  return (
    <header className="h-16 bg-ink-900 text-white px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <ScanFace size={18} strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-[15px]">Punto de Venta</p>
          <p className="text-[11px] text-white/50 -mt-0.5">Martim Cereré · Caja 1</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1">
        {steps.map((step, i) => (
          <span
            key={step.path}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              i === currentIndex
                ? 'bg-brand-500 text-white'
                : i < currentIndex
                ? 'text-success-500'
                : 'text-white/40'
            }`}
          >
            {step.label}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-sm font-semibold">Emilio Guerrero</p>
          <p className="text-xs text-white/50">Personal Operativo</p>
        </div>
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-2 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2"
        >
          <ArrowLeftRight size={15} />
          Ir a Backoffice
        </NavLink>
      </div>
    </header>
  )
}
