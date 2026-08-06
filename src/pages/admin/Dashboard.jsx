import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Wallet,
  Banknote,
  CalendarDays,
} from "lucide-react";
import Topbar from "../../components/admin/Topbar";
import StatCard from "../../components/ui/StatCard";
import Card, { CardHeader } from "../../components/ui/Card";
import { salesByInstitution } from "../../data/mockData";
import { useInstitution } from "../../context/InstitutionContext";

const COLOR_DIGITAL = "#14b8a6";
const COLOR_CASH = "#FF6E00";

function dateDetail(row) {
  if (row.date) {
    return new Date(`${row.date}T00:00:00`).toLocaleDateString("es-EC", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
  if (row.range) return row.range;
  if (row.year) return `${row.year}`;
  return null;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  const dateLabel = dateDetail(payload[0]?.payload ?? {});
  return (
    <div className="bg-ink-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg space-y-1 min-w-[180px]">
      <p className="font-semibold mb-1 capitalize">
        {label}
        {dateLabel ? ` · ${dateLabel}` : ""}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{ color: entry.color }}
          className="flex justify-between gap-4"
        >
          <span>{entry.name === "digital" ? "Digital" : "Efectivo"}</span>
          <span>
            ${entry.value.toFixed(2)} ({Math.round((entry.value / total) * 100)}
            %)
          </span>
        </p>
      ))}
      <p className="flex justify-between gap-4 font-semibold border-t border-white/15 mt-1 pt-1">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </p>
    </div>
  );
}

const PERIOD_DATA_KEY = {
  diario: "daily",
  semanal: "weekly",
  mensual: "monthly",
};
const PERIOD_X_KEY = { diario: "day", semanal: "week", mensual: "month" };

export default function Dashboard() {
  const { selectedInstitution, selectedInstitutionName } = useInstitution();
  const [period, setPeriod] = useState("diario");
  const [selection, setSelection] = useState(null);
  const mockInstitutionId =
    typeof selectedInstitution === "number"
      ? selectedInstitution
      : Object.keys(salesByInstitution)[0];

  const currentContext = `${mockInstitutionId}-${period}`;
  const activeDetail = selection?.context === currentContext ? selection : null;
  const barDetail = activeDetail?.type === "bar" ? activeDetail : null;
  const channelDetail =
    activeDetail?.type === "channel" ? activeDetail.channel : null;

  const salesData = salesByInstitution[mockInstitutionId];
  const data = salesData[PERIOD_DATA_KEY[period]];
  const xKey = PERIOD_X_KEY[period];
  const top5Ranking = salesData.ranking.slice(0, 5);
  const maxUnits = Math.max(...top5Ranking.map((p) => p.units));

  const busiestDay = salesData.daily.reduce((max, d) =>
    d.digital + d.cash > max.digital + max.cash ? d : max,
  );

  const totalDigital = data.reduce((s, d) => s + d.digital, 0);
  const totalCash = data.reduce((s, d) => s + d.cash, 0);
  const totalPeriod = totalDigital + totalCash;

  const channelData = [
    { name: "Digital", value: totalDigital, color: COLOR_DIGITAL },
    { name: "Efectivo", value: totalCash, color: COLOR_CASH },
  ];

  return (
    <>
      <Topbar
        title="Analítica de Ventas"
        subtitle="Indicadores financieros y de demanda · actualización automática por transacción"
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={DollarSign}
            tone="brand"
            label="Ingresos de hoy"
            value={`$${salesData.kpis.revenueToday.toFixed(2)}`}
            hint={selectedInstitutionName}
          />
          <StatCard
            icon={TrendingUp}
            tone="teal"
            label="Ingresos de la semana"
            value={`$${salesData.kpis.revenueWeek.toFixed(2)}`}
            hint="Semana en curso"
          />
          <StatCard
            icon={Receipt}
            tone="teal"
            label="Transacciones de hoy"
            value={salesData.kpis.transactionsToday}
            hint="Punto de venta"
          />
        </div>

        {/* Digital vs cash breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Ingresos digitales</p>
              <p className="font-display font-bold text-xl text-ink-900">
                ${totalDigital.toFixed(2)}
              </p>
              <p className="text-xs text-teal-600 font-medium">
                {Math.round((totalDigital / totalPeriod) * 100)}% del total
              </p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Ingresos en efectivo</p>
              <p className="font-display font-bold text-xl text-ink-900">
                ${totalCash.toFixed(2)}
              </p>
              <p className="text-xs text-brand-600 font-medium">
                {Math.round((totalCash / totalPeriod) * 100)}% del total
              </p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Total del periodo</p>
              <p className="font-display font-bold text-xl text-ink-900">
                ${totalPeriod.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Día de mayor actividad</p>
              <p className="font-display font-bold text-xl text-ink-900">
                {busiestDay.day}
              </p>
              <p className="text-xs text-brand-600 font-medium">
                ${(busiestDay.digital + busiestDay.cash).toFixed(2)} en ventas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Ingresos por canal y periodo"
              subtitle="Digital (billetera) vs efectivo — pasa el cursor o haz clic en una barra para ver el detalle"
              action={
                <div className="flex bg-ink-50 rounded-lg p-1 text-sm">
                  {["diario", "semanal", "mensual"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                        period === p
                          ? "bg-white shadow-sm text-ink-900"
                          : "text-ink-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="#E4EBED" />
                  <XAxis
                    dataKey={xKey}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#5A7077" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#5A7077" }}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "#F4F8F9" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                    formatter={(value) =>
                      value === "digital" ? "Digital" : "Efectivo"
                    }
                  />
                  <Bar
                    dataKey="digital"
                    name="digital"
                    stackId="a"
                    fill={COLOR_DIGITAL}
                    radius={[0, 0, 0, 0]}
                    maxBarSize={48}
                    cursor="pointer"
                    onClick={(entry) =>
                      setSelection({
                        context: currentContext,
                        type: "bar",
                        row: entry.payload,
                        channel: "digital",
                      })
                    }
                  />
                  <Bar
                    dataKey="cash"
                    name="cash"
                    stackId="a"
                    fill={COLOR_CASH}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    cursor="pointer"
                    onClick={(entry) =>
                      setSelection({
                        context: currentContext,
                        type: "bar",
                        row: entry.payload,
                        channel: "cash",
                      })
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {barDetail && (
              <div className="mt-3 text-xs bg-ink-50 rounded-lg px-3 py-2 flex items-center justify-between flex-wrap gap-2">
                <span className="font-medium text-ink-700 capitalize">
                  {barDetail.row[xKey]}
                  {dateDetail(barDetail.row)
                    ? ` · ${dateDetail(barDetail.row)}`
                    : ""}
                </span>
                <span
                  style={{
                    color:
                      barDetail.channel === "digital"
                        ? COLOR_DIGITAL
                        : COLOR_CASH,
                  }}
                  className="font-semibold"
                >
                  {barDetail.channel === "digital" ? "Digital" : "Efectivo"}: $
                  {barDetail.row[barDetail.channel].toFixed(2)} (
                  {Math.round(
                    (barDetail.row[barDetail.channel] /
                      (barDetail.row.digital + barDetail.row.cash)) *
                      100,
                  )}
                  %)
                </span>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Distribución por canal de pago"
              subtitle="Participación digital vs efectivo — haz clic en un segmento"
            />
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    cursor="pointer"
                    onClick={(entry) =>
                      setSelection({
                        context: currentContext,
                        type: "channel",
                        channel: entry,
                      })
                    }
                  >
                    {channelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `$${value.toFixed(2)} (${Math.round((value / totalPeriod) * 100)}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs mt-1">
              {channelData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-ink-500">{c.name}</span>
                </div>
              ))}
            </div>
            {channelDetail && (
              <div className="mt-2 text-xs bg-ink-50 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-medium text-ink-700">
                  {channelDetail.name}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: channelDetail.color }}
                >
                  ${channelDetail.value.toFixed(2)} (
                  {Math.round((channelDetail.value / totalPeriod) * 100)}%)
                </span>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Productos de mayor demanda"
            subtitle="Top 5 por unidades vendidas en el periodo"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {top5Ranking.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-ink-700 truncate pr-2">
                    {i + 1}. {p.name}
                  </span>
                  <span className="text-ink-500 shrink-0">{p.units}u</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(p.units / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
