import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { getTeacherCreditReport } from "../services";
import { adaptReport } from "../reportUtils";

// Teachers' credit report of the current month for the selected institution.
// (Its Excel export lives in useTeacherCreditExport.)
export function useTeacherCreditReport() {
  const { selectedInstitution } = useInstitution();

  const fetchReport = useCallback(
    async () => adaptReport(await getTeacherCreditReport(selectedInstitution)),
    [selectedInstitution],
  );
  const { data: report, loading, error, reload } = useAsyncData(fetchReport, {
    errorTitle: "No se pudo cargar el reporte",
  });

  return { report, loading, error, reload };
}
