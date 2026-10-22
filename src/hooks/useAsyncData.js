import { useCallback, useEffect, useState } from "react";
import { useToast } from "./useToast";

// Loads data through `fetcher` and tracks loading/error, ignoring responses
// that arrive after the component re-ran or unmounted.
//
// `fetcher` MUST have a stable identity (module-level function or
// useCallback): a new function re-triggers the load. Changing a dependency
// of that useCallback (e.g. the selected institution) reloads the data.
// Pass `errorTitle` to surface failures as a toast.
export function useAsyncData(
  fetcher,
  { initialData = null, enabled = true, errorTitle } = {},
) {
  const toast = useToast();
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({
    fetcher: null,
    reloadKey: -1,
    data: initialData,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ fetcher, reloadKey, data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setResult((prev) => ({ ...prev, fetcher, reloadKey, error }));
        if (errorTitle) toast.error(errorTitle, error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, enabled, reloadKey, errorTitle, toast]);

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

  return { data: result.data, setData, loading, error: result.error, reload };
}
