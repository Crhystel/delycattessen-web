import { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Field";
import CodeInput from "../ui/CodeInput";
import {
  requestPasswordReset,
  confirmPasswordReset,
} from "../../services/authService";
import PasswordInput from "../ui/PasswordInput";

export default function ForgotPasswordModal({ open, onClose }) {
  const [paso, setPaso] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function resetYCerrar() {
    setPaso(1);
    setEmail("");
    setToken("");
    setNewPassword("");
    setMensaje("");
    setError("");
    onClose();
  }

  async function handleSolicitar(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const data = await requestPasswordReset(email);
      setMensaje(data.mensaje);
      setPaso(2);
    } catch (err) {
      setError(err.message || "No se pudo procesar la solicitud.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleConfirmar(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      await confirmPasswordReset(email, token, newPassword, confirmPassword);
      setPaso(3);
    } catch (err) {
      setError(err.message || "No se pudo restablecer la contraseña.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={resetYCerrar}
      title="Recuperar contraseña"
      footer={
        paso === 3 ? (
          <Button onClick={resetYCerrar}>Iniciar sesión</Button>
        ) : (
          <>
            <Button variant="outline" onClick={resetYCerrar}>
              Cancelar
            </Button>
            <Button
              onClick={paso === 1 ? handleSolicitar : handleConfirmar}
              disabled={enviando}
            >
              {enviando
                ? "Procesando..."
                : paso === 1
                  ? "Enviar código"
                  : "Restablecer contraseña"}
            </Button>
          </>
        )
      }
    >
      {paso === 1 && (
        <form onSubmit={handleSolicitar}>
          <p className="text-sm text-ink-500 mb-4">
            Ingresa tu correo. Si existe una cuenta activa, se generará un
            código de verificación.
          </p>
          <Field label="Correo">
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="nombre@delycattessen.com"
              required
            />
            {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
          </Field>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={handleConfirmar}>
          {mensaje && (
            <div className="flex items-start gap-2.5 bg-teal-50 text-teal-700 text-xs rounded-xl px-3.5 py-3 mb-4">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>{mensaje}</p>
            </div>
          )}
          <Field label="Código de verificación">
            <div className="flex justify-center">
              <CodeInput
                value={token}
                onChange={(val) => {
                  setToken(val);
                  setError("");
                }}
              />
            </div>
          </Field>
          <Field label="Nueva contraseña">
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
          <Field label="Confirmar nueva contraseña">
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
        </form>
      )}

      {paso === 3 && (
        <p className="text-sm text-ink-700">
          Tu contraseña se restableció exitosamente. Ya puedes iniciar sesión
          con tu nueva contraseña.
        </p>
      )}
    </Modal>
  );
}
