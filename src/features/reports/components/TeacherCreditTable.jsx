import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { formatAmount } from "../reportUtils";

function SalesDetail({ sales }) {
  return (
    <tr className="bg-ink-50/60">
      <td colSpan={6} className="px-5 py-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-ink-400">
              <th className="py-1 font-medium">Fecha</th>
              <th className="py-1 font-medium">Hora</th>
              <th className="py-1 font-medium">Productos</th>
              <th className="py-1 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="text-ink-700">
                <td className="py-1">{sale.date}</td>
                <td className="py-1">{sale.time}</td>
                <td className="py-1">{sale.products}</td>
                <td className="py-1 text-right">{formatAmount(sale.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// Whether the teacher already got the statement of this (closed) month.
function StatementBadge({ teacher }) {
  if (teacher.statementStatus === "SENT") {
    const day = new Date(teacher.statementSentAt).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
    });
    return <Badge tone="success">Enviado {day}</Badge>;
  }
  if (teacher.statementStatus === "QUEUED") {
    return <Badge tone="warning">En cola</Badge>;
  }
  if (teacher.statementStatus === "FAILED") {
    return <Badge tone="danger">Fallido</Badge>;
  }
  return <span className="text-ink-300">—</span>;
}

function TeacherRow({ teacher, expanded, onToggle }) {
  const Chevron = expanded ? ChevronDown : ChevronRight;
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-ink-100 hover:bg-ink-50/60 cursor-pointer"
      >
        <td className="px-5 py-3 font-medium text-ink-900">
          <span className="inline-flex items-center gap-1.5">
            <Chevron size={14} className="text-ink-400" />
            {teacher.fullName}
          </span>
        </td>
        <td className="px-5 py-3 text-ink-500">{teacher.email || "—"}</td>
        <td className="px-5 py-3 text-ink-500">{teacher.institutionName}</td>
        <td className="px-5 py-3 text-ink-700">{teacher.consumptions}</td>
        <td className="px-5 py-3 text-right font-semibold text-ink-900">
          {formatAmount(teacher.total)}
        </td>
        <td className="px-5 py-3">
          <StatementBadge teacher={teacher} />
        </td>
      </tr>
      {expanded && <SalesDetail sales={teacher.sales} />}
    </>
  );
}

// Summary per teacher; a click on a row shows each of their consumptions.
export default function TeacherCreditTable({ report, loading }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const teachers = report?.teachers ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-ink-100">
            <th className="px-5 py-3 font-medium">Docente</th>
            <th className="px-5 py-3 font-medium">Correo</th>
            <th className="px-5 py-3 font-medium">Sede</th>
            <th className="px-5 py-3 font-medium">N.º de consumos</th>
            <th className="px-5 py-3 font-medium text-right">Total</th>
            <th className="px-5 py-3 font-medium">Estado de cuenta</th>
          </tr>
        </thead>
        <tbody>
          {(loading || teachers.length === 0) && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-ink-300">
                {loading
                  ? "Cargando reporte..."
                  : "No hay consumos a crédito en este mes."}
              </td>
            </tr>
          )}
          {!loading &&
            teachers.map((teacher) => (
              <TeacherRow
                key={teacher.key}
                teacher={teacher}
                expanded={expandedKey === teacher.key}
                onToggle={() =>
                  setExpandedKey((current) =>
                    current === teacher.key ? null : teacher.key,
                  )
                }
              />
            ))}
        </tbody>
        {!loading && teachers.length > 0 && (
          <tfoot>
            <tr>
              <td
                colSpan={4}
                className="px-5 py-3 text-right text-sm font-semibold text-ink-500"
              >
                Total general
              </td>
              <td
                colSpan={2}
                className="px-5 py-3 text-right text-sm font-bold text-brand-600"
              >
                {formatAmount(report.totals.amount)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
