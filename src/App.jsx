import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminLayout from './layouts/AdminLayout'
import PosLayout from './layouts/PosLayout'
import Dashboard from './pages/admin/Dashboard'
import Productos from './pages/admin/Productos'
import Menu from './pages/admin/Menu'
import ReporteDocentes from './pages/admin/ReporteDocentes'
import Identificacion from './pages/pos/Identificacion'
import Venta from './pages/pos/Venta'
import Confirmacion from './pages/pos/Confirmacion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="menu" element={<Menu />} />
          <Route path="docentes" element={<ReporteDocentes />} />
        </Route>

        <Route path="/pos" element={<PosLayout />}>
          <Route index element={<Navigate to="identificacion" replace />} />
          <Route path="identificacion" element={<Identificacion />} />
          <Route path="venta" element={<Venta />} />
          <Route path="confirmacion" element={<Confirmacion />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
