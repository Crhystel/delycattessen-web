import { useCallback, useEffect, useRef, useState } from "react";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import {
  downloadTeacherCreditExport,
  getTeacherCreditExport,
  requestTeacherCreditExport,
} from "../services";
import { saveBlob } from "../reportExport";

const POLL_MS = 2000;
const FINAL_STATUSES = ["DONE", "FAILED"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Excel or PDF export of the teachers' credit report. The server builds the
// file in a background queue: this asks for it, follows its status one request
// at a time until it is ready and then saves it. A server-side failure or
// timeout ends in FAILED, so the buttons always recover. `status` is null when
// idle, otherwise PENDING (queued) or PROCESSING (being built); `activeType`
// is the file type being built ("xlsx" | "pdf"), also null when idle.
export function useTeacherCreditExport() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();
  const [status, setStatus] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const mounted = useRef(true);

  // Stops following the export when leaving the page.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const startExport = useCallback(
    async ({ fileName, period, month, fileType }) => {
      setActiveType(fileType);
      setStatus("PENDING");
      try {
        let job = await requestTeacherCreditExport(selectedInstitution, {
          month,
          fileType,
        });
        while (mounted.current && !FINAL_STATUSES.includes(job.status)) {
          setStatus(job.status);
          await sleep(POLL_MS);
          if (!mounted.current) return false;
          job = await getTeacherCreditExport(job.id);
        }
        if (!mounted.current) return false;
        if (job.status === "FAILED") {
          throw new Error(job.error || "El servidor no pudo generar el archivo.");
        }
        saveBlob(fileName, await downloadTeacherCreditExport(job.id));
        toast.success(
          "Reporte exportado",
          `Consumos del ${period}, listo para Recursos Humanos.`,
        );
        return true;
      } catch (err) {
        toast.error("No se pudo exportar el reporte", err.message);
        return false;
      } finally {
        if (mounted.current) {
          setStatus(null);
          setActiveType(null);
        }
      }
    },
    [selectedInstitution, toast],
  );

  return { startExport, status, activeType, isExporting: status !== null };
}
