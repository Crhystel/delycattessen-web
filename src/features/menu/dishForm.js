export const EMPTY_DISH_FORM = {
  name: "",
  description: "",
  price: "",
  image: null,
  imageFile: null,
  ingredients: [],
};

// No stock field: a Monthly Menu dish is prepared on demand based on the
// day's preorder count, not from a fixed inventory.
export function validateDish(form, isEditing = false) {
  const errors = {};
  if (!form.name.trim()) errors.name = "El nombre del platillo es obligatorio.";
  if (!form.description.trim())
    errors.description = "La descripción es obligatoria.";
  if (form.price === "" || Number(form.price) <= 0)
    errors.price = "Ingresa un precio válido mayor a 0.";
  if (!isEditing && !form.imageFile)
    errors.image = "Selecciona una imagen para el platillo.";
  if (form.ingredients.length === 0)
    errors.ingredients =
      "Debes declarar los ingredientes para validar alérgenos.";
  return errors;
}

// Adapted dish -> editable form state.
export function dishToForm(dish) {
  return {
    name: dish.name,
    description: dish.description,
    price: dish.price ? String(dish.price) : "",
    image: dish.image,
    imageFile: null,
    ingredients: [...dish.ingredients],
  };
}

// Form state -> payload accepted by the dish service.
export function formToDishPayload(form, ingredientIds) {
  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    price: parseFloat(form.price).toFixed(2),
    ingredients: ingredientIds,
  };
  if (form.imageFile) payload.imageFile = form.imageFile;
  return payload;
}
