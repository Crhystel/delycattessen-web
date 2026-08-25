import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getIngredients, createProduct } from "../../services/productService";

export default function ProductCreate() {
  const { token } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    ingredients: [],
  });

  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const data = await getIngredients(token);
        setAvailableIngredients(data);
      } catch (err) {
        toast.error("No se pudieron cargar los ingredientes", err.message);
      }
    }
    fetchIngredients();
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleIngredientChange(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value),
    );
    setFormData((prev) => ({ ...prev, ingredients: selectedOptions }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.ingredients.length === 0) {
      toast.warning(
        "Falta un ingrediente",
        "Debes seleccionar al menos un ingrediente.",
      );
      return;
    }

    setIsLoading(true);
    try {
      await createProduct(formData, token);
      toast.success(
        "Producto creado",
        "El producto se agregó correctamente al catálogo.",
      );
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: 0,
        ingredients: [],
      });
    } catch (err) {
      toast.error("No se pudo guardar", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="mb-8 border-b pb-4">
          <h3 className="text-2xl font-bold text-ink-900">
            Crear nuevo producto
          </h3>
          <p className="text-ink-500 mt-1">
            Completa los detalles para agregar un artículo al catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Ej. Hamburguesa clásica"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Precio ($) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Stock inicial *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <p className="text-xs text-ink-500 mt-1">
                Si se deja en 0, el producto se oculta automáticamente.
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Ingredientes *{" "}
                <span className="text-danger-600">
                  (requerido para validar alérgenos)
                </span>
              </label>
              <select
                multiple
                name="ingredients"
                value={formData.ingredients}
                onChange={handleIngredientChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-32"
              >
                {availableIngredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-ink-500 mt-1">
                Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar
                varios.
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Descripción del producto..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2 border border-ink-200 rounded-lg text-ink-700 font-medium hover:bg-ink-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={
                "px-6 py-2 rounded-lg text-white font-medium " +
                (isLoading
                  ? "bg-brand-300 cursor-not-allowed"
                  : "bg-brand-500 hover:bg-brand-700")
              }
            >
              {isLoading ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
