import { useState } from "react";
import { Upload, X as XIcon, RefreshCw } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input } from "../../../components/ui/Field";
import { isImageSource } from "../../../lib/images";
import { activePromoFor } from "../../../lib/promoRules";
import { EMPTY_PROMO_FORM, promoToForm } from "../promoForm";

// Mount only while open (fresh `key` per opening) so its state starts from
// `promo` (edit) or an empty form (create).
// `promotions` are all current promos (to detect a product already promoted);
// `products` are the products a promotion can apply to.
export default function PromotionFormModal({
  promo,
  promotions,
  products,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(() =>
    promo ? promoToForm(promo) : EMPTY_PROMO_FORM,
  );
  const [error, setError] = useState("");

  const hasActivePromo = (productId) =>
    Boolean(activePromoFor(productId, promotions, promo?.id));

  function toggleProduct(productId) {
    const alreadyChosen = form.products.includes(productId);
    if (!alreadyChosen && hasActivePromo(productId)) {
      setError(
        "Ese producto ya tiene una promoción activa. Espera a que venza o elige otro producto.",
      );
      return;
    }
    setError("");
    setForm((prev) => ({
      ...prev,
      products: alreadyChosen
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId],
    }));
  }

  function selectAllAvailable() {
    setError("");
    const available = products
      .filter((p) => !hasActivePromo(p.id))
      .map((p) => p.id);
    setForm((prev) => ({ ...prev, products: available }));
  }

  function clearAll() {
    setError("");
    setForm((prev) => ({ ...prev, products: [] }));
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.products.length === 0) {
      setError("Selecciona al menos un producto para la promoción.");
      return;
    }
    if (form.products.some(hasActivePromo)) {
      setError("Uno de los productos elegidos ya tiene una promoción activa.");
      return;
    }
    if (!form.discount || Number(form.discount) <= 0) {
      setError("Ingresa un porcentaje de descuento válido.");
      return;
    }
    onSave({ ...form, discount: Number(form.discount) || 0 }, promo?.id);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={promo ? "Editar promoción" : "Nueva promoción"}
      width="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {promo ? "Guardar cambios" : "Crear promoción"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="Productos en promoción"
          hint="Puedes aplicar la promoción a uno, varios o todos los productos del catálogo. Un producto no puede tener dos promociones activas a la vez."
        >
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={form.products.length > 0 ? clearAll : selectAllAvailable}
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              {form.products.length > 0
                ? "Quitar todos"
                : "Seleccionar todos los disponibles"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {products.map((p) => {
              const active = form.products.includes(p.id);
              const blocked = !active && hasActivePromo(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={blocked}
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-teal-500 bg-teal-50"
                      : blocked
                        ? "border-ink-100 bg-ink-50 opacity-50 cursor-not-allowed"
                        : "border-ink-100 hover:bg-ink-50"
                  }`}
                >
                  <span className="text-base">{p.image}</span>
                  <span className="text-xs font-medium text-ink-900 truncate">
                    {p.name}
                    {blocked && (
                      <span className="block text-[10px] text-ink-400">
                        Ya en otra promoción
                      </span>
                    )}
                  </span>
                  {active && (
                    <XIcon size={13} className="text-teal-600 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
          {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
        </Field>

        <Field label="Imagen de la promoción">
          <div className="flex items-center gap-3">
            {isImageSource(form.image) ? (
              <img
                src={form.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover border border-ink-100"
              />
            ) : (
              <span className="text-3xl">{form.image}</span>
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

        <div className="flex items-start gap-2.5 bg-ink-50 text-ink-500 text-xs rounded-xl px-3.5 py-3 mt-1">
          <RefreshCw size={14} className="shrink-0 mt-0.5" />
          Al llegar la fecha "Fin", el precio original del producto se
          restaura automáticamente y queda disponible para una nueva promoción
        </div>
      </form>
    </Modal>
  );
}
