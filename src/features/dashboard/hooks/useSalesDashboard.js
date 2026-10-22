import { useCallback, useState } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { getSalesSummary, getSalesTimeseries, getTopProducts } from "../services";
import {
  DEFAULT_PRESET,
  REFRESH_INTERVAL_MS,
  defaultGranularity,
  presetRange,
} from "../dashboardUtils";

const LIVE = { refreshInterval: REFRESH_INTERVAL_MS };

// Period, granularity and the clicked bucket, plus the metrics for all of them.
// Everything refreshes in the background every REFRESH_INTERVAL_MS, so new
// sales show up without reloading the page.
export function useSalesDashboard() {
  const { selectedInstitution } = useInstitution();
  const [presetId, setPresetId] = useState(DEFAULT_PRESET);
  const [range, setRange] = useState(() => presetRange(DEFAULT_PRESET));
  const [granularityChoice, setGranularityChoice] = useState(null);
  const [picked, setPicked] = useState(null);

  const granularity = granularityChoice ?? defaultGranularity(range);
  // A clicked bucket only makes sense for the view it was clicked on, so it is
  // ignored as soon as the institution, range or granularity changes.
  const scope = `${selectedInstitution ?? "own"}|${range.date_from}|${range.date_to}|${granularity}`;
  const bucket = picked?.scope === scope ? picked : null;
  const bucketFrom = bucket?.date_from;
  const bucketTo = bucket?.date_to;

  const fetchSummary = useCallback(
    () => getSalesSummary(range, selectedInstitution),
    [range, selectedInstitution],
  );
  const fetchTimeseries = useCallback(
    () => getSalesTimeseries(range, granularity, selectedInstitution),
    [range, granularity, selectedInstitution],
  );
  const fetchTop = useCallback(
    () => getTopProducts(range, selectedInstitution),
    [range, selectedInstitution],
  );
  const fetchBucketSummary = useCallback(
    () =>
      getSalesSummary(
        { date_from: bucketFrom, date_to: bucketTo },
        selectedInstitution,
      ),
    [bucketFrom, bucketTo, selectedInstitution],
  );
  const fetchBucketTop = useCallback(
    () =>
      getTopProducts(
        { date_from: bucketFrom, date_to: bucketTo },
        selectedInstitution,
      ),
    [bucketFrom, bucketTo, selectedInstitution],
  );

  const summary = useAsyncData(fetchSummary, LIVE);
  const timeseries = useAsyncData(fetchTimeseries, {
    ...LIVE,
    initialData: [],
  });
  const top = useAsyncData(fetchTop, LIVE);
  const bucketSummary = useAsyncData(fetchBucketSummary, {
    ...LIVE,
    enabled: Boolean(bucket),
  });
  const bucketTop = useAsyncData(fetchBucketTop, {
    ...LIVE,
    enabled: Boolean(bucket),
  });

  const selectPreset = useCallback((id) => {
    setPresetId(id);
    setRange(presetRange(id));
    setGranularityChoice(null);
    setPicked(null);
  }, []);

  // Ignores an inverted range: the date inputs are controlled, so they snap back.
  const setCustomRange = useCallback((next) => {
    if (!next.date_from || !next.date_to || next.date_from > next.date_to) {
      return;
    }
    setPresetId(null);
    setRange(next);
    setGranularityChoice(null);
    setPicked(null);
  }, []);

  const setGranularity = useCallback((next) => {
    setGranularityChoice(next);
    setPicked(null);
  }, []);

  const selectBucket = useCallback(
    (row) =>
      setPicked({
        scope,
        bucket_start: row.bucket_start,
        date_from: row.date_from,
        date_to: row.date_to,
      }),
    [scope],
  );

  const reloadSummary = summary.reload;
  const reloadTimeseries = timeseries.reload;
  const reloadTop = top.reload;
  const reload = useCallback(() => {
    reloadSummary();
    reloadTimeseries();
    reloadTop();
  }, [reloadSummary, reloadTimeseries, reloadTop]);

  return {
    presetId,
    range,
    granularity,
    summary,
    timeseries,
    top,
    bucket,
    bucketSummary,
    bucketTop,
    selectPreset,
    setCustomRange,
    setGranularity,
    selectBucket,
    clearBucket: () => setPicked(null),
    reload,
  };
}
