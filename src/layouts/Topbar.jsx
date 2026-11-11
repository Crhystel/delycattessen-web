import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, ChevronDown, Check, Menu } from "lucide-react";
import { useInstitution } from "../context/InstitutionContext";
import { useAuth } from "../context/AuthContext";
import { ALL_INSTITUTIONS } from "../lib/institutions";

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth();
  // AdminLayout provides openMenu (the mobile drawer); absent outside the panel.
  const { openMenu } = useOutletContext() ?? {};
  const {
    institutions,
    ownInstitution,
    selectedInstitution,
    setSelectedInstitution,
    selectedInstitutionName,
  } = useInstitution();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const displayName = (() => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Administrador";
  })();

  const initials = (() => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "AD";
  })();

  const roleName = (() => {
    switch (user?.role) {
      case "ADMIN":
        return "Administrador";
      case "OPERATIONS_STAFF":
        return "Personal Operativo";
      case "PARENT":
        return "Padre de Familia";
      case "STUDENT":
        return "Estudiante";
      case "TEACHER":
        return "Docente";
      default:
        return user?.role || "Administrador";
    }
  })();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectInstitution(value) {
    setSelectedInstitution(value);
    setOpen(false);
  }

  return (
    <header className="min-h-16 bg-white border-b border-ink-100 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {openMenu && (
          <button
            type="button"
            onClick={openMenu}
            aria-label="Abrir menú"
            className="lg:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-ink-700 hover:bg-ink-100"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg text-ink-900 leading-none truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-ink-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={`Sede: ${selectedInstitutionName}`}
            className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 bg-ink-50 hover:bg-ink-100 transition-colors"
          >
            <Building2 size={15} className="text-ink-300" />
            <span className="hidden sm:inline">{selectedInstitutionName}</span>
            <ChevronDown size={14} className="text-ink-300" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-2rem))] bg-white border border-ink-100 rounded-xl shadow-lg py-1.5 z-20">
              {ownInstitution && (
                <button
                  onClick={() => selectInstitution(null)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                >
                  {ownInstitution.name}
                  {selectedInstitution === null && (
                    <Check size={14} className="text-teal-600" />
                  )}
                </button>
              )}

              <button
                onClick={() => selectInstitution(ALL_INSTITUTIONS)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
              >
                Todas las instituciones
                {selectedInstitution === ALL_INSTITUTIONS && (
                  <Check size={14} className="text-teal-600" />
                )}
              </button>

              <div className="border-t border-ink-100 my-1.5" />

              {institutions
                .filter((inst) => inst.id !== ownInstitution?.id)
                .map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => selectInstitution(inst.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    {inst.name}
                    {selectedInstitution === inst.id && (
                      <Check size={14} className="text-teal-600" />
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-ink-100">
          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-semibold flex items-center justify-center text-sm uppercase select-none">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-ink-900">{displayName}</p>
            <p className="text-xs text-ink-500">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
