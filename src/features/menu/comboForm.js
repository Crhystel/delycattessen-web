import { todayISO, addDaysISO } from "../../lib/dates";

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

// A catalog product the combo can draw from: active (when the API says so).
function isProductActive(product) {
  return Boolean(product) && product.is_active !== false;
}

// How many combos the current stock allows: the scarcest product limits it.
// Mirrors the backend `available_quantity`; keep in sync.
export function comboAvailableUnits(items, products) {
  if (items.length === 0) return 0;
  const units = items.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!isProductActive(product) || quantity <= 0) return 0;
    return Math.floor(Number(product.stock) / quantity);
  });
  return Math.min(...units);
}

// Items of the combo whose product is no longer in the catalog (it was deleted),
// with the name the combo had saved. The form shows them so they can be removed:
// the backend still accepts them on an existing combo but never as a new item.
export function unavailableItems(items, products, originalItems = []) {
  return items
    .filter(({ productId }) => !products.some((p) => p.id === productId))
    .map(({ productId, quantity }) => ({
      productId,
      quantity,
      name: originalItems.find((o) => o.productId === productId)?.name,
    }));
}

// Items without enough stock (or inactive). When editing, only new items or
// ones with a higher quantity than before are checked, as the backend does
// (`originalItems` = combo items before editing).
export function shortItems(items, products, originalItems = []) {
  return items.flatMap(({ productId, quantity }) => {
    const original = originalItems.find((o) => o.productId === productId);
    if (original && quantity <= original.quantity) return [];
    const product = products.find((p) => p.id === productId);
    const isShort =
      !isProductActive(product) || Number(product.stock) < quantity;
    if (!isShort) return [];
    return [{ productId, quantity, name: product?.name ?? original?.name }];
  });
}

// `isEditing`: an existing combo already has an image on the server.
// `originalItems`: the combo items before editing (empty when creating).
export function validateCombo(form, isEditing, products, originalItems = []) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Ponle un nombre a la promoción.";
  if (form.items.length === 0)
    errors.items = "Agrega al menos un producto al combo.";
  else {
    const short = shortItems(form.items, products, originalItems);
    if (short.length > 0)
      errors.items = `Sin stock suficiente: ${short
        .map((item) => item.name ?? "producto")
        .join(", ")}.`;
  }
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
