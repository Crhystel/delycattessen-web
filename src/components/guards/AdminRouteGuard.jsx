import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRouteGuard = ({ isAdmin }) => {
  // Verifica si el usuario actual tiene rol de administrador
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si es administrador, renderiza las vistas hijas
  return <Outlet />;
};

export default AdminRouteGuard;
