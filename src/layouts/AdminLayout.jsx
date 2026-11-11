import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sheet from "../components/ui/Sheet";
import useMediaQuery from "../hooks/useMediaQuery";
import Sidebar, { SidebarContent } from "./Sidebar";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // Topbar (rendered by each page) reads this through useOutletContext().
  const outletContext = useMemo(() => ({ openMenu }), [openMenu]);

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Outlet context={outletContext} />
      </div>
      <Sheet
        open={menuOpen && !isDesktop}
        onClose={closeMenu}
        placement="left"
        label="Menú de navegación"
        className="bg-teal-700 text-white"
      >
        <SidebarContent onNavigate={closeMenu} onClose={closeMenu} />
      </Sheet>
    </div>
  );
}
