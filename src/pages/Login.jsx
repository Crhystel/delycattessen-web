import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, ShieldCheck, ScanFace, LayoutDashboard } from "lucide-react";
import Button from "../components/ui/Button";
import { Field, Input, Select } from "../components/ui/Field";
import { instituciones } from "../data/mockData";

const roles = [
  {
    id: "admin",
    label: "Administrador",
    desc: "Catálogo, menús, inventario y analítica",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
  },
  {
    id: "pos",
    label: "Personal Operativo",
    desc: "Punto de venta y despacho",
    icon: ScanFace,
    to: "/pos/identificacion",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");

  function handleSubmit(e) {
    e.preventDefault();
    const target = roles.find((r) => r.id === role)?.to || "/admin/dashboard";
    navigate(target);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="hidden lg:flex flex-col justify-between bg-teal-700 text-white p-12 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-10 w-64 h-64 rounded-full bg-brand-500/10" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center">
            <ChefHat size={22} strokeWidth={2.4} />
          </div>
          <span className="font-display font-bold text-xl">D'Elycattessen</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display font-bold text-4xl leading-tight">
            Gestión alimentaria escolar, sin filas ni cuadernos.
          </h1>
          <p className="text-teal-100/80 mt-4 text-[15px] leading-relaxed">
            Billetera digital, identificación ágil en el punto de venta y
            analítica de ventas en una sola plataforma para Martim Cereré y El
            Sauce School.
          </p>
        </div>
      </div>

      {/* Panel de acceso */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
              <ChefHat size={18} strokeWidth={2.4} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-ink-900">
              D'Elycattessen
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl text-ink-900">
            Bienvenida de nuevo
          </h2>
          <p className="text-sm text-ink-500 mt-1.5 mb-6">
            Prototipo de alta fidelidad · selecciona un perfil para explorar el
            flujo.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={`text-left rounded-xl border p-3.5 transition-colors ${
                  role === id
                    ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                    : "border-ink-100 hover:bg-ink-50"
                }`}
              >
                <Icon
                  size={18}
                  className={role === id ? "text-brand-600" : "text-ink-500"}
                />
                <p className="text-sm font-semibold text-ink-900 mt-2 leading-tight">
                  {label}
                </p>
                <p className="text-xs text-ink-500 mt-0.5 leading-snug">
                  {desc}
                </p>
              </button>
            ))}
          </div>

          <Field label="Institución">
            <Select defaultValue={instituciones[0].id}>
              {instituciones.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Correo institucional">
            <Input
              type="email"
              placeholder="nombre@delycattessen.com"
              defaultValue="admin@delycattessen.com"
            />
          </Field>

          <Field label="Contraseña">
            <Input
              type="password"
              placeholder="••••••••"
              defaultValue="••••••••"
            />
          </Field>

          <Button type="submit" className="w-full mt-2" size="lg">
            Iniciar sesión
          </Button>

          <p className="text-xs text-ink-300 text-center mt-5">
            Prototipo funcional sin conexión a datos reales — solo navegación.
          </p>
        </form>
      </div>
    </div>
  );
}
