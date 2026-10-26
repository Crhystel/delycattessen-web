import { apiClient } from "../../services/apiClient";
import { buildQuery } from "../../lib/query";

// Teachers' credit consumptions from day 1 of the current month until now.
export function getTeacherCreditReport(institution) {
  return apiClient(`/pos/reports/teacher-credit/${buildQuery({}, institution)}`);
}
