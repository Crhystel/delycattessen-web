import { useState } from 'react'
import { Plus, Megaphone, Send, X as XIcon } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { dias, productos, menuSemanal as menuInicial, promociones as promocionesIniciales } from '../../data/mockData'

const HOY = new Date('2026-06-17')

function calcularEstado(promo) {
  return new Date(promo.vigenciaFin) < HOY ? 'Vencida' : 'Activa'
}

export default function Menu() {
  const [tab, setTab] = useState('menu')
  const [menu, setMenu] = useState(menuInicial)
  const [promos, setPromos] = useState(promocionesIniciales)
  const [diaEditando, setDiaEditando] = useState(null)
  const [publicado, setPublicado] = useState(false)

  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [promoForm, setPromoForm] = useState({
    titulo: '',
    descripcion: '',
    descuento: '',
    vigenciaInicio: '2026-06-17',
    vigenciaFin: '2026-06-24',
  })

  function toggleProducto(dia, productId) {
    setMenu((prev) => {
      const actuales = prev[dia] || []
      const existe = actuales.includes(productId)
      return {
        ...prev,
        [dia]: existe ? actuales.filter((id) => id !== productId) : [...actuales, productId],
      }
    })
  }

  function handlePublicar() {
    setPublicado(true)
    setTimeout(() => setPublicado(false), 2500)
  }

  function handleSavePromo(e) {
    e.preventDefault()
    if (!promoForm.titulo) return
    setPromos((prev) => [
      { id: `pr${Date.now()}`, ...promoForm, descuento: Number(promoForm.descuento) || 0 },
      ...prev,
    ])
    setPromoForm({ titulo: '', descripcion: '', descuento: '', vigenciaInicio: '2026-06-17', vigenciaFin: '2026-06-24' })
    setPromoModalOpen(false)
  }

  return (
    <>
      <Topbar title="Menú y Promociones" subtitle="Planificación semanal y campañas con vigencia definida" />

      <main className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
            {[
              { id: 'menu', label: 'Menú Semanal' },
              { id: 'promos', label: 'Promociones' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  tab === t.id ? 'bg-teal-500 text-white' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'menu' ? (
            <Button icon={Send} onClick={handlePublicar}>
              {publicado ? 'Menú publicado ✓' : 'Publicar menú'}
            </Button>
          ) : (
            <Button icon={Plus} onClick={() => setPromoModalOpen(true)}>
              Nueva promoción
            </Button>
          )}
        </div>

        {publicado && (
          <div className="bg-success-50 text-success-600 text-sm font-medium rounded-xl px-4 py-3">
            Notificación enviada a los dispositivos de padres y docentes con el menú actualizado.
          </div>
        )}

        {tab === 'menu' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dias.map((dia) => {
              const idsDelDia = menu[dia] || []
              return (
                <Card key={dia} padded={false} className="flex flex-col">
                  <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
                    <span className="font-display font-semibold text-ink-900 text-sm">{dia}</span>
                    <button
                      onClick={() => setDiaEditando(dia)}
                      className="text-xs font-medium text-teal-600 hover:underline"
                    >
                      Editar
                    </button>
                  </div>
                  <div className="p-4 space-y-2.5 flex-1">
                    {idsDelDia.length === 0 && (
                      <p className="text-xs text-ink-300 text-center py-4">Sin productos asignados</p>
                    )}
                    {idsDelDia.map((id) => {
                      const p = productos.find((x) => x.id === id)
                      if (!p) return null
                      return (
                        <div key={id} className="flex items-center gap-2 bg-ink-50 rounded-lg px-2.5 py-2">
                          <span className="text-lg">{p.imagen}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-ink-900 truncate">{p.nombre}</p>
                            <p className="text-[11px] text-ink-500">${p.precio.toFixed(2)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map((promo) => {
              const estado = calcularEstado(promo)
              return (
                <Card key={promo.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900 text-sm">{promo.titulo}</p>
                        <p className="text-xs text-ink-500">
                          {promo.vigenciaInicio} → {promo.vigenciaFin}
                        </p>
                      </div>
                    </div>
                    <Badge tone={estado === 'Activa' ? 'success' : 'neutral'}>{estado}</Badge>
                  </div>
                  <p className="text-sm text-ink-500 mt-3 leading-relaxed">{promo.descripcion}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 text-sm font-bold px-3 py-1 rounded-full">
                    -{promo.descuento}% de descuento
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal seleccion de productos por dia */}
      <Modal
        open={!!diaEditando}
        onClose={() => setDiaEditando(null)}
        title={`Productos para ${diaEditando || ''}`}
        footer={<Button onClick={() => setDiaEditando(null)}>Listo</Button>}
      >
        <div className="grid grid-cols-2 gap-2.5">
          {productos.map((p) => {
            const activo = diaEditando && (menu[diaEditando] || []).includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => diaEditando && toggleProducto(diaEditando, p.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  activo ? 'border-teal-500 bg-teal-50' : 'border-ink-100 hover:bg-ink-50'
                }`}
              >
                <span className="text-lg">{p.imagen}</span>
                <span className="text-xs font-medium text-ink-900 truncate">{p.nombre}</span>
                {activo && <XIcon size={14} className="text-teal-600 ml-auto shrink-0" />}
              </button>
            )
          })}
        </div>
      </Modal>

      {/* Modal nueva promocion */}
      <Modal
        open={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        title="Nueva promoción"
        footer={
          <>
            <Button variant="outline" onClick={() => setPromoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePromo}>Crear promoción</Button>
          </>
        }
      >
        <form onSubmit={handleSavePromo}>
          <Field label="Título de la oferta">
            <Input
              value={promoForm.titulo}
              onChange={(e) => setPromoForm({ ...promoForm, titulo: e.target.value })}
              placeholder="Ej. Combo Bar 15% off"
            />
          </Field>
          <Field label="Descripción">
            <Textarea
              value={promoForm.descripcion}
              onChange={(e) => setPromoForm({ ...promoForm, descripcion: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Descuento (%)">
              <Input
                type="number"
                value={promoForm.descuento}
                onChange={(e) => setPromoForm({ ...promoForm, descuento: e.target.value })}
              />
            </Field>
            <Field label="Inicio">
              <Input
                type="date"
                value={promoForm.vigenciaInicio}
                onChange={(e) => setPromoForm({ ...promoForm, vigenciaInicio: e.target.value })}
              />
            </Field>
            <Field label="Fin">
              <Input
                type="date"
                value={promoForm.vigenciaFin}
                onChange={(e) => setPromoForm({ ...promoForm, vigenciaFin: e.target.value })}
              />
            </Field>
          </div>
        </form>
      </Modal>
    </>
  )
}
