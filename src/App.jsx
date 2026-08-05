import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InstitucionProvider } from "./context/InstitucionContext";
import { PromocionesProvider } from "./context/PromocionesContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
import Productos from "./pages/admin/Productos";
import Menu from "./pages/admin/Menu";
import ReporteDocentes from "./pages/admin/ReporteDocentes";

export default function App() {
  return (
    <AuthProvider>
      <InstitucionProvider>
        <PromocionesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="productos" element={<Productos />} />
                <Route path="menu" element={<Menu />} />
                <Route path="docentes" element={<ReporteDocentes />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PromocionesProvider>
      </InstitucionProvider>
    </AuthProvider>
  );
}
