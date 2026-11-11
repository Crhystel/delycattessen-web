import { useCallback, useSyncExternalStore } from 'react'

// Tracks a CSS media query (e.g. '(min-width: 1024px)'). Use it only for what
// CSS classes cannot do (chart sizing, choosing between inline panel and Sheet).
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (notify) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', notify)
      return () => list.removeEventListener('change', notify)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
