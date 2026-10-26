import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import { getTeacherCreditReport } from "../services";
import { adaptReport, reportFileName } from "../reportUtils";
import { buildReportRows, downloadCsv } from "../reportExport";

// Teachers' credit report of the current month for the selected institution
// and the action that exports it to CSV for Human Resources.
export function useTeacherCreditReport() {
  const toast = useToast();
  const { selectedInstitution, selectedInstitutionName } = useInstitution();

  const fetchReport = useCallback(
    async () => adaptReport(await getTeacherCreditReport(selectedInstitution)),
    [selectedInstitution],
  );
  const { data: report, loading, error, reload } = useAsyncData(fetchReport, {
    errorTitle: "No se pudo cargar el reporte",
  });

  // Asks the server again so the file covers until the moment of exporting.
  const exportReport = useCallback(async () => {
    try {
      const fresh = adaptReport(
        await getTeacherCreditReport(selectedInstitution),
      );
      downloadCsv(
        reportFileName(selectedInstitutionName, fresh.dateTo),
        buildReportRows(fresh, selectedInstitutionName, new Date()),
      );
      toast.success(
        "Reporte exportado",
        `Consumos del ${fresh.period}, listo para Recursos Humanos.`,
      );
      return true;
    } catch (err) {
      toast.error("No se pudo exportar el reporte", err.message);
      return false;
    }
  }, [selectedInstitution, selectedInstitutionName, toast]);

  return { report, loading, error, reload, exportReport };
}
