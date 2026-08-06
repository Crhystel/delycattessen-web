import { useState } from 'react'
import { Download, GraduationCap, Wallet, FileSpreadsheet } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card, { CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { teacherConsumption } from '../../data/mockData'
import { useInstitution } from '../../context/InstitutionContext'

const CURRENT_MONTH = 'Junio 2026'

function downloadCsv(fileName, rows) {
  const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function TeacherConsumptionReport() {
  const { selectedInstitution } = useInstitution()
  const [exported, setExported] = useState(false)

  const currentMonthConsumption = teacherConsumption.filter(
    (d) => d.period === CURRENT_MONTH && d.institution === selectedInstitution.name
  )

  const totalTeachers = currentMonthConsumption.length
  const totalConsumptions = currentMonthConsumption.reduce((sum, d) => sum + d.consumptions, 0)
  const totalAmount = currentMonthConsumption.reduce((sum, d) => sum + d.total, 0)

  function handleExport() {
    const rows = [
      ['Docente', 'Institución', 'Periodo', 'N° Consumos', 'Total'],
      ...currentMonthConsumption.map((d) => [d.name, d.institution, d.period, d.consumptions, d.total.toFixed(2)]),
      ['Total general', '', '', totalConsumptions, totalAmount.toFixed(2)],
    ]
    downloadCsv(
      `consumo-docentes-${selectedInstitution.id}-${CURRENT_MONTH.replace(' ', '-').toLowerCase()}.csv`,
      rows
    )
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  return (
    <>
      <Topbar
        title="Consumo a Crédito · Docentes"
        subtitle={`Consolidado del mes en curso (${CURRENT_MONTH}) para el departamento de Recursos Humanos`}
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={GraduationCap} tone="teal" label="Docentes con consumo" value={totalTeachers} hint={CURRENT_MONTH} />
          <StatCard icon={Wallet} tone="brand" label="Total a consolidar" value={`$${totalAmount.toFixed(2)}`} hint="Para descuento por RRHH" />
          <StatCard icon={FileSpreadsheet} tone="success" label="Consumos registrados" value={totalConsumptions} hint={selectedInstitution.name} />
        </div>

        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <CardHeader
              title="Detalle por docente"
              subtitle={`Consumos de ${CURRENT_MONTH}, listo para consolidar`}
            />
            <Button icon={Download} onClick={handleExport}>
              {exported ? 'Reporte exportado ✓' : 'Exportar para RRHH'}
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
              {currentMonthConsumption.map((d) => (
                <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                  <td className="px-5 py-3 font-medium text-ink-900">{d.name}</td>
                  <td className="px-5 py-3 text-ink-500">{d.institution}</td>
                  <td className="px-5 py-3 text-ink-500">{d.period}</td>
                  <td className="px-5 py-3 text-ink-700">{d.consumptions}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink-900">${d.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-5 py-3 text-right text-sm font-semibold text-ink-500">
                  Total general
                </td>
                <td className="px-5 py-3 text-right text-sm font-bold text-brand-600">${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {exported && (
          <div className="bg-success-50 text-success-600 text-sm font-medium rounded-xl px-4 py-3">
            Archivo de consolidación generado y enviado al correo de Recursos Humanos.
          </div>
        )}
      </main>
    </>
  )
}
