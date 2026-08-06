import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import { InstitutionProvider } from '../context/InstitutionContext'
import { PromotionsProvider } from '../context/PromotionsContext'

export default function AdminLayout() {
  return (
    <InstitutionProvider>
      <PromotionsProvider>
        <div className="flex min-h-screen bg-ink-50">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </PromotionsProvider>
    </InstitutionProvider>
  )
}
