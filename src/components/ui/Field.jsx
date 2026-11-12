// `as="div"` for content with buttons (chips, toggles): a <label> forwards any
// click inside it to its first button, which would fire it by accident.
export function Field({ label, children, hint, as: Tag = 'label' }) {
  return (
    <Tag className="block mb-4">
      <span className="block text-sm font-medium text-ink-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-300 mt-1">{hint}</span>}
    </Tag>
  )
}

const baseInput =
  'w-full rounded-xl border border-ink-100 px-3.5 py-2.5 text-base sm:text-sm text-ink-900placeholder:text-ink-300 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 transition'

export function Input(props) {
  return <input className={baseInput} {...props} />
}

export function Select({ children, ...props }) {
  return (
    <select className={baseInput} {...props}>
      {children}
    </select>
  )
}

export function Textarea(props) {
  return <textarea className={`${baseInput} resize-none`} rows={3} {...props} />
}
