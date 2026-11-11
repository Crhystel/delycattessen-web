const COLUMNS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }

// Form fields in one column on phones and `cols` columns from `sm` up.
export default function FormGrid({ cols = 2, children }) {
  // Fields already carry their own bottom margin, so rows only need extra gap from `sm`.
  return <div className={`grid grid-cols-1 gap-x-4 sm:gap-y-4 ${COLUMNS[cols]}`}>{children}</div>
}
