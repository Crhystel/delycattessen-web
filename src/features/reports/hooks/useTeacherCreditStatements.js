import { useCallback, useState } from "react";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import { sendTeacherCreditStatements } from "../services";

// "3 en camino · 1 ya enviado · 2 sin correo"
function summary({ queued, already_sent: alreadySent, without_email: noEmail }) {
  return [
    queued > 0 && `${queued} en camino`,
    alreadySent > 0 && `${alreadySent} ya enviado${alreadySent > 1 ? "s" : ""}`,
    noEmail > 0 && `${noEmail} sin correo`,
  ]
    .filter(Boolean)
    .join(" · ");
}

// Mails the credit statement of a closed month ("YYYY-MM") to the teachers of
// the selected institution. The server queues one email per teacher, so the
// result is "queued", not "delivered"; `onSent` lets the page refresh the
// report (each row shows its statement status).
export function useTeacherCreditStatements(month, onSent) {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();
  const [sending, setSending] = useState(false);

  const sendStatements = useCallback(
    async ({ resend }) => {
      setSending(true);
      try {
        const result = await sendTeacherCreditStatements(selectedInstitution, {
          month,
          resend,
        });
        const notify = result.queued > 0 ? toast.success : toast.info;
        notify("Estados de cuenta", summary(result));
        onSent();
        return true;
      } catch (err) {
        toast.error("No se pudieron enviar los estados de cuenta", err.message);
        return false;
      } finally {
        setSending(false);
      }
    },
    [selectedInstitution, month, onSent, toast],
  );

  return { sendStatements, sending };
}
