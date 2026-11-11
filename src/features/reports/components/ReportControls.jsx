import { FileSpreadsheet, FileText, Mail } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Field";

const EXPORT_STATUS_LABELS = {
  PENDING: "En cola…",
  PROCESSING: "Generando el archivo…",
};

const EXPORT_OPTIONS = [
  { fileType: "xlsx", label: "Exportar Excel", icon: FileSpreadsheet },
  { fileType: "pdf", label: "Exportar PDF", icon: FileText },
];

// Month picker plus the export / statements actions of the teacher credit
// report. Stacked full width on phones, one wrapping row from `sm`.
export default function ReportControls({
  month,
  maxMonth,
  onMonthChange,
  loading,
  isExporting,
  isEmpty,
  activeType,
  exportStatus,
  onExport,
  sending,
  canSendStatements,
  onSendStatements,
  hasQueued,
  onReload,
}) {
  return (
    <div className="flex flex-col gap-3 *:w-full sm:flex-row sm:flex-wrap sm:items-center sm:*:w-auto">
      <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
        Mes
        <div className="flex-1 sm:w-51 sm:flex-none">
          <Input
            type="month"
            value={month}
            max={maxMonth}
            disabled={isExporting}
            onChange={(e) => e.target.value && onMonthChange(e.target.value)}
          />
        </div>
      </label>
      {EXPORT_OPTIONS.map(({ fileType, label, icon }) => (
        <Button
          key={fileType}
          icon={icon}
          variant={fileType === "xlsx" ? "primary" : "outline"}
          onClick={() => onExport(fileType)}
          disabled={loading || isExporting || isEmpty}
        >
          {activeType === fileType ? EXPORT_STATUS_LABELS[exportStatus] : label}
        </Button>
      ))}
      <Button
        icon={Mail}
        variant="secondary"
        onClick={onSendStatements}
        disabled={loading || isExporting || sending || isEmpty || !canSendStatements}
      >
        Enviar estado de cuenta
      </Button>
      {hasQueued && (
        <Button variant="ghost" onClick={onReload} disabled={loading}>
          Actualizar estados
        </Button>
      )}
    </div>
  );
}
