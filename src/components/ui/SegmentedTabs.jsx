const SIZES = {
  md: 'px-4 py-2',
  sm: 'px-3.5 py-1.5',
}

// Pill-style tab switcher. `tabs` is [{ id, label, icon? }]; `value` is the active id.
// On phones it spans the full width, shares it equally and lets long labels wrap
// onto two lines (no horizontal scroll); from `sm` it is a pill sized to its content.
export default function SegmentedTabs({ tabs, value, onChange, size = 'md' }) {
  return (
    <div className="flex w-full sm:w-max bg-white border border-ink-100 rounded-xl p-1 text-sm">
      {tabs.map((t) => {
        const Icon = t.icon
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`${SIZES[size]} flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg text-center leading-tight sm:whitespace-nowrap font-medium transition-colors ${
              value === t.id
                ? "bg-teal-500 text-white"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {Icon && <Icon size={15} className="hidden sm:block shrink-0" />}
            {t.label}
          </button>
        )
      })}
    </div>
  );
}
