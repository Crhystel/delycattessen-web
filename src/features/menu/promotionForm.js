import {
  todayISO,
  addDaysISO,
  conflictingPromoFor,
} from "../../lib/promoRules";

// Built on each call: the default dates depend on the current day.
export function emptyPromotionForm() {
  const start = todayISO();
  return {
    products: [],
    discount: "",
    startDate: start,
    endDate: addDaysISO(start, 7),
    image: null,
    imageFile: null,
  };
}

// Adapted promotion -> editable form state.
export function promotionToForm(promo) {
  return {
    products: [...promo.products],
    discount: String(promo.discount),
    startDate: promo.startDate,
    endDate: promo.endDate,
    image: promo.image,
    imageFile: null,
  };
}

// `promotions` are the existing ones, to detect products already promoted in
// the chosen dates; `promoId` excludes the promotion being edited.
export function validatePromotion(form, promotions, promoId) {
  const errors = {};
  const discount = Number(form.discount);
  if (form.products.length === 0)
    errors.products = "Selecciona al menos un producto para la promoción.";
  else if (
    form.products.some((id) =>
      conflictingPromoFor(id, promotions, form, promoId),
    )
  )
    errors.products =
      "Uno de los productos elegidos ya tiene una promoción en esas fechas.";
  if (!Number.isInteger(discount) || discount < 1 || discount > 99)
    errors.discount = "Ingresa un descuento entero entre 1 y 99.";
  if (!form.startDate || !form.endDate)
    errors.endDate = "Selecciona las fechas de inicio y fin.";
  else if (form.endDate < form.startDate)
    errors.endDate = "La fecha de fin no puede ser anterior a la de inicio.";
  else if (!promoId && form.endDate < todayISO())
    errors.endDate = "La fecha de fin no puede estar en el pasado.";
  return errors;
}

// Form state -> payload accepted by the promotion service.
export function formToPromotionPayload(form) {
  const payload = {
    products: form.products,
    discount: Number(form.discount),
    startDate: form.startDate,
    endDate: form.endDate,
  };
  if (form.imageFile) payload.imageFile = form.imageFile;
  return payload;
}
