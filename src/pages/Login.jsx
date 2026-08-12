import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import PasswordInput from "../components/ui/PasswordInput";

export default function Login() {
  const navigate = useNavigate();
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const [email, setEmail] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    clearSessionExpired();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-teal-700 text-white p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute right-16 top-16 w-40 h-40 rounded-full bg-brand-500/20" />
        <div className="absolute -left-16 bottom-24 w-72 h-72 rounded-full bg-secondary-500/15" />
        <div className="absolute left-24 bottom-8 w-32 h-32 rounded-full bg-brand-500/10" />
        <div className="absolute right-8 bottom-40 w-20 h-20 rounded-full bg-white/8" />
        <div className="absolute left-1/2 top-1/3 w-56 h-56 rounded-full bg-teal-600/30" />
        <div className="absolute -right-8 bottom-10 w-48 h-48 rounded-full bg-secondary-500/10" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center">
            <ChefHat size={22} strokeWidth={2.4} className="text-ink-900" />
          </div>
          <span className="font-display font-bold text-xl">D'Elycattessen</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display font-bold text-4xl leading-tight">
            Administra la alimentación escolar de forma simple y segura.
          </h1>
          <p className="text-teal-100/80 mt-4 text-[15px] leading-relaxed">
            Gestiona pagos, identifica estudiantes al instante y consulta
            información en tiempo real desde una sola plataforma.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
              <ChefHat size={18} strokeWidth={2.4} className="text-ink-900" />
            </div>
            <span className="font-display font-bold text-lg text-ink-900">
              D'Elycattessen
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl text-ink-900">
            Bienvenida de nuevo
          </h2>
          <p className="text-sm text-ink-500 mt-1.5 mb-6">
            Ingresa tus credenciales de administrador para acceder al panel.
          </p>

          {sessionExpired && !error && (
            <div className="mb-4 rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-600">
              Tu sesión expiró. Inicia sesión nuevamente para continuar.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">
              {error}
            </div>
          )}

          <Field label="Correo">
            <Input
              type="email"
              placeholder="nombre@delycattessen.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Contraseña">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          <div className="flex justify-end -mt-3 mb-4">
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-xs front-medium text-teal-600 hover:text-teal-700"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
        <ForgotPasswordModal
          open={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
        />
      </div>
    </div>
  );
}
