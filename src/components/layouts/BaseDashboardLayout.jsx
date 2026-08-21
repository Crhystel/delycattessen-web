import React from 'react';
import { Link } from 'react-router-dom';

const BaseDashboardLayout = ({ children, userName }) => {
  // Renderiza el cascarón principal del dashboard administrativo
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Inmutable */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-orange-500">D'Elycattessen</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 transition">
            Products
          </Link>
          <Link to="/admin/orders" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            Pre-Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar Inmutable */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Hello, {userName}</span>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
              {userName ? userName.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Zona dinámica (Template Method) */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseDashboardLayout;
