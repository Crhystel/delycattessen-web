import { useMemo, useState } from "react";
import { MousePointerClick } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useInstitution } from "../../context/InstitutionContext";
import { useSalesDashboard } from "./hooks/useSalesDashboard";
import { hasSales, rangeLabel, toChartData } from "./dashboardUtils";
import PeriodSelector from "./components/PeriodSelector";
import LastUpdated from "./components/LastUpdated";
import KpiGrid from "./components/KpiGrid";
import SalesTrendChart from "./components/SalesTrendChart";
import ChannelBreakdown from "./components/ChannelBreakdown";
import TopProductsList from "./components/TopProductsList";
import BucketDetailPanel from "./components/BucketDetailPanel";

export default function DashboardPage() {
  const { selectedInstitutionName } = useInstitution();
  const dashboard = useSalesDashboard();
  const { summary, timeseries, top, bucket, range, granularity } = dashboard;
  const [highlighted, setHighlighted] = useState(null);

  const chartData = useMemo(
    () => toChartData(timeseries.data, granularity),
    [timeseries.data, granularity],
  );
  const toggleChannel = (key) =>
    setHighlighted((current) => (current === key ? null : key));

  const failed = summary.error || timeseries.error || top.error;
  const noSales = summary.data && !hasSales(summary.data);

  return (
    <>
      <Topbar
        title="Analítica de Ventas"
        subtitle={`Ingresos, canales y productos de ${selectedInstitutionName} · se actualiza cada 30 s`}
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PeriodSelector
            presetId={dashboard.presetId}
            range={range}
            granularity={granularity}
            onPreset={dashboard.selectPreset}
            onRange={dashboard.setCustomRange}
            onGranularity={dashboard.setGranularity}
          />
          <LastUpdated
            lastUpdated={summary.lastUpdated}
            onRefresh={dashboard.reload}
          />
        </div>

        {failed && (
          <div className="rounded-xl bg-danger-50 text-danger-600 text-sm px-4 py-3 flex items-center justify-between gap-3">
            <span>No se pudieron cargar las métricas: {failed.message}</span>
            <Button variant="outline" onClick={dashboard.reload}>
              Reintentar
            </Button>
          </div>
        )}

        <KpiGrid kpis={summary.data?.kpis ?? null} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader
              title="Ventas en el tiempo"
              subtitle={`${rangeLabel(range)} · haz clic en una barra para ver su detalle`}
            />
            {noSales ? (
              <p className="text-sm text-ink-300 py-20 text-center">
                Sin ventas en este periodo.
              </p>
            ) : (
              <div className={timeseries.loading ? "opacity-50" : ""}>
                <SalesTrendChart
                  data={chartData}
                  selectedStart={bucket?.bucket_start}
                  highlighted={highlighted}
                  onSelect={dashboard.selectBucket}
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Canales de venta"
              subtitle="Haz clic para resaltar un canal"
            />
            {summary.data ? (
              <ChannelBreakdown
                channels={summary.data.channels}
                highlighted={highlighted}
                onToggle={toggleChannel}
              />
            ) : (
              <p className="text-sm text-ink-300 py-10 text-center">
                Cargando...
              </p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card>
            <CardHeader
              title="Productos más vendidos"
              subtitle={rangeLabel(range)}
            />
            <TopProductsList top={top.data} />
          </Card>

          <div className="xl:col-span-2">
            {bucket ? (
              <BucketDetailPanel
                bucket={bucket}
                summary={dashboard.bucketSummary.data}
                top={dashboard.bucketTop.data}
                onClose={dashboard.clearBucket}
              />
            ) : (
              <Card className="h-full flex flex-col items-center justify-center text-center gap-2 py-12">
                <MousePointerClick size={28} className="text-ink-300" />
                <p className="text-sm font-medium text-ink-700">
                  Detalle por día, semana o mes
                </p>
                <p className="text-xs text-ink-300 max-w-xs">
                  Haz clic en una barra del gráfico para ver sus ingresos,
                  canales y productos.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
