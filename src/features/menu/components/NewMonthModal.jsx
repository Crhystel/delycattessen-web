import { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input } from "../../../components/ui/Field";

// Only picks the month; the planning itself happens in the main view.
// Rendered only while open, so the field starts empty every time.
export default function NewMonthModal({ onCreate, onClose }) {
  const [month, setMonth] = useState(""); // 'YYYY-MM'
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!month) return;
    const result = await onCreate(month);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Nuevo menú mensual"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!month}>
            Crear borrador
          </Button>
        </>
      }
    >
      <Field label="Mes a planificar">
        <Input
          type="month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setError("");
          }}
        />
      </Field>
      {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
    </Modal>
  );
}
