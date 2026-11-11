import { useState } from "react";
import { FileSpreadsheet, GraduationCap, Wallet } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card, { CardHeader } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import PageContainer from "../../components/ui/PageContainer";
import { useInstitution } from "../../context/InstitutionContext";
import { useTeacherCreditReport } from "./hooks/useTeacherCreditReport";
import { useTeacherCreditExport } from "./hooks/useTeacherCreditExport";
import { useTeacherCreditStatements } from "./hooks/useTeacherCreditStatements";
import { currentMonth, formatAmount, reportFileName } from "./reportUtils";
import TeacherCreditTable from "./components/TeacherCreditTable";
import SendStatementsModal from "./components/SendStatementsModal";
import ReportControls from "./components/ReportControls";

// HU-08.2: teachers' credit consumptions of a month (the current one from day 1
// until today, or a complete past one), exported to Excel or PDF (built in the
// background by the server) for Human Resources.
export default function TeacherConsumptionReportPage() {
  const { selectedInstitutionName } = useInstitution();
  const thisMonth = currentMonth();
  const [month, setMonth] = useState(thisMonth);
  // The current month is asked for as "empty", so the server decides "until now".
  const requestedMonth = month === thisMonth ? "" : month;
  const { report, loading, error, reload } = useTeacherCreditReport(requestedMonth);
  const { startExport, status, activeType, isExporting } = useTeacherCreditExport();
  const { sendStatements, sending } = useTeacherCreditStatements(
    requestedMonth,
    reload,
  );
  const [statementsOpen, setStatementsOpen] = useState(false);

  const period = report?.period ?? "mes en curso";
  const totals = report?.totals;
  const isEmpty = !report || report.teachers.length === 0;
  // Statements are mailed only for a closed month (the server enforces it too).
  const isClosedMonth = requestedMonth !== "";
  const hasQueued = report?.teachers.some((t) => t.statementStatus === "QUEUED");

  async function handleSendStatements(resend) {
    if (await sendStatements({ resend })) setStatementsOpen(false);
  }

  function handleExport(fileType) {
    startExport({
      fileName: reportFileName(
        selectedInstitutionName,
        report.dateFrom,
        report.dateTo,
        fileType,
      ),
      period,
      month: requestedMonth,
      fileType,
    });
  }

  return (
    <>
      <Topbar
        title="Consumo a Crédito · Docentes"
        subtitle={`Consumos del ${period} para el departamento de Recursos Humanos`}
      />

      <PageContainer spacing={6}>
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
          <div className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <CardHeader
              title="Detalle por docente"
              subtitle={`Del ${period} · haz clic en un docente para ver cada consumo`}
            />
            <ReportControls
              month={month}
              maxMonth={thisMonth}
              onMonthChange={setMonth}
              loading={loading}
              isExporting={isExporting}
              isEmpty={isEmpty}
              activeType={activeType}
              exportStatus={status}
              onExport={handleExport}
              sending={sending}
              canSendStatements={isClosedMonth}
              onSendStatements={() => setStatementsOpen(true)}
              hasQueued={hasQueued}
              onReload={reload}
            />
            {!isClosedMonth && (
              <p className="w-full text-xs text-ink-400">
                El estado de cuenta a los docentes se envía cuando el mes cierra:
                elige un mes anterior para enviarlo.
              </p>
            )}
          </div>
          <TeacherCreditTable report={report} loading={loading} />
        </Card>

        {statementsOpen && (
          <SendStatementsModal
            report={report}
            sending={sending}
            onClose={() => setStatementsOpen(false)}
            onConfirm={handleSendStatements}
          />
        )}
      </PageContainer>
    </>
  );
}
