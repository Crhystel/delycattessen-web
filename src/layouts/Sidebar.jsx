import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  GraduationCap,
  ChefHat,
  LogOut,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Links grouped by what they are for. Analítica de Ventas is the home page
// (`/admin` and the login both redirect to it), so it comes first.
const SECTIONS = [
  {
    title: 'Principal',
    links: [
      { to: '/admin/dashboard', label: 'Analítica de Ventas', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Catálogo y menú',
    links: [
      { to: '/admin/products', label: 'Catálogo e Inventario', icon: UtensilsCrossed },
      { to: '/admin/menu', label: 'Menú y Promociones', icon: CalendarDays },
    ],
  },
  {
    title: 'Usuarios y consumo',
    links: [
      { to: '/admin/users', label: 'Gestión de Usuarios', icon: Users },
      { to: '/admin/teachers', label: 'Consumo Docentes', icon: GraduationCap },
    ],
  },
]

// Navigation shared by the fixed desktop sidebar and the mobile drawer.
// `onNavigate` runs after choosing a link (the drawer closes itself with it);
// `onClose` shows the close button, which only the drawer needs.
export function SidebarContent({ onNavigate, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    onNavigate?.()
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0 border-b border-white/10">
        <Link
          to="/admin/dashboard"
          onClick={onNavigate}
          aria-label="Ir a Analítica de Ventas"
          className="flex items-center gap-2.5 min-w-0 flex-1"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
            <ChefHat size={18} strokeWidth={2.4} className="text-ink-900" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-display font-bold text-[15px]">D'Elycattessen</p>
            <p className="text-[11px] text-teal-100/70 -mt-0.5">Panel Administrativo</p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-teal-50 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto scroll-soft">
        {SECTIONS.map(({ title, links }) => (
          <div key={title} className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-teal-100/60 mb-2">
              {title}
            </p>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-teal-50 hover:bg-white/10'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2.2} className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-teal-50 hover:bg-white/10 transition-colors"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// Fixed sidebar for wide screens; below `lg` AdminLayout shows the drawer instead.
export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0 bg-teal-700 text-white h-screen sticky top-0">
      <SidebarContent />
    </aside>
  )
}
