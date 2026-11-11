// Classes are written in full so Tailwind can see them.
const HIDE_BELOW = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
}

function columnClass(column) {
  const hide = column.hideBelow ? HIDE_BELOW[column.hideBelow] : ''
  const align = column.align === 'right' ? 'text-right' : ''
  return `${hide} ${align}`
}

// Table from `md` up. With `renderCard`, phones get a list of cards instead
// (the table is hidden below `md`); without it the table just scrolls sideways.
//   columns: [{ key, header, cell(row), className?, align?: 'right', hideBelow?: 'sm'|'md'|'lg' }]
export default function DataTable({
  columns,
  rows,
  rowKey,
  renderCard,
  loading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay registros.',
  rowClassName,
}) {
  const message = loading ? loadingText : rows.length === 0 ? emptyText : null

  return (
    <>
      <div className={`overflow-x-auto scroll-soft ${renderCard ? 'hidden md:block' : ''}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-100">
              {columns.map((column) => (
                <th key={column.key} className={`px-5 py-3 font-medium ${columnClass(column)}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {message && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-ink-300">
                  {message}
                </td>
              </tr>
            )}
            {!message &&
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-ink-100 last:border-0 hover:bg-ink-50/60 ${rowClassName?.(row) ?? ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3 ${column.className ?? ''} ${columnClass(column)}`}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {renderCard && (
        <div className="md:hidden">
          {message ? (
            <p className="px-5 py-8 text-center text-sm text-ink-300">{message}</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((row) => (
                <li key={rowKey(row)} className={`p-4 ${rowClassName?.(row) ?? ''}`}>
                  {renderCard(row)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  )
}
