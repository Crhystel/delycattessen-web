import { CHANNELS } from "./chartPalette";

export const REFRESH_INTERVAL_MS = 30000;
export const DEFAULT_PRESET = "month";

export const PERIOD_PRESETS = [
  { id: "today", label: "Hoy" },
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "month", label: "Este mes" },
];

export const GRANULARITIES = [
  { id: "day", label: "Día" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
];

const MS_PER_DAY = 86400000;
const moneyFormat = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
});

// Local (not UTC) YYYY-MM-DD, which is what the API expects.
export function toIsoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseIsoDate(iso) {
  return new Date(`${iso}T00:00:00`);
}

export function presetRange(presetId, today = new Date()) {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  if (presetId === "7d") start.setDate(end.getDate() - 6);
  if (presetId === "30d") start.setDate(end.getDate() - 29);
  if (presetId === "month") start.setDate(1);
  return { date_from: toIsoDate(start), date_to: toIsoDate(end) };
}

export function rangeDays(range) {
  const span = parseIsoDate(range.date_to) - parseIsoDate(range.date_from);
  return Math.round(span / MS_PER_DAY) + 1;
}

// Keeps the chart readable: up to ~1 month by day, ~4 months by week, then by month.
export function defaultGranularity(range) {
  const days = rangeDays(range);
  if (days <= 31) return "day";
  return days <= 120 ? "week" : "month";
}

export function formatMoney(value) {
  return moneyFormat.format(Number(value));
}

export function formatCount(value) {
  return Number(value).toLocaleString("es-EC");
}

export function formatChange(change) {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toLocaleString("es-EC")} %`;
}

export function bucketLabel(bucketStart, granularity) {
  const date = parseIsoDate(bucketStart);
  if (granularity === "month") {
    return date.toLocaleDateString("es-EC", { month: "short", year: "2-digit" });
  }
  if (granularity === "week") {
    return date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("es-EC", { weekday: "short", day: "numeric" });
}

export function rangeLabel(range) {
  const from = parseIsoDate(range.date_from);
  if (range.date_from === range.date_to) {
    return from.toLocaleDateString("es-EC", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  const short = { day: "numeric", month: "short", year: "numeric" };
  return `${from.toLocaleDateString("es-EC", short)} – ${parseIsoDate(
    range.date_to,
  ).toLocaleDateString("es-EC", short)}`;
}

// One flat row per bucket with numeric amounts per channel, ready for recharts.
export function toChartData(series, granularity) {
  return series.map((bucket) => ({
    ...bucket,
    label: bucketLabel(bucket.bucket_start, granularity),
    revenue: Number(bucket.revenue),
    ...Object.fromEntries(
      CHANNELS.map(({ key }) => [key, Number(bucket.channels[key])]),
    ),
  }));
}

export function hasSales(summary) {
  return summary.kpis.transactions.current > 0;
}
