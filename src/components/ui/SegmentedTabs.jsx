// Pill-style tab switcher. `tabs` is [{ id, label }]; `value` is the active id.
export default function SegmentedTabs({ tabs, value, onChange }) {
  return (
    <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            value === t.id
              ? "bg-teal-500 text-white"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
