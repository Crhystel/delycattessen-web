import { useState } from "react";
import { Upload } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { Field, Input, Select, Textarea } from "../../../components/ui/Field";
import { useToast } from "../../../context/ToastContext";
import { isImageSource } from "../../../lib/images";
import IngredientAllergenFields from "./IngredientAllergenFields";

const CATEGORIES = ["Bar", "Almuerzo", "Snacks", "Bebidas", "Postres"];

const EMPTY_PRODUCT_FORM = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  ingredients: [],
  image: null,
  imageFile: null,
};

function validateProduct(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "El nombre del producto es obligatorio.";
  if (!form.description.trim())
    errors.description = "La descripción es obligatoria.";
  if (form.price === "" || Number(form.price) <= 0)
    errors.price = "Ingresa un precio válido.";
  if (form.stock === "" || Number(form.stock) < 0)
    errors.stock = "Ingresa el stock disponible.";
  if (form.ingredients.length === 0)
    errors.ingredients =
      "Debes declarar los ingredientes para validar alérgenos";
  return errors;
}

// API product -> editable form state.
function productToForm(product) {
  return {
    name: product.name,
    description: product.description,
    category: product.category || CATEGORIES[0],
    price: String(product.price),
    stock: String(product.stock),
    ingredients: product.ingredients.map((i) => i.name),
    image: product.image || null,
    imageFile: null,
  };
}

// Form state -> payload accepted by the catalog service.
function formToPayload(form, ingredientIds) {
  return {
    name: form.name,
    description: form.description,
    category: form.category,
    price: Number(form.price) || 0,
    stock: Number(form.stock) || 0,
    ingredients: ingredientIds,
    imageFile: form.imageFile,
  };
}

// Rendered only while open, so its state starts from `product` (edit) or an
// empty form (create) every time.
export default function ProductFormModal({
  product,
  catalog,
  onSave,
  onClose,
  onPreviewImage,
}) {
  const toast = useToast();
  const [form, setForm] = useState(() =>
    product ? productToForm(product) : EMPTY_PRODUCT_FORM,
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
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, imageFile: file, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateProduct(form);
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
    const saved = await onSave(formToPayload(form, selection.ids), product?.id);
    setIsSaving(false);
    if (saved) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={product ? "Editar producto" : "Nuevo producto"}
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
              {isSaving ? "Guardando..." : "Guardar producto"}
            </Button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre del producto">
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ej. Sandwich de Pollo"
            />
            {errors.name && (
              <p className="text-xs text-danger-600 mt-1.5">{errors.name}</p>
            )}
          </Field>
          <Field label="Categoría">
            <Select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Precio (USD)">
            <Input
              type="number"
              step="0.1"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-xs text-danger-600 mt-1.5">{errors.price}</p>
            )}
          </Field>
          <Field label="Stock disponible">
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-xs text-danger-600 mt-1.5">{errors.stock}</p>
            )}
          </Field>
        </div>

        <Field label="Imagen del producto">
          <div className="flex items-center gap-3">
            {isImageSource(form.image) ? (
              <button
                type="button"
                onClick={() =>
                  onPreviewImage({
                    url: form.image,
                    name: form.name || "Vista previa",
                  })
                }
                className="shrink-0"
              >
                <img
                  src={form.image}
                  alt=""
                  className="w-24 h-[72px] rounded-lg object-cover border border-ink-100 cursor-zoom-in hover:opacity-80 transition-opacity"
                />
              </button>
            ) : (
              <span className="text-3xl">🍴</span>
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

        <Field label="Descripción">
          <Textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Breve descripción del producto..."
          />
          {errors.description && (
            <p className="text-xs text-danger-600 mt-1.5">
              {errors.description}
            </p>
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
