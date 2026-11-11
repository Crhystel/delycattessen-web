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
import useMediaQuery from "../../../hooks/useMediaQuery";
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
  // Recharts sizes in pixels, so the compact layout cannot be done with classes.
  const isWide = useMediaQuery("(min-width: 640px)");
  const tickFontSize = isWide ? 12 : 11;

  return (
    <div className="[&_*]:outline-none">
      <ResponsiveContainer width="100%" height={isWide ? 300 : 240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            minTickGap={isWide ? 5 : 12}
            tick={{ fill: AXIS_COLOR, fontSize: tickFontSize }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={isWide ? 56 : 44}
            tick={{ fill: AXIS_COLOR, fontSize: tickFontSize }}
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
