import { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { EMPTY_STAFF_FORM } from "../staffForm";
import CredentialsPanel from "./CredentialsPanel";
import StaffFields from "./StaffFields";

// Rendered only while open, so the form starts empty every time.
// After a successful creation it shows the temporary credentials.
export default function CreateStaffModal({ role, onCreate, onClose }) {
  const [form, setForm] = useState(EMPTY_STAFF_FORM);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [credentials, setCredentials] = useState(null);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "email") setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim())
      return;
    setCreating(true);
    setError("");
    const result = await onCreate(form, role);
    setCreating(false);
    if (result.error) setError(result.error);
    else setCredentials(result.credentials);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={
        role === "TEACHER"
          ? "Nuevo usuario de crédito"
          : "Nuevo cajero / personal operativo"
      }
      footer={
        credentials ? (
          <Button onClick={onClose}>Listo</Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={creating}>
              {creating ? "Creando..." : "Crear cuenta"}
            </Button>
          </>
        )
      }
    >
      {credentials ? (
        <CredentialsPanel
          email={credentials.email}
          password={credentials.password}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <StaffFields
            form={form}
            onChange={handleChange}
            error={error}
            withPlaceholders
          />
        </form>
      )}
    </Modal>
  );
}
