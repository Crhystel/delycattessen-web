// Row above a page's content: `start` (tabs, filters) on the left and `actions`
// (buttons) on the right. On phones they wrap and the buttons stack full width.
export default function PageToolbar({ start, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {start && <div className="min-w-0 w-full sm:w-auto">{start}</div>}
      {actions && (
        <div className="flex w-full flex-col gap-2 *:w-full sm:w-auto sm:flex-row sm:*:w-auto">
          {actions}
        </div>
      )}
    </div>
  )
}
