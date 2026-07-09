import { useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Send,
  Upload,
  X as XIcon,
  CalendarDays,
  CalendarCheck,
  Undo2,
  Mail,
  RefreshCw,
  UtensilsCrossed,
  Tag,
} from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/Field'
import { productos, menuMensual as menuMensualInicial } from '../../data/mockData'
import { usePromociones, HOY, pad2, formatFechaISO, sumarDias, calcularEstadoPromo } from '../../context/PromocionesContext'

const emptyPromoForm = {
  productos: [],
  imagen: '🎉',
  descuento: '',
  vigenciaInicio: formatFechaISO(HOY),
  vigenciaFin: formatFechaISO(sumarDias(HOY, 7)),
}

function isImagenArchivo(imagen) {
  return typeof imagen === 'string' && imagen.startsWith('data:')
}

const NOMBRES_MES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// Solo lunes a viernes cuentan como dias habiles; sabados y domingos se excluyen por completo
function obtenerDiasDelMes(anio, mesIndex) {
  const ultimoDia = new Date(anio, mesIndex + 1, 0).getDate()
  const out = []
  for (let d = 1; d <= ultimoDia; d++) {
    const diaSemana = new Date(anio, mesIndex, d).getDay() // 0 Dom ... 6 Sáb
    if (diaSemana < 1 || diaSemana > 5) continue
    out.push({
      fecha: `${anio}-${pad2(mesIndex + 1)}-${pad2(d)}`,
      dia: d,
      diaSemana,
    })
  }
  return out
}

function nombreMes(anio, mesIndex) {
  return `${NOMBRES_MES[mesIndex]} ${anio}`
}

function formatFechaLarga(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const texto = new Date(anio, mes - 1, dia).toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Estado visual de un dia segun cuantos platos tiene asignados
function estadoDia(cantidad) {
  if (cantidad === 0) return 'pendiente'
  if (cantidad === 1) return 'incompleto'
  return 'completo'
}

const ESTILOS_ESTADO_DIA = {
  pendiente: 'border-ink-100 text-ink-400 hover:bg-ink-50',
  incompleto: 'border-warning-300 bg-warning-50 text-warning-700',
  completo: 'border-teal-500 bg-teal-50 text-teal-700',
}

function productoConPromo(productId, promosList) {
  return promosList.find((p) => p.productos.includes(productId) && calcularEstadoPromo(p) === 'Activa')
}

// Estadisticas rapidas del mes: dias planificados, platos totales y promos vigentes en el rango del mes
function statsDelMes(m, promosList) {
  const diasHabiles = obtenerDiasDelMes(m.anio, m.mesIndex)
  const diasConfigurados = diasHabiles.filter((d) => (m.dias[d.fecha] || []).length > 0).length
  const platosRegistrados = diasHabiles.reduce((acc, d) => acc + (m.dias[d.fecha] || []).length, 0)
  const inicioMes = `${m.anio}-${pad2(m.mesIndex + 1)}-01`
  const ultimoDia = new Date(m.anio, m.mesIndex + 1, 0).getDate()
  const finMes = `${m.anio}-${pad2(m.mesIndex + 1)}-${pad2(ultimoDia)}`
  const promosActivas = promosList.filter(
    (p) => calcularEstadoPromo(p) === 'Activa' && p.vigenciaInicio <= finMes && p.vigenciaFin >= inicioMes
  ).length
  return { diasHabiles, diasConfigurados, platosRegistrados, promosActivas, totalDias: diasHabiles.length }
}

function CalendarioMensual({ anio, mesIndex, diasMap, onEditarDia, fechaSeleccionada, fechasConPromo }) {
  const diasDelMes = obtenerDiasDelMes(anio, mesIndex)
  const offset = diasDelMes.length > 0 ? diasDelMes[0].diaSemana - 1 : 0 // desplazamiento dentro de la semana Lun-Vie
  const celdas = [...Array(offset).fill(null), ...diasDelMes]

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5 mb-1.5">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((d) => (
          <div key={d} className="text-[10px] font-semibold text-ink-400 text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {celdas.map((info, idx) => {
          if (!info) return <div key={`blank-${idx}`} />

          const cantidad = (diasMap[info.fecha] || []).length
          const estado = estadoDia(cantidad)
          const seleccionado = fechaSeleccionada === info.fecha
          const tienePromo = fechasConPromo?.has(info.fecha)

          return (
            <button
              key={info.fecha}
              type="button"
              onClick={() => onEditarDia(info.fecha)}
              className={`relative aspect-square rounded-lg border text-[11px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                ESTILOS_ESTADO_DIA[estado]
              } ${seleccionado ? 'ring-2 ring-brand-500' : ''}`}
            >
              <span className="font-semibold">{info.dia}</span>
              {cantidad > 0 && <span className="text-[9px]">{cantidad} plato{cantidad > 1 ? 's' : ''}</span>}
              {tienePromo && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary-500" title="Incluye producto en promoción" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-white text-teal-600 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900 leading-tight">{value}</p>
        <p className="text-[11px] text-ink-500 truncate">{label}</p>
      </div>
    </div>
  )
}

function PanelEdicionDia({ fecha, productosDia, promos, onToggleProducto, onCerrar }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="text-[11px] text-ink-400">Editando día</p>
          <p className="font-display font-semibold text-ink-900 text-sm">{formatFechaLarga(fecha)}</p>
        </div>
        <button
          onClick={onCerrar}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 shrink-0"
        >
          <XIcon size={16} />
        </button>
      </div>

      <p className="text-xs text-ink-500 mb-2.5">
        {productosDia.length} plato{productosDia.length !== 1 ? 's' : ''} seleccionado{productosDia.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {productos.map((p) => {
          const activo = productosDia.includes(p.id)
          const promo = productoConPromo(p.id, promos)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggleProducto(p.id)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                activo ? 'border-teal-500 bg-teal-50' : 'border-ink-100 hover:bg-ink-50'
              }`}
            >
              <span className="text-lg shrink-0">{p.imagen}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-ink-900 truncate">{p.nombre}</span>
                {promo && <span className="block text-[10px] font-semibold text-teal-600">-{promo.descuento}% promo</span>}
              </span>
              {activo && <XIcon size={14} className="text-teal-600 shrink-0" />}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function MesCard({ m, promos, notificado, onToggleProducto, onPublicar, onDespublicar }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)

  const stats = statsDelMes(m, promos)
  const porcentaje = stats.totalDias > 0 ? Math.round((stats.diasConfigurados / stats.totalDias) * 100) : 0
  const fechasConPromo = new Set(
    stats.diasHabiles
      .filter((d) => (m.dias[d.fecha] || []).some((pid) => productoConPromo(pid, promos)))
      .map((d) => d.fecha)
  )
  const productosDia = fechaSeleccionada ? m.dias[fechaSeleccionada] || [] : []

  return (
    <Card padded={false}>
      <div className="px-5 py-3.5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <CalendarDays size={16} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900 text-sm">{m.mes}</p>
            {m.fechaPublicacion && (
              <p className="text-[11px] text-ink-400">Publicado el {m.fechaPublicacion}</p>
            )}
          </div>
          <Badge tone={m.estado === 'Publicado' ? 'success' : 'neutral'}>{m.estado}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {m.estado === 'Publicado' ? (
            <Button icon={Undo2} variant="outline" onClick={onDespublicar}>
              Pasar a borrador
            </Button>
          ) : (
            <Button icon={Send} onClick={onPublicar}>
              Publicar menú
            </Button>
          )}
        </div>
      </div>

      {notificado && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 bg-success-50 text-success-600 text-xs font-medium rounded-xl px-3.5 py-3">
          <Mail size={15} className="shrink-0" />
          Notificación enviada por correo a todos los usuarios registrados.
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
            <span>Progreso del mes</span>
            <span className="font-semibold text-ink-700">{porcentaje}% planificado</span>
          </div>
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <StatChip icon={CalendarCheck} label="Días configurados" value={`${stats.diasConfigurados}/${stats.totalDias}`} />
          <StatChip icon={UtensilsCrossed} label="Platos registrados" value={stats.platosRegistrados} />
          <StatChip icon={Tag} label="Promociones activas" value={stats.promosActivas} />
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-[400px] shrink-0">
            <CalendarioMensual
              anio={m.anio}
              mesIndex={m.mesIndex}
              diasMap={m.dias}
              onEditarDia={setFechaSeleccionada}
              fechaSeleccionada={fechaSeleccionada}
              fechasConPromo={fechasConPromo}
            />
          </div>
          <div className="flex-1 min-w-0">
            {fechaSeleccionada ? (
              <PanelEdicionDia
                fecha={fechaSeleccionada}
                productosDia={productosDia}
                promos={promos}
                onToggleProducto={(productId) => onToggleProducto(fechaSeleccionada, productId)}
                onCerrar={() => setFechaSeleccionada(null)}
              />
            ) : (
              <div className="h-full min-h-[180px] flex items-center justify-center rounded-xl border border-dashed border-ink-200 text-xs text-ink-400 text-center px-6">
                Selecciona un día del calendario para ver y editar sus platos, bebidas y promociones.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Menu() {
  const [tab, setTab] = useState('mensual')
  const { promociones: promos, setPromociones: setPromos } = usePromociones()

  const [mensual, setMensual] = useState(menuMensualInicial)
  const [menuNotificado, setMenuNotificado] = useState(null) // id del menu recien publicado

  const [nuevoMesModalOpen, setNuevoMesModalOpen] = useState(false)
  const [mesNuevo, setMesNuevo] = useState('') // 'YYYY-MM'
  const [errorMesNuevo, setErrorMesNuevo] = useState('')

  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [editingPromoId, setEditingPromoId] = useState(null)
  const [promoForm, setPromoForm] = useState(emptyPromoForm)
  const [errorPromo, setErrorPromo] = useState('')

  function toggleProductoMensual(menuId, fecha, productId) {
    setMensual((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m
        const actuales = m.dias[fecha] || []
        const existe = actuales.includes(productId)
        return {
          ...m,
          dias: {
            ...m.dias,
            [fecha]: existe ? actuales.filter((id) => id !== productId) : [...actuales, productId],
          },
        }
      })
    )
  }

  function abrirNuevoMes() {
    setMesNuevo('')
    setErrorMesNuevo('')
    setNuevoMesModalOpen(true)
  }

  function handleCrearMes() {
    if (!mesNuevo) return
    const [anio, mes] = mesNuevo.split('-').map(Number)
    const mesIndex = mes - 1
    const yaExiste = mensual.some((m) => m.anio === anio && m.mesIndex === mesIndex)
    if (yaExiste) {
      setErrorMesNuevo('Ya existe un menú mensual para ese mes.')
      return
    }
    const habiles = obtenerDiasDelMes(anio, mesIndex)
    setMensual((prev) => [
      {
        id: `mm${Date.now()}`,
        mes: nombreMes(anio, mesIndex),
        anio,
        mesIndex,
        estado: 'Borrador',
        fechaPublicacion: null,
        dias: Object.fromEntries(habiles.map((d) => [d.fecha, []])),
      },
      ...prev,
    ])
    setNuevoMesModalOpen(false)
  }

  function handlePublicarMes(menuId) {
    setMensual((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, estado: 'Publicado', fechaPublicacion: formatFechaISO(HOY) } : m
      )
    )
    // RF-09: al publicar, se dispara automáticamente una notificación por
    // correo a todos los usuarios registrados (padres, docentes y personal).
    setMenuNotificado(menuId)
    setTimeout(() => setMenuNotificado((actual) => (actual === menuId ? null : actual)), 4000)
  }

  function handleDespublicarMes(menuId) {
    setMensual((prev) => prev.map((m) => (m.id === menuId ? { ...m, estado: 'Borrador' } : m)))
  }

  function tienePromoActiva(productoId, excludeId) {
    return promos.some(
      (p) => p.id !== excludeId && p.productos.includes(productoId) && calcularEstadoPromo(p) === 'Activa'
    )
  }

  function abrirNuevaPromo() {
    setEditingPromoId(null)
    setPromoForm(emptyPromoForm)
    setErrorPromo('')
    setPromoModalOpen(true)
  }

  function abrirEditarPromo(promo) {
    setEditingPromoId(promo.id)
    setPromoForm({
      productos: [...promo.productos],
      imagen: promo.imagen,
      descuento: String(promo.descuento),
      vigenciaInicio: promo.vigenciaInicio,
      vigenciaFin: promo.vigenciaFin,
    })
    setErrorPromo('')
    setPromoModalOpen(true)
  }

  function toggleProductoAplicable(productId) {
    const yaElegido = promoForm.productos.includes(productId)
    if (!yaElegido && tienePromoActiva(productId, editingPromoId)) {
      setErrorPromo('Ese producto ya tiene una promoción activa. Espera a que venza o elige otro producto.')
      return
    }
    setErrorPromo('')
    setPromoForm((prev) => ({
      ...prev,
      productos: yaElegido ? prev.productos.filter((id) => id !== productId) : [...prev.productos, productId],
    }))
  }

  function seleccionarTodosDisponibles() {
    setErrorPromo('')
    const disponibles = productos
      .filter((p) => !tienePromoActiva(p.id, editingPromoId))
      .map((p) => p.id)
    setPromoForm((prev) => ({ ...prev, productos: disponibles }))
  }

  function quitarTodos() {
    setErrorPromo('')
    setPromoForm((prev) => ({ ...prev, productos: [] }))
  }

  function handleImagenPromoFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPromoForm((prev) => ({ ...prev, imagen: reader.result }))
    reader.readAsDataURL(file)
  }

  function handleSavePromo(e) {
    e.preventDefault()
    if (promoForm.productos.length === 0) {
      setErrorPromo('Selecciona al menos un producto para la promoción.')
      return
    }
    if (promoForm.productos.some((id) => tienePromoActiva(id, editingPromoId))) {
      setErrorPromo('Uno de los productos elegidos ya tiene una promoción activa.')
      return
    }
    if (!promoForm.descuento || Number(promoForm.descuento) <= 0) {
      setErrorPromo('Ingresa un porcentaje de descuento válido.')
      return
    }

    const payload = { ...promoForm, descuento: Number(promoForm.descuento) || 0 }

    if (editingPromoId) {
      setPromos((prev) => prev.map((p) => (p.id === editingPromoId ? { ...p, ...payload } : p)))
    } else {
      setPromos((prev) => [{ id: `pr${Date.now()}`, ...payload }, ...prev])
    }
    setPromoModalOpen(false)
  }

  function handleDeletePromo(id) {
    setPromos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      <Topbar title="Menú y Promociones" subtitle="Planificación mensual y campañas con vigencia definida" />

      <main className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
            {[
              { id: 'mensual', label: 'Menú Mensual' },
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

          {tab === 'mensual' && (
            <Button icon={Plus} onClick={abrirNuevoMes}>
              Nuevo menú mensual
            </Button>
          )}
          {tab === 'promos' && (
            <Button icon={Plus} onClick={abrirNuevaPromo}>
              Nueva promoción
            </Button>
          )}
        </div>

        {tab === 'mensual' && (
          <div className="space-y-5">
            {[...mensual]
              .sort((a, b) => b.anio * 12 + b.mesIndex - (a.anio * 12 + a.mesIndex))
              .map((m) => (
                <MesCard
                  key={m.id}
                  m={m}
                  promos={promos}
                  notificado={menuNotificado === m.id}
                  onToggleProducto={(fecha, productId) => toggleProductoMensual(m.id, fecha, productId)}
                  onPublicar={() => handlePublicarMes(m.id)}
                  onDespublicar={() => handleDespublicarMes(m.id)}
                />
              ))}
          </div>
        )}

        {tab === 'promos' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 bg-ink-50/70 border border-ink-100 text-xs text-ink-500 rounded-xl px-3.5 py-3">
              <RefreshCw size={14} className="shrink-0 mt-0.5" />
              Al llegar la fecha de vencimiento, el sistema retira el descuento y restaura el precio original del
              producto automáticamente.
            </div>

            <Card padded={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink-500 border-b border-ink-100">
                      <th className="px-5 py-3 font-medium">Producto</th>
                      <th className="px-5 py-3 font-medium">Descuento</th>
                      <th className="px-5 py-3 font-medium">Fecha inicio</th>
                      <th className="px-5 py-3 font-medium">Fecha vencimiento</th>
                      <th className="px-5 py-3 font-medium">Estado</th>
                      <th className="px-5 py-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map((promo) => {
                      const estado = calcularEstadoPromo(promo)
                      const productosAplicables = promo.productos
                        .map((id) => productos.find((p) => p.id === id))
                        .filter(Boolean)
                      return (
                        <tr key={promo.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
                                {isImagenArchivo(promo.imagen) ? (
                                  <img src={promo.imagen} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-lg">{promo.imagen}</span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {productosAplicables.map((p) => (
                                  <Badge key={p.id} tone="neutral">
                                    {p.imagen} {p.nombre}
                                  </Badge>
                                ))}
                                {productosAplicables.length === 0 && <span className="text-ink-300">—</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                              -{promo.descuento}%
                            </span>
                          </td>
                          <td className="px-5 py-3 text-ink-500">{promo.vigenciaInicio}</td>
                          <td className="px-5 py-3 text-ink-500">{promo.vigenciaFin}</td>
                          <td className="px-5 py-3">
                            <Badge tone={estado === 'Activa' ? 'success' : 'neutral'}>{estado}</Badge>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => abrirEditarPromo(promo)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {promos.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-ink-300">
                          No hay promociones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Modal creacion de menu mensual: solo elige el mes, la planificacion se hace en la vista principal */}
      <Modal
        open={nuevoMesModalOpen}
        onClose={() => setNuevoMesModalOpen(false)}
        title="Nuevo menú mensual"
        footer={
          <>
            <Button variant="outline" onClick={() => setNuevoMesModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearMes} disabled={!mesNuevo}>
              Crear borrador
            </Button>
          </>
        }
      >
        <Field label="Mes a planificar">
          <Input
            type="month"
            value={mesNuevo}
            onChange={(e) => {
              setMesNuevo(e.target.value)
              setErrorMesNuevo('')
            }}
          />
        </Field>
        {errorMesNuevo && <p className="text-xs text-danger-600 mt-1.5">{errorMesNuevo}</p>}
        <p className="text-xs text-ink-500 mt-2">
          Se crea un borrador con todos los días hábiles (lunes a viernes) del mes, listo para planificar
          directamente desde la vista principal.
        </p>
      </Modal>

      {/* Modal nueva/editar promocion */}
      <Modal
        open={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        title={editingPromoId ? 'Editar promoción' : 'Nueva promoción'}
        width="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setPromoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePromo}>{editingPromoId ? 'Guardar cambios' : 'Crear promoción'}</Button>
          </>
        }
      >
        <form onSubmit={handleSavePromo}>
          <Field
            label="Productos en promoción"
            hint="Puedes aplicar la promoción a uno, varios o todos los productos del catálogo. Un producto no puede tener dos promociones activas a la vez."
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={promoForm.productos.length > 0 ? quitarTodos : seleccionarTodosDisponibles}
                className="text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                {promoForm.productos.length > 0 ? 'Quitar todos' : 'Seleccionar todos los disponibles'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {productos.map((p) => {
                const activo = promoForm.productos.includes(p.id)
                const bloqueado = !activo && tienePromoActiva(p.id, editingPromoId)
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={bloqueado}
                    onClick={() => toggleProductoAplicable(p.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      activo
                        ? 'border-teal-500 bg-teal-50'
                        : bloqueado
                        ? 'border-ink-100 bg-ink-50 opacity-50 cursor-not-allowed'
                        : 'border-ink-100 hover:bg-ink-50'
                    }`}
                  >
                    <span className="text-base">{p.imagen}</span>
                    <span className="text-xs font-medium text-ink-900 truncate">
                      {p.nombre}
                      {bloqueado && <span className="block text-[10px] text-ink-400">Ya en otra promoción</span>}
                    </span>
                    {activo && <XIcon size={13} className="text-teal-600 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
            {errorPromo && <p className="text-xs text-danger-600 mt-1.5">{errorPromo}</p>}
          </Field>

          <Field label="Imagen de la promoción">
            <div className="flex items-center gap-3">
              {isImagenArchivo(promoForm.imagen) ? (
                <img src={promoForm.imagen} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-100" />
              ) : (
                <span className="text-3xl">{promoForm.imagen}</span>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
                <Upload size={15} />
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleImagenPromoFile} />
              </label>
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Descuento (%)">
              <Input
                type="number"
                value={promoForm.descuento}
                onChange={(e) => setPromoForm({ ...promoForm, descuento: e.target.value })}
                placeholder="0"
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

          <div className="flex items-start gap-2.5 bg-ink-50 text-ink-500 text-xs rounded-xl px-3.5 py-3 mt-1">
            <RefreshCw size={14} className="shrink-0 mt-0.5" />
            Al llegar la fecha "Fin", el precio original del producto se restaura automáticamente y queda
            disponible para una nueva promoción
          </div>
        </form>
      </Modal>
    </>
  )
}
