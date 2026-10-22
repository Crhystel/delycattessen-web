export default function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-white text-teal-600 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900 leading-tight">{value}</p>
        <p className="text-[11px] text-ink-500 truncate">{label}</p>
      </div>
    </div>
  );
}
