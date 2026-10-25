import { useState } from "react";
import { Upload, RefreshCw, Tag } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input } from "../../../components/ui/Field";
import { conflictingPromoFor } from "../../../lib/promoRules";
import {
  emptyPromotionForm,
  promotionToForm,
  validatePromotion,
  formToPromotionPayload,
} from "../promotionForm";
import DiscountProductOption from "./DiscountProductOption";

// Rendered only while open, so its state starts from `promo` (edit) or an
// empty form (create) every time.
// `promotions` are all current promos (to detect a product already promoted
// in the chosen dates); `products` are the catalog products it can apply to.
export default function PromotionFormModal({
  promo,
  promotions,
  products,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(() =>
    promo ? promotionToForm(promo) : emptyPromotionForm(),
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const isBlocked = (productId) =>
    !form.products.includes(productId) &&
    Boolean(conflictingPromoFor(productId, promotions, form, promo?.id));

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function toggleProduct(productId) {
    updateField(
      "products",
      form.products.includes(productId)
        ? form.products.filter((id) => id !== productId)
        : [...form.products, productId],
    );
  }

  function selectAllAvailable() {
    updateField(
      "products",
      products.filter((p) => !isBlocked(p.id)).map((p) => p.id),
    );
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validatePromotion(form, promotions, promo?.id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSaving(true);
    const saved = await onSave(formToPromotionPayload(form), promo?.id);
    setIsSaving(false);
    if (saved) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={promo ? "Editar descuento" : "Nuevo descuento"}
      width="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {promo ? "Guardar cambios" : "Crear descuento"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="Productos con descuento"
          hint="Puedes aplicar el descuento a uno, varios o todos los productos del catálogo. Un producto no puede tener dos descuentos en las mismas fechas."
        >
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={
                form.products.length > 0
                  ? () => updateField("products", [])
                  : selectAllAvailable
              }
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              {form.products.length > 0
                ? "Quitar todos"
                : "Seleccionar todos los disponibles"}
            </button>
          </div>
          {products.length === 0 ? (
            <p className="text-xs text-ink-400 text-center py-4">
              No hay productos en el catálogo. Créalos en "Catálogo e
              Inventario".
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => (
                <DiscountProductOption
                  key={p.id}
                  product={p}
                  discount={Number(form.discount)}
                  chosen={form.products.includes(p.id)}
                  blocked={isBlocked(p.id)}
                  onToggle={() => toggleProduct(p.id)}
                />
              ))}
            </div>
          )}
          {errors.products && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.products}</p>
          )}
        </Field>

        <Field label="Imagen del descuento">
          <div className="flex items-center gap-3">
            {form.image ? (
              <img
                src={form.image}
                alt="Vista previa"
                className="w-12 h-12 rounded-lg object-cover border border-ink-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Tag size={20} />
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
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Descuento (%)">
            <Input
              type="number"
              min="1"
              max="99"
              step="1"
              value={form.discount}
              onChange={(e) => updateField("discount", e.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Inicio">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </Field>
          <Field label="Fin">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </Field>
        </div>
        {(errors.discount || errors.endDate) && (
          <p className="text-xs text-danger-600 -mt-2 mb-3">
            {errors.discount || errors.endDate}
          </p>
        )}

        <div className="flex items-start gap-2.5 bg-ink-50 text-ink-500 text-xs rounded-xl px-3.5 py-3 mt-1">
          <RefreshCw size={14} className="shrink-0 mt-0.5" />
          Al pasar la fecha "Fin", el precio original del producto se restaura
          automáticamente y queda disponible para un nuevo descuento.
        </div>
      </form>
    </Modal>
  );
}
