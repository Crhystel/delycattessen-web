import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ChefHat, LogOut } from "lucide-react";
import Button from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import PasswordInput from "../../components/ui/PasswordInput";
import { useAuth } from "../../context/AuthContext";
import { PASSWORD_HINT, useChangePassword } from "./hooks/useChangePassword";

// Forced step after a temporary password: the account cannot use the panel until it
// defines its own. ProtectedRoute sends it here; once the profile stops reporting the
// pending change, this page hands over to the dashboard.
export default function ChangePasswordPage() {
  const { mustChangePassword, logout } = useAuth();
  const { submit, submitting, error } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!mustChangePassword) return <Navigate to="/admin/dashboard" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    submit({ currentPassword, newPassword, confirmPassword });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl border border-ink-100 shadow-sm p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <ChefHat size={18} strokeWidth={2.4} className="text-ink-900" />
          </div>
          <span className="font-display font-bold text-lg text-ink-900">
            D'Elycattessen
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl text-ink-900">
          Cambia tu contraseña
        </h1>
        <p className="text-sm text-ink-500 mt-1.5 mb-6">
          Por seguridad, debes definir una contraseña propia antes de continuar.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {error}
          </div>
        )}

        <Field label="Contraseña temporal">
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="La que recibiste por correo"
            required
          />
        </Field>
        <Field label="Nueva contraseña" hint={PASSWORD_HINT}>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="Confirmar nueva contraseña">
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Guardando..." : "Guardar contraseña"}
        </Button>
        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
