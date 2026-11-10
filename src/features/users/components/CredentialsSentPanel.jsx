import { MailCheck, ShieldAlert } from "lucide-react";

// The temporary password is emailed by the backend and never shown here.
export default function CredentialsSentPanel({ email, emailSent }) {
  if (!emailSent) {
    return (
      <div className="flex items-start gap-2.5 bg-warning-50 text-warning-600 text-xs rounded-xl px-3.5 py-3">
        <ShieldAlert size={16} className="shrink-0 mt-0.5" />
        <p>
          La cuenta de <strong>{email}</strong> se creó, pero no se pudo enviar
          el correo con la contraseña temporal. El usuario puede usar
          «¿Olvidaste tu contraseña?» para definir una, o puedes eliminar la
          cuenta pendiente y crearla de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 bg-success-50 text-success-600 text-sm rounded-xl px-3.5 py-3">
      <MailCheck size={18} className="shrink-0 mt-0.5" />
      <div>
        <p>
          Enviamos las credenciales de acceso a <strong>{email}</strong>.
        </p>
        <p className="text-xs mt-1.5">
          La contraseña es temporal: el usuario deberá cambiarla
          obligatoriamente en su primer inicio de sesión.
        </p>
      </div>
    </div>
  );
}
