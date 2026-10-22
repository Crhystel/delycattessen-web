import { useState } from "react";
import { ShieldAlert, Copy, Check } from "lucide-react";
import Button from "../../../components/ui/Button";

function PasswordNotice() {
  return (
    <div className="flex items-start gap-2.5 bg-warning-50 text-warning-600 text-xs rounded-xl px-3.5 py-3 mb-4">
      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
      <p>
        Esta contraseña es temporal: el usuario deberá cambiarla
        obligatoriamente en su primer inicio de sesión.
      </p>
    </div>
  );
}

export default function CredentialsPanel({ email, password }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(
      `Correo: ${email}\nContraseña temporal: ${password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <PasswordNotice />
      <div className="rounded-xl border border-ink-100 p-4 space-y-2 font-mono text-sm">
        <p>
          <span className="text-ink-500">Correo:</span> {email}
        </p>
        <p>
          <span className="text-ink-500">Contraseña:</span> {password}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        icon={copied ? Check : Copy}
        onClick={copy}
        className="w-full mt-3"
      >
        {copied ? "Copiado" : "Copiar credenciales"}
      </Button>
    </div>
  );
}
