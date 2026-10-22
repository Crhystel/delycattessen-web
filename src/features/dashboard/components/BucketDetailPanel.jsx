import { X } from "lucide-react";
import Card, { CardHeader } from "../../../components/ui/Card";
import ChannelBreakdown from "./ChannelBreakdown";
import TopProductsList from "./TopProductsList";
import { formatCount, formatMoney, rangeLabel } from "../dashboardUtils";

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-ink-50 px-4 py-3">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="text-lg font-bold text-ink-900 font-display">{value}</p>
    </div>
  );
}

// Detail of the day/week/month clicked on the chart: the same metrics as the
// dashboard, narrowed to that bucket's date range.
export default function BucketDetailPanel({ bucket, summary, top, onClose }) {
  const kpis = summary?.kpis;
  return (
    <Card>
      <CardHeader
        title="Detalle del periodo seleccionado"
        subtitle={
          <span className="block first-letter:uppercase">
            {rangeLabel(bucket)}
          </span>
        }
        action={
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-50"
          >
            <X size={16} />
          </button>
        }
      />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MiniStat
          label="Ingresos"
          value={kpis ? formatMoney(kpis.revenue.current) : "—"}
        />
        <MiniStat
          label="Transacciones"
          value={kpis ? formatCount(kpis.transactions.current) : "—"}
        />
        <MiniStat
          label="Ticket promedio"
          value={kpis ? formatMoney(kpis.average_ticket.current) : "—"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-ink-900 mb-2">Por canal</p>
          {summary && (
            <ChannelBreakdown channels={summary.channels} showChart={false} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900 mb-2">
            Productos más vendidos
          </p>
          <TopProductsList top={top} />
        </div>
      </div>
    </Card>
  );
}
