const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// "YYYY-MM-DD" -> [year, monthIndex, day], without timezone shifts.
function splitDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return [year, month - 1, day];
}

// "1 al 26 de octubre de 2026" (the report always covers one month).
export function periodLabel(dateFrom, dateTo) {
  const [, , fromDay] = splitDate(dateFrom);
  const [year, monthIndex, toDay] = splitDate(dateTo);
  const days = fromDay === toDay ? `${toDay}` : `${fromDay} al ${toDay}`;
  return `${days} de ${MONTHS[monthIndex]} de ${year}`;
}

export function formatAmount(value) {
  return `$${Number(value).toFixed(2)}`;
}

// Local date and time of a sale, e.g. "18/10/2026" and "10:35 a. m.".
function saleDateTime(createdAt) {
  const date = new Date(createdAt);
  return {
    date: date.toLocaleDateString("es-EC"),
    time: date.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// API report -> shape used by the UI and the export.
export function adaptReport(r) {
  return {
    dateFrom: r.date_from,
    dateTo: r.date_to,
    period: periodLabel(r.date_from, r.date_to),
    teachers: r.teachers.map((t) => ({
      key: `${t.teacher_id}-${t.institution_name}`,
      fullName: t.full_name,
      email: t.email || "",
      institutionName: t.institution_name,
      consumptions: t.consumptions,
      total: Number(t.total),
      sales: t.sales.map((sale) => ({
        id: sale.id,
        ...saleDateTime(sale.created_at),
        products: sale.items
          .map((item) => `${item.quantity}× ${item.menu_item_name}`)
          .join(", "),
        amount: Number(sale.total_amount),
      })),
    })),
    totals: {
      teachers: r.totals.teachers,
      consumptions: r.totals.consumptions,
      amount: Number(r.totals.amount),
    },
  };
}

// "consumo-docentes-sede-a-2026-10-26.csv"
export function reportFileName(institutionLabel, dateTo) {
  const slug = institutionLabel
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `consumo-docentes-${slug || "sede"}-${dateTo}.csv`;
}
