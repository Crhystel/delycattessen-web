import { apiClient } from "../../services/apiClient";
import { buildQuery } from "../../lib/query";

// Teachers' credit consumptions of a month: the current one (empty `month`, day
// 1 until now) or a complete past one ("YYYY-MM").
export function getTeacherCreditReport(institution, month) {
  return apiClient(
    `/pos/reports/teacher-credit/${buildQuery({ month }, institution)}`,
  );
}

// Queues the build of that report as a file (Celery): fileType "xlsx" or "pdf".
// Answers right away with the export to follow: { id, status, error }.
export function requestTeacherCreditExport(institution, { month, fileType }) {
  return apiClient(
    `/pos/reports/teacher-credit/exports/${buildQuery({ month, file_type: fileType }, institution)}`,
    { method: "POST" },
  );
}

// Emails each teacher the credit statement of a CLOSED month ("YYYY-MM"; the
// server rejects the month in progress). `resend` also mails the ones already
// sent. Answers { queued, already_sent, without_email }.
export function sendTeacherCreditStatements(institution, { month, resend }) {
  return apiClient(
    `/pos/reports/teacher-credit/statements/${buildQuery({ month }, institution)}`,
    { method: "POST", body: { resend } },
  );
}

// status: PENDING | PROCESSING | DONE | FAILED
export function getTeacherCreditExport(exportId) {
  return apiClient(`/pos/reports/teacher-credit/exports/${exportId}/`);
}

// The finished file (.xlsx or .pdf) as a Blob.
export function downloadTeacherCreditExport(exportId) {
  return apiClient(`/pos/reports/teacher-credit/exports/${exportId}/download/`, {
    responseType: "blob",
  });
}
