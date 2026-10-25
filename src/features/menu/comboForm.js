import { todayISO, addDaysISO } from "../../lib/promoRules";

// Built on each call: the default dates depend on the current day.
export function emptyComboForm() {
  const start = todayISO();
  return {
    name: "",
    price: "",
    items: [], // [{ productId, quantity }]
    startDate: start,
    endDate: addDaysISO(start, 7),
    image: null,
    imageFile: null,
  };
}

// Adapted combo -> editable form state.
export function comboToForm(combo) {
  return {
    name: combo.name,
    price: combo.price.toFixed(2),
    items: combo.items.map(({ productId, quantity }) => ({
      productId,
      quantity,
    })),
    startDate: combo.startDate,
    endDate: combo.endDate,
    image: combo.image,
    imageFile: null,
  };
}

// What the chosen products cost bought separately; `products` are the
// catalog products (API shape, `price` as text).
export function regularPrice(items, products) {
  return items.reduce((sum, { productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    return product ? sum + Number(product.price) * quantity : sum;
  }, 0);
}

// `isEditing`: an existing combo already has an image on the server.
export function validateCombo(form, isEditing) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Ponle un nombre a la promoción.";
  if (form.items.length === 0)
    errors.items = "Agrega al menos un producto al combo.";
  if (form.price === "" || Number(form.price) <= 0)
    errors.price = "Ingresa un precio válido mayor a 0.";
  if (!isEditing && !form.imageFile)
    errors.image = "Sube una imagen: se muestra como banner en la app.";
  if (!form.startDate || !form.endDate)
    errors.endDate = "Selecciona las fechas de inicio y fin.";
  else if (form.endDate < form.startDate)
    errors.endDate = "La fecha de fin no puede ser anterior a la de inicio.";
  else if (!isEditing && form.endDate < todayISO())
    errors.endDate = "La fecha de fin no puede estar en el pasado.";
  return errors;
}

// Form state -> payload accepted by the combo service.
export function formToComboPayload(form) {
  const payload = {
    name: form.name.trim(),
    price: Number(form.price).toFixed(2),
    items: form.items,
    startDate: form.startDate,
    endDate: form.endDate,
  };
  if (form.imageFile) payload.imageFile = form.imageFile;
  return payload;
}
