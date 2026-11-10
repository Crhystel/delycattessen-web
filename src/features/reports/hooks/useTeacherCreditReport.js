import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { getTeacherCreditReport } from "../services";
import { adaptReport } from "../reportUtils";

// Teachers' credit report of a month ("" = the current one) for the selected
// institution. (Its Excel and PDF export lives in useTeacherCreditExport.)
export function useTeacherCreditReport(month) {
  const { selectedInstitution } = useInstitution();

  const fetchReport = useCallback(
    async () =>
      adaptReport(await getTeacherCreditReport(selectedInstitution, month)),
    [selectedInstitution, month],
  );
  const { data: report, loading, error, reload } = useAsyncData(fetchReport, {
    errorTitle: "No se pudo cargar el reporte",
  });

  return { report, loading, error, reload };
}
