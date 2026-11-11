import { useCallback, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

// Matches the server policy (PasswordPolicyValidator): the API stays the authority,
// this only saves a round trip for the obvious mistakes.
const POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, con una mayúscula, una minúscula, un número y un carácter especial.";

export function validatePasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  if (!currentPassword) return "Escribe la contraseña temporal.";
  if (!POLICY.test(newPassword)) return PASSWORD_HINT;
  if (newPassword === currentPassword)
    return "La nueva contraseña debe ser diferente a la temporal.";
  if (newPassword !== confirmPassword) return "Las contraseñas no coinciden.";
  return "";
}

// Own password change (the forced one after a temporary password included).
// Resolves to true when it worked; the page leaves once the profile reports
// that the change is no longer pending.
export function useChangePassword() {
  const { changePassword } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = useCallback(
    async (values) => {
      const problem = validatePasswordChange(values);
      if (problem) {
        setError(problem);
        return false;
      }
      setError("");
      setSubmitting(true);
      try {
        await changePassword(values);
        toast.success("Contraseña actualizada", "Ya puedes usar el panel.");
        return true;
      } catch (err) {
        setError(err.message || "No se pudo cambiar la contraseña.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [changePassword, toast],
  );

  return { submit, submitting, error };
}
