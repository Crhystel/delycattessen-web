import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import {
  useInstitution,
  ALL_INSTITUTIONS,
} from "../../context/InstitutionContext";

export default function Topbar({ title, subtitle }) {
  const {
    institutions,
    ownInstitution,
    selectedInstitution,
    setSelectedInstitution,
    selectedInstitutionName,
  } = useInstitution();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function seleccionar(valor) {
    setSelectedInstitution(valor);
    setOpen(false);
  }

  return (
    <header className="h-16 bg-white border-b border-ink-100 px-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="font-display font-bold text-lg text-ink-900 leading-none">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-ink-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 bg-ink-50 hover:bg-ink-100 transition-colors"
          >
            <Building2 size={15} className="text-ink-300" />
            {selectedInstitutionName}
            <ChevronDown size={14} className="text-ink-300" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-ink-100 rounded-xl shadow-lg py-1.5 z-20">
              {ownInstitution && (
                <button
                  onClick={() => seleccionar(null)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                >
                  {ownInstitution.name}
                  {selectedInstitution === null && (
                    <Check size={14} className="text-teal-600" />
                  )}
                </button>
              )}

              <button
                onClick={() => seleccionar(ALL_INSTITUTIONS)}
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
                    onClick={() => seleccionar(inst.id)}
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

        <div className="flex items-center gap-2.5 pl-3 border-l border-ink-100">
          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-semibold flex items-center justify-center text-sm">
            MV
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-ink-900">María Vega</p>
            <p className="text-xs text-ink-500">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  );
}
