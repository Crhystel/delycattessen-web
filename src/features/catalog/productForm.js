export const CATEGORIES = ["Bar", "Almuerzo", "Snacks", "Bebidas", "Postres"];

export const EMPTY_PRODUCT_FORM = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  ingredients: [],
  image: null,
  imageFile: null,
};

export function validateProduct(form) {
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
export function productToForm(product) {
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
export function formToPayload(form, ingredientIds) {
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
