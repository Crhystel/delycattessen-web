import { useState } from 'react'
import { Download, GraduationCap, Wallet, FileSpreadsheet } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card, { CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { consumoDocentes } from '../../data/mockData'
import { useInstitucion } from '../../context/InstitucionContext'

const MES_EN_CURSO = 'Junio 2026'

function descargarCsv(nombreArchivo, filas) {
  const csv = filas.map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function ReporteDocentes() {
  const { institucionSeleccionada } = useInstitucion()
  const [exportado, setExportado] = useState(false)

  const consumoMesEnCurso = consumoDocentes.filter(
    (d) => d.periodo === MES_EN_CURSO && d.institucion === institucionSeleccionada.nombre
  )

  const totalDocentes = consumoMesEnCurso.length
  const totalConsumos = consumoMesEnCurso.reduce((sum, d) => sum + d.consumos, 0)
  const totalMonto = consumoMesEnCurso.reduce((sum, d) => sum + d.total, 0)

  function handleExportar() {
    const filas = [
      ['Docente', 'Institución', 'Periodo', 'N° Consumos', 'Total'],
      ...consumoMesEnCurso.map((d) => [d.nombre, d.institucion, d.periodo, d.consumos, d.total.toFixed(2)]),
      ['Total general', '', '', totalConsumos, totalMonto.toFixed(2)],
    ]
    descargarCsv(
      `consumo-docentes-${institucionSeleccionada.id}-${MES_EN_CURSO.replace(' ', '-').toLowerCase()}.csv`,
      filas
    )
    setExportado(true)
    setTimeout(() => setExportado(false), 2500)
  }

  return (
    <>
      <Topbar
        title="Consumo a Crédito · Docentes"
        subtitle={`Consolidado del mes en curso (${MES_EN_CURSO}) para el departamento de Recursos Humanos`}
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={GraduationCap} tone="teal" label="Docentes con consumo" value={totalDocentes} hint={MES_EN_CURSO} />
          <StatCard icon={Wallet} tone="brand" label="Total a consolidar" value={`$${totalMonto.toFixed(2)}`} hint="Para descuento por RRHH" />
          <StatCard icon={FileSpreadsheet} tone="success" label="Consumos registrados" value={totalConsumos} hint={institucionSeleccionada.nombre} />
        </div>

        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <CardHeader
              title="Detalle por docente"
              subtitle={`Consumos de ${MES_EN_CURSO}, listo para consolidar`}
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
              {consumoMesEnCurso.map((d) => (
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
