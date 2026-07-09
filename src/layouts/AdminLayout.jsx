import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import { InstitucionProvider } from '../context/InstitucionContext'
import { PromocionesProvider } from '../context/PromocionesContext'

export default function AdminLayout() {
  return (
    <InstitucionProvider>
      <PromocionesProvider>
        <div className="flex min-h-screen bg-ink-50">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </PromocionesProvider>
    </InstitucionProvider>
  )
}
