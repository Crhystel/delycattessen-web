import { apiClient } from "../../services/apiClient";
import { buildQuery } from "../../lib/query";

// `range` is { date_from, date_to } (inclusive, YYYY-MM-DD).
export function getSalesSummary(range, institution) {
  return apiClient(`/pos/analytics/summary/${buildQuery(range, institution)}`);
}

export function getSalesTimeseries(range, granularity, institution) {
  return apiClient(
    `/pos/analytics/timeseries/${buildQuery({ ...range, granularity }, institution)}`,
  );
}

// Combos sold at the POS, ranked apart from the products, with the totals.
export function getTopCombos(range, institution) {
  return apiClient(`/pos/analytics/top-combos/${buildQuery(range, institution)}`);
}

export function getTopProducts(range, institution) {
  return apiClient(
    `/pos/analytics/top-products/${buildQuery(range, institution)}`,
  );
}
