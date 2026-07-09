import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  GraduationCap,
  ChefHat,
  LogOut,
  Users,
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard', label: 'Analítica de Ventas', icon: LayoutDashboard },
  { to: '/admin/usuarios', label: 'Gestión de Usuarios', icon: Users },
  { to: '/admin/productos', label: 'Catálogo e Inventario', icon: UtensilsCrossed },
  { to: '/admin/menu', label: 'Menú y Promociones', icon: CalendarDays },
  { to: '/admin/docentes', label: 'Consumo Docentes', icon: GraduationCap },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-teal-700 text-white flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <ChefHat size={18} strokeWidth={2.4} className="text-ink-900" />
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-[15px]">D'Elycattessen</p>
          <p className="text-[11px] text-teal-100/70 -mt-0.5">Panel Administrativo</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scroll-soft">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-teal-100/60 mb-2">
          Gestión
        </p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-teal-50 hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-teal-50 hover:bg-white/10 transition-colors"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Cerrar sesión
        </NavLink>
      </div>
    </aside>
  )
}
