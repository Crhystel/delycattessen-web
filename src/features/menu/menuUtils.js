import { pad2 } from "../../lib/promoRules";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie"];

// Only Monday to Friday count as business days; weekends are excluded.
export function getMonthWeekdays(year, monthIndex) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const out = [];
  for (let d = 1; d <= lastDay; d++) {
    const weekday = new Date(year, monthIndex, d).getDay(); // 0 Sun ... 6 Sat
    if (weekday < 1 || weekday > 5) continue;
    out.push({
      date: `${year}-${pad2(monthIndex + 1)}-${pad2(d)}`,
      day: d,
      weekday,
    });
  }
  return out;
}

export function monthLabel(year, monthIndex) {
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

export function formatLongDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  const text = new Date(year, month - 1, day).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Visual status of a day based on how many dishes are assigned to it.
export function dayStatus(count) {
  if (count === 0) return "pending";
  if (count === 1) return "incomplete";
  return "complete";
}

export const DAY_STATUS_STYLES = {
  pending: "border-ink-100 text-ink-400 hover:bg-ink-50",
  incomplete: "border-warning-300 bg-warning-50 text-warning-700",
  complete: "border-teal-500 bg-teal-50 text-teal-700",
};

// Quick stats for the month: planned days, total dishes and total preorders
// received within the month's date range.
export function monthStats(m) {
  const businessDays = getMonthWeekdays(m.year, m.monthIndex);
  const configuredDays = businessDays.filter(
    (d) => (m.days[d.date] || []).length > 0,
  ).length;
  const registeredDishes = businessDays.reduce(
    (acc, d) => acc + (m.days[d.date] || []).length,
    0,
  );
  const totalPreorders =
    m.totalPreorders !== undefined
      ? m.totalPreorders
      : Object.values(m.preorders || {}).reduce((acc, n) => acc + n, 0);
  return {
    businessDays,
    configuredDays,
    registeredDishes,
    totalPreorders,
    totalDays: businessDays.length,
  };
}

// API monthly menu -> shape used by the UI.
export function adaptMonthlyMenu(m) {
  const monthIndex = m.month - 1;
  const daysMap = {};
  const preordersMap = {};
  if (Array.isArray(m.days)) {
    m.days.forEach((d) => {
      daysMap[d.date] = d.dish_ids || [];
      preordersMap[d.date] = d.preorder_count || 0;
    });
  }
  return {
    id: m.id,
    year: m.year,
    monthIndex,
    month: monthLabel(m.year, monthIndex),
    status: m.status === "PUBLISHED" ? "Publicado" : "Borrador",
    statusRaw: m.status,
    publicationDate: m.published_at ? m.published_at.slice(0, 10) : null,
    days: daysMap,
    preorders: preordersMap,
    totalPreorders: m.total_preorders || 0,
    institutionName: m.institution_name || null,
  };
}

// API dish -> shape used by the UI.
export function adaptDish(d) {
  return {
    id: d.id,
    name: d.name,
    description: d.description || "",
    price: d.price,
    image: d.image || null,
    ingredients: (d.ingredients || []).map((ing) =>
      typeof ing === "object" ? ing.name : ing,
    ),
    allergens: d.allergens || [],
    isActive: d.is_active,
    institutionName: d.institution_name || null,
  };
}

// Labels of the status the backend derives from the promotion dates.
export const PROMO_STATUS = {
  ACTIVE: { label: "Activa", tone: "success" },
  SCHEDULED: { label: "Programada", tone: "warning" },
  EXPIRED: { label: "Vencida", tone: "neutral" },
};

// API promotion -> shape used by the UI.
export function adaptPromotion(p) {
  return {
    id: p.id,
    products: p.products.map((product) => product.id),
    productNames: p.products.map((product) => product.name),
    discount: p.discount_percentage,
    startDate: p.start_date,
    endDate: p.end_date,
    image: p.image || null,
    status: p.status,
    institutionName: p.institution_name || null,
  };
}

// API combo -> shape used by the UI.
export function adaptCombo(c) {
  return {
    id: c.id,
    name: c.name,
    price: Number(c.price),
    regularPrice: Number(c.regular_price),
    items: c.items.map((item) => ({
      productId: item.product_id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
    })),
    startDate: c.start_date,
    endDate: c.end_date,
    image: c.image || null,
    status: c.status,
    institutionName: c.institution_name || null,
  };
}

// Newest month first.
export function sortMenusNewestFirst(menus) {
  return [...menus].sort(
    (a, b) => b.year * 12 + b.monthIndex - (a.year * 12 + a.monthIndex),
  );
}
