import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import { PromotionsProvider } from "./context/PromotionsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import ProductCreateView from "./views/admin/ProductCreateView";
import Menu from "./pages/admin/Menu";
import TeacherConsumptionReport from "./pages/admin/TeacherConsumptionReport";

export default function App() {
  return (
    <AuthProvider>
      <InstitutionProvider>
        <PromotionsProvider>
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
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="products/create" element={<ProductCreateView />} />
                <Route path="menu" element={<Menu />} />
                <Route path="teachers" element={<TeacherConsumptionReport />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PromotionsProvider>
      </InstitutionProvider>
    </AuthProvider>
  );
}
