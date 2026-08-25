import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import { PromotionsProvider } from "./context/PromotionsContext";
import { IsAdmin } from "./lib/permissions";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ToastContainer from "./components/ui/ToastContainer";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Menu from "./pages/admin/Menu";
import TeacherConsumptionReport from "./pages/admin/TeacherConsumptionReport";
import ProductCreate from "./pages/admin/ProductCreate";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <InstitutionProvider>
          <PromotionsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute permission={new IsAdmin()}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="products" element={<Products />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="products/create" element={<ProductCreate />} />
                  <Route
                    path="teachers"
                    element={<TeacherConsumptionReport />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </PromotionsProvider>
        </InstitutionProvider>
      </AuthProvider>
      <ToastContainer />
    </ToastProvider>
  );
}
