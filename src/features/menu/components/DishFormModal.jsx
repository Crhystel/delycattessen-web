import { useState } from "react";
import { Upload, UtensilsCrossed } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input, Textarea } from "../../../components/ui/Field";
import { useToast } from "../../../hooks/useToast";
import IngredientAllergenFields from "../../catalog/components/IngredientAllergenFields";
import {
  EMPTY_DISH_FORM,
  validateDish,
  dishToForm,
  formToDishPayload,
} from "../dishForm";

// Mount only while open (fresh `key` per opening) so its state starts from
// `dish` (edit) or an empty form (create).
export default function DishFormModal({ dish, catalog, onSave, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(() =>
    dish ? dishToForm(dish) : EMPTY_DISH_FORM,
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const selection = catalog.resolveSelection(form.ingredients);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateDish(form, Boolean(dish));
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (selection.pending.length > 0) {
      toast.error(
        "Faltan alérgenos por confirmar",
        `Revisa: ${selection.pending.map((i) => i.name).join(", ")}`,
      );
      return;
    }

    setIsSaving(true);
    const saved = await onSave(formToDishPayload(form, selection.ids), dish?.id);
    setIsSaving(false);
    if (saved) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={dish ? "Editar platillo" : "Nuevo platillo del Menú Mensual"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex flex-col items-end gap-1">
            {selection.pending.length > 0 && (
              <p className="text-xs text-danger-600">
                Falta confirmar alérgenos de:{" "}
                {selection.pending.map((i) => i.name).join(", ")}
              </p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSaving || selection.pending.length > 0}
            >
              {dish ? "Guardar cambios" : "Crear platillo"}
            </Button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre del platillo">
          <Input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ej. Almuerzo Ejecutivo"
          />
          {errors.name && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.name}</p>
          )}
        </Field>

        <Field label="Descripción">
          <Textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Breve descripción del platillo..."
          />
          {errors.description && (
            <p className="text-xs text-danger-600 mt-1.5">
              {errors.description}
            </p>
          )}
        </Field>

        <Field label="Precio (USD)">
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.price}</p>
          )}
        </Field>

        <Field label="Imagen del platillo">
          <div className="flex items-center gap-3">
            {form.image ? (
              <img
                src={form.image}
                alt="Vista previa"
                className="w-12 h-12 rounded-lg object-cover border border-ink-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-ink-100 text-ink-400 flex items-center justify-center shrink-0">
                <UtensilsCrossed size={20} />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
              <Upload size={15} />
              Subir imagen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </label>
          </div>
          {errors.image && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.image}</p>
          )}
        </Field>

        <IngredientAllergenFields
          value={form.ingredients}
          onChange={(names) => updateField("ingredients", names)}
          error={errors.ingredients}
          catalog={catalog}
          selected={selection.selected}
        />
      </form>
    </Modal>
  );
}
