export default function StatCard({ icon: Icon, label, value, hint, tone = 'teal' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-600',
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-ink-900 font-display mt-0.5 truncate">{value}</p>
        {hint && <p className="text-xs text-ink-300 mt-1">{hint}</p>}
      </div>
    </div>
  )
}
