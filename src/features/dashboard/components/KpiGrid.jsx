import { DollarSign, Receipt, TrendingUp } from "lucide-react";
import StatCard from "../../../components/ui/StatCard";
import ChangeBadge from "./ChangeBadge";
import { formatCount, formatMoney } from "../dashboardUtils";

const KPIS = [
  {
    key: "revenue",
    label: "Ingresos",
    icon: DollarSign,
    tone: "brand",
    format: formatMoney,
  },
  {
    key: "transactions",
    label: "Transacciones",
    icon: Receipt,
    tone: "teal",
    format: formatCount,
  },
  {
    key: "average_ticket",
    label: "Ticket promedio",
    icon: TrendingUp,
    tone: "success",
    format: formatMoney,
  },
];

// `kpis` is the `kpis` object of the summary endpoint, or null while loading.
export default function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {KPIS.map(({ key, label, icon, tone, format }) => (
        <StatCard
          key={key}
          icon={icon}
          tone={tone}
          label={label}
          value={kpis ? format(kpis[key].current) : "—"}
          hint={kpis ? <ChangeBadge change={kpis[key].change_pct} /> : null}
        />
      ))}
    </div>
  );
}
