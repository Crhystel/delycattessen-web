import {
  WEEKDAY_LABELS,
  DAY_STATUS_STYLES,
  getMonthWeekdays,
  dayStatus,
} from "../menuUtils";

export default function MonthlyCalendar({
  year,
  monthIndex,
  daysMap,
  preordersMap,
  onEditDay,
  selectedDate,
}) {
  const monthDays = getMonthWeekdays(year, monthIndex);
  const offset = monthDays.length > 0 ? monthDays[0].weekday - 1 : 0; // offset within the Mon-Fri week
  const cells = [...Array(offset).fill(null), ...monthDays];

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5 mb-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-[10px] font-semibold text-ink-400 text-center"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {cells.map((info, idx) => {
          if (!info) return <div key={`blank-${idx}`} />;

          const count = (daysMap[info.date] || []).length;
          const dayPreorders = preordersMap?.[info.date] || 0;
          const status = dayStatus(count);
          const selected = selectedDate === info.date;

          return (
            <button
              key={info.date}
              type="button"
              onClick={() => onEditDay(info.date)}
              className={`relative aspect-square rounded-lg border text-[11px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                DAY_STATUS_STYLES[status]
              } ${selected ? "ring-2 ring-brand-500" : ""}`}
            >
              <span className="font-semibold">{info.day}</span>
              {count > 0 && (
                <span className="text-[9px]">
                  {count} plato{count > 1 ? "s" : ""}
                </span>
              )}
              {dayPreorders > 0 && (
                <span className="text-[9px] font-semibold text-brand-600">
                  {dayPreorders} preórd.
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
