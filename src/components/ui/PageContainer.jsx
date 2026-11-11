const SPACING = { 5: 'space-y-5', 6: 'space-y-6' }

// Page body below the Topbar: compact padding on phones, roomier from `sm`.
export default function PageContainer({ spacing = 5, children }) {
  return <main className={`p-4 sm:p-6 ${SPACING[spacing]}`}>{children}</main>
}
