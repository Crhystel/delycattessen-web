import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { formatAmount } from "../reportUtils";

const MAILED = ["QUEUED", "SENT"];

// Confirmation before mailing the statements: lists exactly who will receive
// one (a FAILED statement counts as pending), who already did and how many
// teachers have no email. Rendered only while open, so it always starts clean.
export default function SendStatementsModal({ onClose, onConfirm, report, sending }) {
  const [resend, setResend] = useState(false);
  const withEmail = report.teachers.filter((teacher) => teacher.email);
  const withoutEmail = report.teachers.length - withEmail.length;
  const isMailed = (teacher) => MAILED.includes(teacher.statementStatus);
  const recipients = resend ? withEmail : withEmail.filter((t) => !isMailed(t));
  const alreadyMailed = withEmail.filter(isMailed).length;

  return (
    <Modal
      open
      onClose={onClose}
      title="Enviar estado de cuenta"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(resend)}
            disabled={sending || recipients.length === 0}
          >
            {sending
              ? "Enviando…"
              : `Enviar a ${recipients.length} docente${recipients.length === 1 ? "" : "s"}`}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-700 mb-3">
        Cada docente recibirá por correo el estado de cuenta de{" "}
        <strong>{report.period}</strong> con su total a descontar y el detalle de
        sus consumos.
      </p>

      {recipients.length === 0 ? (
        <p className="text-sm text-ink-500 mb-3">
          No hay docentes pendientes de envío.
        </p>
      ) : (
        <ul className="max-h-56 overflow-y-auto divide-y divide-ink-100 border border-ink-100 rounded-xl mb-3">
          {recipients.map((teacher) => (
            <li
              key={teacher.key}
              className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
            >
              <span className="min-w-0">
                <span className="block font-medium text-ink-900 truncate">
                  {teacher.fullName}
                </span>
                <span className="block text-xs text-ink-500 truncate">
                  {teacher.email}
                </span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                {isMailed(teacher) && <Badge tone="warning">Reenvío</Badge>}
                <span className="font-semibold text-ink-900">
                  {formatAmount(teacher.total)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {alreadyMailed > 0 && (
        <label className="flex items-center gap-2 text-sm text-ink-700 mb-2">
          <input
            type="checkbox"
            checked={resend}
            onChange={(e) => setResend(e.target.checked)}
          />
          Incluir los {alreadyMailed} que ya se enviaron (reenviar)
        </label>
      )}
      {withoutEmail > 0 && (
        <p className="text-xs text-ink-500">
          {withoutEmail} docente{withoutEmail === 1 ? "" : "s"} sin correo no
          recibirán el estado de cuenta.
        </p>
      )}
    </Modal>
  );
}
