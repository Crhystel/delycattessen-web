// Pure date/promotion rules. No React here so they can be reused and tested.
// Dates are "YYYY-MM-DD" strings, so comparing them as text keeps date order.

export function pad2(n) {
  return String(n).padStart(2, "0");
}

// Local calendar date: promotions are day-based and the backend evaluates
// them on Ecuador's date, which is the admin's local date.
export function toISODate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return toISODate(new Date(year, month - 1, day + days));
}

// A product cannot be in two promotions whose periods overlap, so it never
// has two active promotions at once. Keep in sync with
// PromotionService.validate_products_available (backend).
export function conflictingPromoFor(
  productId,
  promotions,
  { startDate, endDate },
  excludeId,
) {
  return promotions.find(
    (p) =>
      p.id !== excludeId &&
      p.products.includes(productId) &&
      p.startDate <= endDate &&
      p.endDate >= startDate,
  );
}
