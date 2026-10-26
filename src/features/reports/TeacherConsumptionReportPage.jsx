import { useState } from "react";
import { Download, GraduationCap, Wallet, FileSpreadsheet } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card, { CardHeader } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import { useInstitution } from "../../context/InstitutionContext";
import { useTeacherCreditReport } from "./hooks/useTeacherCreditReport";
import { formatAmount } from "./reportUtils";
import TeacherCreditTable from "./components/TeacherCreditTable";

// HU-08.2: teachers' credit consumptions from day 1 of the month until today,
// exported to CSV for Human Resources.
export default function TeacherConsumptionReportPage() {
  const { selectedInstitutionName } = useInstitution();
  const { report, loading, error, reload, exportReport } =
    useTeacherCreditReport();
  const [exporting, setExporting] = useState(false);

  const period = report?.period ?? "mes en curso";
  const totals = report?.totals;
  const isEmpty = !report || report.teachers.length === 0;

  async function handleExport() {
    setExporting(true);
    await exportReport();
    setExporting(false);
  }

  return (
    <>
      <Topbar
        title="Consumo a Crédito · Docentes"
        subtitle={`Consumos del ${period} para el departamento de Recursos Humanos`}
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={GraduationCap}
            tone="teal"
            label="Docentes con consumo"
            value={totals ? totals.teachers : "—"}
            hint={period}
          />
          <StatCard
            icon={Wallet}
            tone="brand"
            label="Total a consolidar"
            value={totals ? formatAmount(totals.amount) : "—"}
            hint="Para descuento por RR. HH."
          />
          <StatCard
            icon={FileSpreadsheet}
            tone="success"
            label="Consumos registrados"
            value={totals ? totals.consumptions : "—"}
            hint={selectedInstitutionName}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-danger-50 text-danger-600 text-sm px-4 py-3 flex items-center justify-between gap-3">
            <span>No se pudo cargar el reporte: {error.message}</span>
            <Button variant="outline" onClick={reload}>
              Reintentar
            </Button>
          </div>
        )}

        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <CardHeader
              title="Detalle por docente"
              subtitle={`Del ${period} · haz clic en un docente para ver cada consumo`}
            />
            <Button
              icon={Download}
              onClick={handleExport}
              disabled={loading || exporting || isEmpty}
            >
              {exporting ? "Exportando..." : "Exportar para RR. HH. (CSV)"}
            </Button>
          </div>
          <TeacherCreditTable report={report} loading={loading} />
        </Card>
      </main>
    </>
  );
}
