import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import { PromotionsProvider } from "./context/PromotionsContext";
import { IsAdmin } from "./lib/permissions";
import ToastContainer from "./components/ui/ToastContainer";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import UsersPage from "./features/users/UsersPage";
import ProductsPage from "./features/catalog/ProductsPage";
import MenuPage from "./features/menu/MenuPage";
import TeacherConsumptionReportPage from "./features/reports/TeacherConsumptionReportPage";

const adminPermission = new IsAdmin();

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <InstitutionProvider>
          <PromotionsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute permission={adminPermission}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="menu" element={<MenuPage />} />
                  <Route
                    path="teachers"
                    element={<TeacherConsumptionReportPage />}
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
