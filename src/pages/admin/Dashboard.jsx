import { useState } from 'react'
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
} from 'recharts'
import { DollarSign, Receipt, TrendingUp, Wallet, Banknote, CalendarDays } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import StatCard from '../../components/ui/StatCard'
import Card, { CardHeader } from '../../components/ui/Card'
import { ventasPorInstitucion } from '../../data/mockData'
import { useInstitucion } from '../../context/InstitucionContext'

const COLOR_DIGITAL = '#14b8a6'
const COLOR_EFECTIVO = '#FF6E00'

function fechaDetalle(fila) {
  if (fila.fecha) {
    return new Date(`${fila.fecha}T00:00:00`).toLocaleDateString('es-EC', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }
  if (fila.rango) return fila.rango
  if (fila.anio) return `${fila.anio}`
  return null
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + p.value, 0)
  const fecha = fechaDetalle(payload[0]?.payload ?? {})
  return (
    <div className="bg-ink-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg space-y-1 min-w-[180px]">
      <p className="font-semibold mb-1 capitalize">
        {label}
        {fecha ? ` · ${fecha}` : ''}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="flex justify-between gap-4">
          <span>{entry.name === 'digital' ? 'Digital' : 'Efectivo'}</span>
          <span>
            ${entry.value.toFixed(2)} ({Math.round((entry.value / total) * 100)}%)
          </span>
        </p>
      ))}
      <p className="flex justify-between gap-4 font-semibold border-t border-white/15 mt-1 pt-1">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </p>
    </div>
  )
}

const PERIODO_XKEY = { diario: 'dia', semanal: 'semana', mensual: 'mes' }

export default function Dashboard() {
  const { institucionSeleccionada } = useInstitucion()
  const [periodo, setPeriodo] = useState('diario')
  const [seleccion, setSeleccion] = useState(null)

  const contextoActual = `${institucionSeleccionada.id}-${periodo}`
  const detalleActivo = seleccion?.contexto === contextoActual ? seleccion : null
  const detalleBarra = detalleActivo?.tipo === 'barra' ? detalleActivo : null
  const detalleCanal = detalleActivo?.tipo === 'canal' ? detalleActivo.canal : null

  const datos = ventasPorInstitucion[institucionSeleccionada.id]
  const data = datos[periodo]
  const xKey = PERIODO_XKEY[periodo]
  const rankingTop5 = datos.ranking.slice(0, 5)
  const maxUnidades = Math.max(...rankingTop5.map((p) => p.unidades))

  const diaMayorActividad = datos.diario.reduce((max, d) =>
    d.digital + d.efectivo > max.digital + max.efectivo ? d : max
  )

  const totalDigital = data.reduce((s, d) => s + d.digital, 0)
  const totalEfectivo = data.reduce((s, d) => s + d.efectivo, 0)
  const totalPeriodo = totalDigital + totalEfectivo

  const canalData = [
    { name: 'Digital', value: totalDigital, color: COLOR_DIGITAL },
    { name: 'Efectivo', value: totalEfectivo, color: COLOR_EFECTIVO },
  ]

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
            value={`$${datos.kpis.ingresosHoy.toFixed(2)}`}
            hint={institucionSeleccionada.nombre}
          />
          <StatCard
            icon={TrendingUp}
            tone="teal"
            label="Ingresos de la semana"
            value={`$${datos.kpis.ingresosSemana.toFixed(2)}`}
            hint="Semana en curso"
          />
          <StatCard
            icon={Receipt}
            tone="teal"
            label="Transacciones de hoy"
            value={datos.kpis.transaccionesHoy}
            hint="Punto de venta"
          />
        </div>

        {/* Desglose digital vs efectivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Ingresos digitales</p>
              <p className="font-display font-bold text-xl text-ink-900">${totalDigital.toFixed(2)}</p>
              <p className="text-xs text-teal-600 font-medium">{Math.round((totalDigital / totalPeriodo) * 100)}% del total</p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Ingresos en efectivo</p>
              <p className="font-display font-bold text-xl text-ink-900">${totalEfectivo.toFixed(2)}</p>
              <p className="text-xs text-brand-600 font-medium">{Math.round((totalEfectivo / totalPeriodo) * 100)}% del total</p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Total del periodo</p>
              <p className="font-display font-bold text-xl text-ink-900">${totalPeriodo.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-ink-500">Día de mayor actividad</p>
              <p className="font-display font-bold text-xl text-ink-900">{diaMayorActividad.dia}</p>
              <p className="text-xs text-brand-600 font-medium">
                ${(diaMayorActividad.digital + diaMayorActividad.efectivo).toFixed(2)} en ventas
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
                  {['diario', 'semanal', 'mensual'].map((p) => (
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
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                    formatter={(value) => (value === 'digital' ? 'Digital' : 'Efectivo')}
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
                      setSeleccion({ contexto: contextoActual, tipo: 'barra', fila: entry.payload, canal: 'digital' })
                    }
                  />
                  <Bar
                    dataKey="efectivo"
                    name="efectivo"
                    stackId="a"
                    fill={COLOR_EFECTIVO}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    cursor="pointer"
                    onClick={(entry) =>
                      setSeleccion({ contexto: contextoActual, tipo: 'barra', fila: entry.payload, canal: 'efectivo' })
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {detalleBarra && (
              <div className="mt-3 text-xs bg-ink-50 rounded-lg px-3 py-2 flex items-center justify-between flex-wrap gap-2">
                <span className="font-medium text-ink-700 capitalize">
                  {detalleBarra.fila[xKey]}
                  {fechaDetalle(detalleBarra.fila) ? ` · ${fechaDetalle(detalleBarra.fila)}` : ''}
                </span>
                <span style={{ color: detalleBarra.canal === 'digital' ? COLOR_DIGITAL : COLOR_EFECTIVO }} className="font-semibold">
                  {detalleBarra.canal === 'digital' ? 'Digital' : 'Efectivo'}: ${detalleBarra.fila[detalleBarra.canal].toFixed(2)} (
                  {Math.round(
                    (detalleBarra.fila[detalleBarra.canal] / (detalleBarra.fila.digital + detalleBarra.fila.efectivo)) * 100
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
                    data={canalData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    cursor="pointer"
                    onClick={(entry) => setSeleccion({ contexto: contextoActual, tipo: 'canal', canal: entry })}
                  >
                    {canalData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`$${value.toFixed(2)} (${Math.round((value / totalPeriodo) * 100)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs mt-1">
              {canalData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-ink-500">{c.name}</span>
                </div>
              ))}
            </div>
            {detalleCanal && (
              <div className="mt-2 text-xs bg-ink-50 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-medium text-ink-700">{detalleCanal.name}</span>
                <span className="font-semibold" style={{ color: detalleCanal.color }}>
                  ${detalleCanal.value.toFixed(2)} ({Math.round((detalleCanal.value / totalPeriodo) * 100)}%)
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
            {rankingTop5.map((p, i) => (
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
      </main>
    </>
  )
}
