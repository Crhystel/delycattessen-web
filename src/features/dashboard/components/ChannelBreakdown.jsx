import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import ChangeBadge from "./ChangeBadge";
import { CHANNEL_BY_KEY } from "../chartPalette";
import { formatCount, formatMoney } from "../dashboardUtils";

function ChannelDonut({ channels, highlighted, onToggle }) {
  const slices = channels.map((row) => ({
    key: row.channel,
    value: Number(row.amount),
  }));
  const empty = slices.every((slice) => slice.value === 0);
  return (
    <ResponsiveContainer width="100%" height={190}>
      <PieChart>
        <Pie
          data={empty ? [{ key: "none", value: 1 }] : slices}
          dataKey="value"
          innerRadius={55}
          outerRadius={82}
          paddingAngle={empty ? 0 : 2}
          stroke="none"
          onClick={(slice) => !empty && onToggle(slice.key ?? slice.payload?.key)}
          cursor={empty ? "default" : "pointer"}
        >
          {(empty ? [{ key: "none" }] : slices).map((slice) => (
            <Cell
              key={slice.key}
              fill={CHANNEL_BY_KEY[slice.key]?.color ?? "var(--color-ink-100)"}
              fillOpacity={highlighted && highlighted !== slice.key ? 0.25 : 1}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Amount, share and change per sales channel. Clicking a channel (in the donut
// or the list) highlights it; `showChart={false}` keeps only the list.
export default function ChannelBreakdown({
  channels,
  highlighted = null,
  onToggle = () => {},
  showChart = true,
}) {
  return (
    <div>
      {showChart && (
        <ChannelDonut
          channels={channels}
          highlighted={highlighted}
          onToggle={onToggle}
        />
      )}
      <ul className="space-y-1.5">
        {channels.map((row) => {
          const { label, color } = CHANNEL_BY_KEY[row.channel];
          return (
            <li key={row.channel}>
              <button
                type="button"
                onClick={() => onToggle(row.channel)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-ink-50 ${
                  highlighted === row.channel ? "bg-ink-50" : ""
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-ink-900 truncate">
                    {label}
                  </span>
                  <span className="block text-xs text-ink-300">
                    {formatCount(row.count)} ventas · {row.share_pct} %
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-sm font-semibold text-ink-900">
                    {formatMoney(row.amount)}
                  </span>
                  <ChangeBadge change={row.change_pct} compact />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
