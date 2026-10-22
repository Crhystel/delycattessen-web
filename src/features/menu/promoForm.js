import { TODAY, formatDateISO, addDays } from "../../lib/promoRules";

export const EMPTY_PROMO_FORM = {
  products: [],
  image: "🎉",
  discount: "",
  startDate: formatDateISO(TODAY),
  endDate: formatDateISO(addDays(TODAY, 7)),
};

export function promoToForm(promo) {
  return {
    products: [...promo.products],
    image: promo.image,
    discount: String(promo.discount),
    startDate: promo.startDate,
    endDate: promo.endDate,
  };
}
