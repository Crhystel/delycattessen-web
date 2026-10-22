import { Input } from "../../../components/ui/Field";
import { GRANULARITIES, PERIOD_PRESETS } from "../dashboardUtils";

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            value === id
              ? "bg-teal-500 text-white"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// Presets, custom date range and chart granularity.
export default function PeriodSelector({
  presetId,
  range,
  granularity,
  onPreset,
  onRange,
  onGranularity,
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
      <Segmented
        options={PERIOD_PRESETS}
        value={presetId}
        onChange={onPreset}
      />
      <div className="flex items-center gap-2 text-sm text-ink-500">
        <div className="w-40">
          <Input
            type="date"
            aria-label="Desde"
            value={range.date_from}
            max={range.date_to}
            onChange={(e) => onRange({ ...range, date_from: e.target.value })}
          />
        </div>
        <span>a</span>
        <div className="w-40">
          <Input
            type="date"
            aria-label="Hasta"
            value={range.date_to}
            min={range.date_from}
            onChange={(e) => onRange({ ...range, date_to: e.target.value })}
          />
        </div>
      </div>
      <Segmented
        options={GRANULARITIES}
        value={granularity}
        onChange={onGranularity}
      />
    </div>
  );
}
