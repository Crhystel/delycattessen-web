import { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { staffToForm } from "../staffForm";
import StaffFields from "./StaffFields";

// Rendered only while open, with the member to edit.
export default function EditStaffModal({ member, onUpdate, onClose }) {
  const [form, setForm] = useState(() => staffToForm(member));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "email") setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await onUpdate(member.id, form);
    setSaving(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Editar personal operativo"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <StaffFields form={form} onChange={handleChange} error={error} />
      </form>
    </Modal>
  );
}
