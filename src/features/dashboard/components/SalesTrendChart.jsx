import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AXIS_COLOR, CHANNELS, GRID_COLOR } from "../chartPalette";
import { formatMoney, rangeLabel } from "../dashboardUtils";

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-ink-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg space-y-1 min-w-[190px]">
      <p className="font-semibold first-letter:uppercase">{rangeLabel(row)}</p>
      {CHANNELS.map(({ key, label, color }) => (
        <p key={key} className="flex justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
            />
            {label}
          </span>
          <span>{formatMoney(row[key])}</span>
        </p>
      ))}
      <p className="flex justify-between gap-4 font-semibold border-t border-white/15 pt-1">
        <span>Total · {row.transactions} ventas</span>
        <span>{formatMoney(row.revenue)}</span>
      </p>
      <p className="text-white/60">Haz clic para ver el detalle</p>
    </div>
  );
}

// Dims the bars that are not the clicked bucket or the highlighted channel.
function barOpacity(row, channelKey, selectedStart, highlighted) {
  if (highlighted && highlighted !== channelKey) return 0.2;
  if (selectedStart && row.bucket_start !== selectedStart) return 0.45;
  return 1;
}

// Stacked revenue per channel for each day/week/month; clicking a bar selects it.
export default function SalesTrendChart({
  data,
  selectedStart,
  highlighted,
  onSelect,
}) {
  return (
    <div className="[&_*]:outline-none">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: AXIS_COLOR, fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tick={{ fill: AXIS_COLOR, fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={<TrendTooltip />}
            cursor={{ fill: "var(--color-ink-50)" }}
          />
          {CHANNELS.map(({ key, label, color }) => (
            <Bar
              key={key}
              dataKey={key}
              name={label}
              stackId="sales"
              fill={color}
              cursor="pointer"
              onClick={(entry) => onSelect(entry.payload ?? entry)}
            >
              {data.map((row) => (
                <Cell
                  key={row.bucket_start}
                  fill={color}
                  fillOpacity={barOpacity(row, key, selectedStart, highlighted)}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
