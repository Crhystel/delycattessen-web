import { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { fullName } from "../staffForm";

export default function DeleteStaffModal({ member, onDelete, onClose }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const deleted = await onDelete(member);
    setDeleting(false);
    if (deleted) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Eliminar cuenta"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-700">
        ¿Eliminar la cuenta de{" "}
        <span className="font-semibold">{fullName(member)}</span>? Dejará de
        poder iniciar sesión y su correo quedará libre. Se conserva su
        historial de ventas. Esta acción no se puede deshacer.
      </p>
    </Modal>
  );
}
