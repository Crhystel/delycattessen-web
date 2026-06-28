import { useState } from 'react'
import { Download, GraduationCap, Wallet, FileSpreadsheet } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card, { CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { consumoDocentes } from '../../data/mockData'

export default function ReporteDocentes() {
  const [exportado, setExportado] = useState(false)

  const totalDocentes = consumoDocentes.length
  const totalConsumos = consumoDocentes.reduce((sum, d) => sum + d.consumos, 0)
  const totalMonto = consumoDocentes.reduce((sum, d) => sum + d.total, 0)

  function handleExportar() {
    setExportado(true)
    setTimeout(() => setExportado(false), 2500)
  }

  return (
    <>
      <Topbar
        title="Consumo a Crédito · Docentes"
        subtitle="Consolidado mensual para el departamento de Recursos Humanos"
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={GraduationCap} tone="teal" label="Docentes con consumo" value={totalDocentes} hint="Junio 2026" />
          <StatCard icon={Wallet} tone="brand" label="Total a consolidar" value={`$${totalMonto.toFixed(2)}`} hint="Para descuento por RRHH" />
          <StatCard icon={FileSpreadsheet} tone="success" label="Consumos registrados" value={totalConsumos} hint="Ambas instituciones" />
        </div>

        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <CardHeader
              title="Detalle por docente"
              subtitle="Registro centralizado de consumos del periodo, listo para consolidar"
            />
            <Button icon={Download} onClick={handleExportar}>
              {exportado ? 'Reporte exportado ✓' : 'Exportar para RRHH'}
            </Button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Docente</th>
                <th className="px-5 py-3 font-medium">Institución</th>
                <th className="px-5 py-3 font-medium">Periodo</th>
                <th className="px-5 py-3 font-medium">N° Consumos</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {consumoDocentes.map((d) => (
                <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                  <td className="px-5 py-3 font-medium text-ink-900">{d.nombre}</td>
                  <td className="px-5 py-3 text-ink-500">{d.institucion}</td>
                  <td className="px-5 py-3 text-ink-500">{d.periodo}</td>
                  <td className="px-5 py-3 text-ink-700">{d.consumos}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink-900">${d.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-5 py-3 text-right text-sm font-semibold text-ink-500">
                  Total general
                </td>
                <td className="px-5 py-3 text-right text-sm font-bold text-brand-600">${totalMonto.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {exportado && (
          <div className="bg-success-50 text-success-600 text-sm font-medium rounded-xl px-4 py-3">
            Archivo de consolidación generado y enviado al correo de Recursos Humanos.
          </div>
        )}
      </main>
    </>
  )
}
