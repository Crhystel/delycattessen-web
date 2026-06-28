import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { DollarSign, Receipt, TrendingUp, Ticket, Download } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import StatCard from '../../components/ui/StatCard'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  kpisDashboard,
  ventasDiarias,
  ventasSemanales,
  rankingProductos,
} from '../../data/mockData'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold mb-0.5">{label}</p>
      <p>Ingresos: ${payload[0].value.toFixed(2)}</p>
    </div>
  )
}

export default function Dashboard() {
  const [periodo, setPeriodo] = useState('diario')
  const data = periodo === 'diario' ? ventasDiarias : ventasSemanales
  const xKey = periodo === 'diario' ? 'dia' : 'semana'
  const maxUnidades = Math.max(...rankingProductos.map((p) => p.unidades))

  return (
    <>
      <Topbar
        title="Analítica de Ventas"
        subtitle="Indicadores financieros y de demanda · actualización automática por transacción"
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            tone="brand"
            label="Ingresos de hoy"
            value={`$${kpisDashboard.ingresosHoy.toFixed(2)}`}
            hint="Martim Cereré + El Sauce"
          />
          <StatCard
            icon={TrendingUp}
            tone="teal"
            label="Ingresos de la semana"
            value={`$${kpisDashboard.ingresosSemana.toFixed(2)}`}
            hint="Semana en curso"
          />
          <StatCard
            icon={Receipt}
            tone="teal"
            label="Transacciones de hoy"
            value={kpisDashboard.transaccionesHoy}
            hint="Punto de venta, ambas sedes"
          />
          <StatCard
            icon={Ticket}
            tone="success"
            label="Ticket promedio"
            value={`$${kpisDashboard.ticketPromedio.toFixed(2)}`}
            hint={`Producto top: ${kpisDashboard.productoTop}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Ingresos por periodo"
              subtitle="Comparativo de ventas para soporte en la toma de decisiones"
              action={
                <div className="flex bg-ink-50 rounded-lg p-1 text-sm">
                  {['diario', 'semanal'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodo(p)}
                      className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                        periodo === p ? 'bg-white shadow-sm text-ink-900' : 'text-ink-500'
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
                <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4EBED" />
                  <XAxis
                    dataKey={xKey}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#5A7077' }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#5A7077' }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F4F8F9' }} />
                  <Bar dataKey="ingresos" fill="#FF6E00" radius={[8, 8, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Productos de mayor demanda"
              subtitle="Unidades vendidas en el periodo"
            />
            <div className="space-y-4">
              {rankingProductos.map((p, i) => (
                <div key={p.nombre}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-ink-700 truncate pr-2">
                      {i + 1}. {p.nombre}
                    </span>
                    <span className="text-ink-500 shrink-0">{p.unidades}u</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${(p.unidades / maxUnidades) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-ink-900">Reporte detallado del periodo</p>
            <p className="text-xs text-ink-500 mt-0.5">
              Exporta el desglose completo de ventas para análisis financiero externo.
            </p>
          </div>
          <Button variant="outline" icon={Download}>
            Exportar reporte
          </Button>
        </Card>
      </main>
    </>
  )
}
