export default function Card({ children, className = '', padded = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink-100 shadow-sm ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-base font-semibold text-ink-900 font-display">{title}</h3>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
