import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Pencil, Trash2, Search, Upload, EyeOff, X } from "lucide-react";
import Topbar from "../../components/admin/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select, Textarea } from "../../components/ui/Field";
import IngredientsInput from "../../components/admin/IngredientsInput";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { usePromotions, activePromoFor } from "../../context/PromotionsContext";
import {
  getAdminProducts,
  getIngredients,
  createIngredient,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const CATEGORIES = ["Bar", "Almuerzo", "Snacks", "Bebidas", "Postres"];

const emptyForm = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  ingredients: [],
  image: null,
  imageFile: null,
};

function isImageFile(image) {
  return typeof image === "string" && image.length > 0;
}

function validate(form) {
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

function ImagePreviewOverlay({ image, onClose }) {
  if (!image) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-ink-200"
        >
          <X size={24} />
        </button>
        <p className="text-white text-sm font-medium mb-2">{image.name}</p>
        <img
          src={image.url}
          alt={image.name}
          className="w-full max-h-[75vh] object-contain rounded-lg"
        />
      </div>
    </div>,
    document.body,
  );
}

export default function Products() {
  const { token } = useAuth();
  const toast = useToast();
  const { promotions } = usePromotions();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [ingredientsCatalog, setIngredientsCatalog] = useState([]);
  const [ingredientMap, setIngredientMap] = useState(new Map()); // name -> id
  const [previewImage, setPreviewImage] = useState(null); // { url, name } | null

  useEffect(() => {
    loadProducts();
    loadIngredients();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await getAdminProducts(token);
      setItems(data);
    } catch (err) {
      toast.error("No se pudo cargar el catálogo", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadIngredients() {
    try {
      const data = await getIngredients(token);
      const sorted = [...data].sort((a, b) =>
        a.name.localeCompare(b.name, "es"),
      );
      setIngredientsCatalog(sorted.map((i) => i.name));
      setIngredientMap(new Map(sorted.map((i) => [i.name, i.id])));
    } catch (err) {
      toast.error("No se pudieron cargar los ingredientes", err.message);
    }
  }

  async function addToCatalog(newIngredient) {
    if (
      ingredientsCatalog.some(
        (i) => i.toLowerCase() === newIngredient.toLowerCase(),
      )
    )
      return;
    try {
      const created = await createIngredient(newIngredient, token);
      setIngredientsCatalog((prev) =>
        [...prev, created.name].sort((a, b) => a.localeCompare(b, "es")),
      );
      setIngredientMap((prev) => new Map(prev).set(created.name, created.id));
    } catch (err) {
      toast.error("No se pudo agregar el ingrediente", err.message);
    }
  }

  const filtered = useMemo(
    () =>
      items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditingId(p.id);
    const idToName = new Map(
      [...ingredientMap].map(([name, id]) => [id, name]),
    );
    setForm({
      name: p.name,
      description: p.description,
      category: p.category || CATEGORIES[0],
      price: String(p.price),
      stock: String(p.stock),
      ingredients: p.ingredients.map((id) => idToName.get(id)).filter(Boolean),
      image: p.image || null,
      imageFile: null,
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    updateField("imageFile", file);
    const reader = new FileReader();
    reader.onload = () => updateField("image", reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const ingredientIds = form.ingredients
      .map((name) => ingredientMap.get(name))
      .filter((id) => id !== undefined);

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      ingredients: ingredientIds,
      imageFile: form.imageFile,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, payload, token);
        toast.success(
          "Producto actualizado",
          "Los cambios se guardaron correctamente.",
        );
      } else {
        await createProduct(payload, token);
        toast.success("Producto creado", "El producto se agregó al catálogo.");
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error("No se pudo guardar", err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id, token);
      toast.success(
        "Producto eliminado",
        "Se quitó del catálogo correctamente.",
      );
      loadProducts();
    } catch (err) {
      toast.error("No se pudo eliminar", err.message);
    }
  }

  return (
    <>
      <Topbar
        title="Catálogo e Inventario"
        subtitle="Gestión de productos, ingredientes y stock"
      />

      <main className="p-6 space-y-5">
        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
              />
            </div>
            <Button icon={Plus} onClick={openNew}>
              Nuevo producto
            </Button>
          </div>

          <div className="px-5 py-2.5 border-b border-ink-100 bg-ink-50/50 text-xs text-ink-400 flex items-center gap-1.5">
            <EyeOff size={13} />
            Los productos con stock en cero se atenúan y quedan ocultos
            automáticamente del catálogo activo.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">Categoría</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Visibilidad</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-ink-300"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  filtered.map((p) => {
                    const hidden = p.stock <= 0;
                    const promo = activePromoFor(p.id, promotions);
                    const discountedPrice = promo
                      ? p.price * (1 - promo.discount / 100)
                      : null;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition-opacity ${
                          hidden ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            {isImageFile(p.image) ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewImage({
                                    url: p.image,
                                    name: p.name,
                                  })
                                }
                                className="shrink-0"
                              >
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className={`w-8 h-8 rounded-lg object-cover cursor-zoom-in hover:opacity-80 transition-opacity ${hidden ? "grayscale" : ""}`}
                                />
                              </button>
                            ) : (
                              <span
                                className={`text-xl ${hidden ? "grayscale" : ""}`}
                              >
                                🍴
                              </span>
                            )}
                            <div>
                              <p className="font-medium text-ink-900">
                                {p.name}
                              </p>
                              {p.description && (
                                <p className="text-xs text-ink-400 line-clamp-1">
                                  {p.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-500">{p.category}</td>
                        <td className="px-5 py-3">
                          {promo ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-ink-300 line-through text-xs">
                                ${Number(p.price).toFixed(2)}
                              </span>
                              <span className="text-teal-700 font-semibold">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              <Badge tone="success">-{promo.discount}%</Badge>
                            </div>
                          ) : (
                            <span className="text-ink-700 font-medium">
                              ${Number(p.price).toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-ink-700">{p.stock} u.</td>
                        <td className="px-5 py-3">
                          {hidden ? (
                            <Badge tone="danger">
                              <EyeOff size={11} />
                              Oculto · sin stock
                            </Badge>
                          ) : (
                            <Badge tone="success">Visible</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(p)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-ink-300"
                    >
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar producto" : "Nuevo producto"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar producto"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
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
              {isImageFile(form.image) ? (
                <button
                  type="button"
                  onClick={() =>
                    setPreviewImage({
                      url: form.image,
                      name: form.name || "Vista previa",
                    })
                  }
                  className="shrink-0"
                >
                  <img
                    src={form.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-ink-100 cursor-zoom-in hover:opacity-80 transition-opacity"
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

          <Field
            label="Ingredientes (obligatorio)"
            hint="Busca en el catálogo o agrega uno nuevo. Requerido para validar alérgenos en el POS."
          >
            <IngredientsInput
              value={form.ingredients}
              catalog={ingredientsCatalog}
              onChange={(newIngredients) =>
                updateField("ingredients", newIngredients)
              }
              onNewIngredient={addToCatalog}
            />
            {errors.ingredients && (
              <p className="text-xs text-danger-600 mt-1.5">
                {errors.ingredients}
              </p>
            )}
          </Field>
        </form>
      </Modal>

      <ImagePreviewOverlay
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}
