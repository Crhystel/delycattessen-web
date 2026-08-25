import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
