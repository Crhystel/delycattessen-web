import { useState } from "react";
import { formatCount, formatMoney } from "../dashboardUtils";

const METRICS = [
  {
    id: "revenue",
    label: "Ingresos",
    ranking: "by_revenue",
    value: (row) => Number(row.revenue),
    format: (row) => formatMoney(row.revenue),
  },
  {
    id: "units",
    label: "Unidades",
    ranking: "by_units",
    value: (row) => row.units,
    format: (row) => `${formatCount(row.units)} uds.`,
  },
];

// Top products by revenue or by units. `top` is the top-products response, or null.
export default function TopProductsList({ top }) {
  const [metricId, setMetricId] = useState("revenue");
  const metric = METRICS.find(({ id }) => id === metricId);
  const rows = top ? top[metric.ranking] : [];
  const max = rows.length ? metric.value(rows[0]) : 0;

  return (
    <div>
      <div className="flex bg-ink-50 rounded-lg p-0.5 w-fit text-xs mb-3">
        {METRICS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMetricId(id)}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              metricId === id
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-300 py-6 text-center">
          {top ? "Sin productos vendidos en este periodo." : "Cargando..."}
        </p>
      ) : (
        <ol className="space-y-3">
          {rows.map((row, index) => (
            <li key={row.name}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-ink-900 truncate">
                  <span className="text-ink-300 mr-2">{index + 1}</span>
                  {row.name}
                </span>
                <span className="text-ink-500 shrink-0">{metric.format(row)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-50 mt-1.5">
                <div
                  className="h-1.5 rounded-full bg-teal-500"
                  style={{ width: `${max ? (metric.value(row) / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
