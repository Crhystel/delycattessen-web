import { Outlet } from 'react-router-dom'
import PosTopbar from '../components/pos/PosTopbar'
import { PosProvider } from '../context/PosContext'

export default function PosLayout() {
  return (
    <PosProvider>
      <div className="min-h-screen flex flex-col bg-ink-50">
        <PosTopbar />
        <Outlet />
      </div>
    </PosProvider>
  )
}
