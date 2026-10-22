import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";

// Loads data through `fetcher` and tracks loading/error, ignoring responses
// that arrive after the component re-ran or unmounted.
//
// `fetcher` MUST have a stable identity (module-level function or
// useCallback): a new function re-triggers the load. Changing a dependency
// of that useCallback (e.g. the selected institution) reloads the data.
// Pass `errorTitle` to surface failures as a toast.
//
// `refreshInterval` (ms) re-runs the fetcher in the background: `loading`
// stays false, the current `data` stays on screen until the new response
// arrives and failures are not toasted. Ticks are skipped while the tab is
// hidden and a refresh runs as soon as it becomes visible again.
// `lastUpdated` is the time of the last successful load.
export function useAsyncData(
  fetcher,
  { initialData = null, enabled = true, errorTitle, refreshInterval } = {},
) {
  const toast = useToast();
  const [reloadKey, setReloadKey] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);
  const silentRef = useRef(false);
  const [result, setResult] = useState({
    fetcher: null,
    reloadKey: -1,
    data: initialData,
    error: null,
    updatedAt: null,
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const silent = silentRef.current;
    silentRef.current = false;
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) {
          setResult({
            fetcher,
            reloadKey,
            data,
            error: null,
            updatedAt: new Date(),
          });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setResult((prev) => ({ ...prev, fetcher, reloadKey, error }));
        if (errorTitle && !silent) toast.error(errorTitle, error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, enabled, reloadKey, refreshTick, errorTitle, toast]);

  useEffect(() => {
    if (!enabled || !refreshInterval) return undefined;
    const refresh = () => {
      if (document.hidden) return;
      silentRef.current = true;
      setRefreshTick((tick) => tick + 1);
    };
    const timer = setInterval(refresh, refreshInterval);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [enabled, refreshInterval]);

  // Local edits (optimistic updates, inserting a created row, ...).
  const setData = useCallback((updater) => {
    setResult((prev) => ({
      ...prev,
      data: typeof updater === "function" ? updater(prev.data) : updater,
    }));
  }, []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const loading =
    enabled && (result.fetcher !== fetcher || result.reloadKey !== reloadKey);

  return {
    data: result.data,
    setData,
    loading,
    error: result.error,
    reload,
    lastUpdated: result.updatedAt,
  };
}
