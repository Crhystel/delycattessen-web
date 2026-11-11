import { Input } from "../../../components/ui/Field";
import SegmentedTabs from "../../../components/ui/SegmentedTabs";
import { GRANULARITIES, PERIOD_PRESETS } from "../dashboardUtils";

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
      <SegmentedTabs
        tabs={PERIOD_PRESETS}
        value={presetId}
        onChange={onPreset}
        size="sm"
      />
      <div className="flex w-full items-center gap-2 text-sm text-ink-500 sm:w-auto">
        <div className="min-w-0 flex-1 sm:w-40 sm:flex-none">
          <Input
            type="date"
            aria-label="Desde"
            value={range.date_from}
            max={range.date_to}
            onChange={(e) => onRange({ ...range, date_from: e.target.value })}
          />
        </div>
        <span>a</span>
        <div className="min-w-0 flex-1 sm:w-40 sm:flex-none">
          <Input
            type="date"
            aria-label="Hasta"
            value={range.date_to}
            min={range.date_from}
            onChange={(e) => onRange({ ...range, date_to: e.target.value })}
          />
        </div>
      </div>
      <SegmentedTabs
        tabs={GRANULARITIES}
        value={granularity}
        onChange={onGranularity}
        size="sm"
      />
    </div>
  );
}
