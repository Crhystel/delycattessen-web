import { apiClient } from "../../services/apiClient";
import { buildQuery } from "../../lib/query";

// Teachers' credit consumptions from day 1 of the current month until now.
export function getTeacherCreditReport(institution) {
  return apiClient(`/pos/reports/teacher-credit/${buildQuery({}, institution)}`);
}

// Queues the Excel build of that report (Celery). Answers right away with the
// export to follow: { id, status, error }.
export function requestTeacherCreditExport(institution) {
  return apiClient(
    `/pos/reports/teacher-credit/exports/${buildQuery({}, institution)}`,
    { method: "POST" },
  );
}

// status: PENDING | PROCESSING | DONE | FAILED
export function getTeacherCreditExport(exportId) {
  return apiClient(`/pos/reports/teacher-credit/exports/${exportId}/`);
}

// The finished .xlsx as a Blob.
export function downloadTeacherCreditExport(exportId) {
  return apiClient(`/pos/reports/teacher-credit/exports/${exportId}/download/`, {
    responseType: "blob",
  });
}
