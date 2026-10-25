import { useState } from "react";
import { Upload, Minus, Plus, Package, UtensilsCrossed } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input } from "../../../components/ui/Field";
import { isImageSource } from "../../../lib/images";
import {
  emptyComboForm,
  comboToForm,
  regularPrice,
  validateCombo,
  formToComboPayload,
} from "../comboForm";

function ProductQuantity({ product, quantity, onChange }) {
  const chosen = quantity > 0;
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
        chosen ? "border-teal-500 bg-teal-50" : "border-ink-100"
      }`}
    >
      {isImageSource(product.image) ? (
        <img
          src={product.image}
          alt=""
          className="w-7 h-7 rounded-md object-cover shrink-0"
        />
      ) : (
        <UtensilsCrossed size={16} className="text-ink-400 shrink-0" />
      )}
      <span className="text-xs font-medium text-ink-900 truncate flex-1">
        {product.name}
        <span className="block text-[11px] text-ink-500">
          ${Number(product.price).toFixed(2)}
        </span>
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={!chosen}
          onClick={() => onChange(quantity - 1)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 disabled:opacity-30"
        >
          <Minus size={12} />
        </button>
        <span className="w-4 text-center text-xs font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(quantity + 1)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-teal-600 hover:bg-teal-100"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

// Rendered only while open, so its state starts from `combo` (edit) or an
// empty form (create) every time. `products` are the catalog products.
export default function ComboFormModal({ combo, products, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    combo ? comboToForm(combo) : emptyComboForm(),
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const normalPrice = regularPrice(form.items, products);
  const quantityOf = (productId) =>
    form.items.find((item) => item.productId === productId)?.quantity ?? 0;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function setQuantity(productId, quantity) {
    const others = form.items.filter((item) => item.productId !== productId);
    updateField(
      "items",
      quantity > 0 ? [...others, { productId, quantity }] : others,
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
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateCombo(form, Boolean(combo));
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSaving(true);
    const saved = await onSave(formToComboPayload(form), combo?.id);
    setIsSaving(false);
    if (saved) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={combo ? "Editar promoción" : "Nueva promoción (combo)"}
      width="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {combo ? "Guardar cambios" : "Crear promoción"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Nombre">
          <Input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ej. Combo sánduche de pollo + cola"
          />
          {errors.name && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.name}</p>
          )}
        </Field>

        <Field
          label="Productos del combo"
          hint="Elige los productos y cuántas unidades de cada uno incluye."
        >
          {products.length === 0 ? (
            <p className="text-xs text-ink-400 text-center py-4">
              No hay productos en el catálogo. Créalos en "Catálogo e
              Inventario".
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => (
                <ProductQuantity
                  key={p.id}
                  product={p}
                  quantity={quantityOf(p.id)}
                  onChange={(quantity) => setQuantity(p.id, quantity)}
                />
              ))}
            </div>
          )}
          {errors.items && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.items}</p>
          )}
        </Field>

        <Field label="Imagen (banner en la app)">
          <div className="flex items-center gap-3">
            {form.image ? (
              <img
                src={form.image}
                alt="Vista previa"
                className="w-20 h-12 rounded-lg object-cover border border-ink-100"
              />
            ) : (
              <div className="w-20 h-12 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Package size={20} />
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

        <div className="grid grid-cols-3 gap-4">
          <Field label="Precio del combo (USD)">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0.00"
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
        {(errors.price || errors.endDate) && (
          <p className="text-xs text-danger-600 -mt-2 mb-3">
            {errors.price || errors.endDate}
          </p>
        )}

        {form.items.length > 0 && (
          <div className="flex items-center justify-between bg-ink-50 text-xs rounded-xl px-3.5 py-3">
            <span className="text-ink-500">
              Precio de los productos por separado
            </span>
            <span>
              <span className="text-ink-300 line-through mr-2">
                ${normalPrice.toFixed(2)}
              </span>
              <span className="text-teal-700 font-semibold">
                ${Number(form.price || 0).toFixed(2)}
              </span>
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
}
