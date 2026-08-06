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
  ClipboardList,
} from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Field'
import IngredientsInput from '../../components/admin/IngredientsInput'
import {
  products,
  monthlyMenu as initialMonthlyMenu,
  menuDishes as initialMenuDishes,
  ingredientsCatalog as initialIngredientsCatalog,
} from '../../data/mockData'
import { usePromotions, TODAY, pad2, formatDateISO, addDays, calculatePromoStatus } from '../../context/PromotionsContext'

const emptyPromoForm = {
  products: [],
  image: '🎉',
  discount: '',
  startDate: formatDateISO(TODAY),
  endDate: formatDateISO(addDays(TODAY, 7)),
}

const emptyDishForm = {
  name: '',
  description: '',
  image: '🍴',
  ingredients: [],
}

function isImageFile(image) {
  return typeof image === 'string' && image.startsWith('data:')
}

// No stock field: a Monthly Menu dish is prepared on demand based on the
// day's preorder count, not from a fixed inventory.
function validateDish(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'El nombre del platillo es obligatorio.'
  if (!form.description.trim()) errors.description = 'La descripción es obligatoria.'
  if (!form.image) errors.image = 'Selecciona o sube una imagen para el platillo.'
  if (form.ingredients.length === 0) errors.ingredients = 'Debes declarar los ingredientes para validar alérgenos.'
  return errors
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// Only Monday to Friday count as business days; Saturdays and Sundays are excluded entirely
function getMonthWeekdays(year, monthIndex) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const out = []
  for (let d = 1; d <= lastDay; d++) {
    const weekday = new Date(year, monthIndex, d).getDay() // 0 Sun ... 6 Sat
    if (weekday < 1 || weekday > 5) continue
    out.push({
      date: `${year}-${pad2(monthIndex + 1)}-${pad2(d)}`,
      day: d,
      weekday,
    })
  }
  return out
}

function monthLabel(year, monthIndex) {
  return `${MONTH_NAMES[monthIndex]} ${year}`
}

function formatLongDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  const text = new Date(year, month - 1, day).toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Visual status of a day based on how many dishes are assigned to it
function dayStatus(count) {
  if (count === 0) return 'pending'
  if (count === 1) return 'incomplete'
  return 'complete'
}

const DAY_STATUS_STYLES = {
  pending: 'border-ink-100 text-ink-400 hover:bg-ink-50',
  incomplete: 'border-warning-300 bg-warning-50 text-warning-700',
  complete: 'border-teal-500 bg-teal-50 text-teal-700',
}

function productWithPromo(productId, promosList) {
  return promosList.find((p) => p.products.includes(productId) && calculatePromoStatus(p) === 'Activa')
}

// Quick stats for the month: planned days, total dishes, active promos,
// and total preorders received within the month's date range
function monthStats(m, promosList) {
  const businessDays = getMonthWeekdays(m.year, m.monthIndex)
  const configuredDays = businessDays.filter((d) => (m.days[d.date] || []).length > 0).length
  const registeredDishes = businessDays.reduce((acc, d) => acc + (m.days[d.date] || []).length, 0)
  const monthStart = `${m.year}-${pad2(m.monthIndex + 1)}-01`
  const lastDay = new Date(m.year, m.monthIndex + 1, 0).getDate()
  const monthEnd = `${m.year}-${pad2(m.monthIndex + 1)}-${pad2(lastDay)}`
  const activePromos = promosList.filter(
    (p) => calculatePromoStatus(p) === 'Activa' && p.startDate <= monthEnd && p.endDate >= monthStart
  ).length
  const totalPreorders = Object.values(m.preorders || {}).reduce((acc, n) => acc + n, 0)
  return { businessDays, configuredDays, registeredDishes, activePromos, totalPreorders, totalDays: businessDays.length }
}

function MonthlyCalendar({ year, monthIndex, daysMap, preordersMap, onEditDay, selectedDate, datesWithPromo }) {
  const monthDays = getMonthWeekdays(year, monthIndex)
  const offset = monthDays.length > 0 ? monthDays[0].weekday - 1 : 0 // offset within the Mon-Fri week
  const cells = [...Array(offset).fill(null), ...monthDays]

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
        {cells.map((info, idx) => {
          if (!info) return <div key={`blank-${idx}`} />

          const count = (daysMap[info.date] || []).length
          const dayPreorders = preordersMap?.[info.date] || 0
          const status = dayStatus(count)
          const selected = selectedDate === info.date
          const hasPromo = datesWithPromo?.has(info.date)

          return (
            <button
              key={info.date}
              type="button"
              onClick={() => onEditDay(info.date)}
              className={`relative aspect-square rounded-lg border text-[11px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                DAY_STATUS_STYLES[status]
              } ${selected ? 'ring-2 ring-brand-500' : ''}`}
            >
              <span className="font-semibold">{info.day}</span>
              {count > 0 && <span className="text-[9px]">{count} plato{count > 1 ? 's' : ''}</span>}
              {dayPreorders > 0 && (
                <span className="text-[9px] font-semibold text-brand-600">{dayPreorders} preórd.</span>
              )}
              {hasPromo && (
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

function DayEditPanel({ date, dishes, dayDishes, dayPreorders, onToggleProduct, onClose }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="text-[11px] text-ink-400">Editando día</p>
          <p className="font-display font-semibold text-ink-900 text-sm">{formatLongDate(date)}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 shrink-0"
        >
          <XIcon size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-2.5 gap-2 flex-wrap">
        <p className="text-xs text-ink-500">
          {dayDishes.length} plato{dayDishes.length !== 1 ? 's' : ''} seleccionado{dayDishes.length !== 1 ? 's' : ''}
        </p>
        <Badge tone={dayPreorders > 0 ? 'success' : 'neutral'}>
          {dayPreorders} preorden{dayPreorders !== 1 ? 'es' : ''} este día
        </Badge>
      </div>

      {dishes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 text-xs text-ink-400 text-center px-4 py-6">
          Aún no hay platillos creados. Crea uno en "Platillos del Menú Mensual" para poder asignarlo a este día.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {dishes.map((p) => {
            const active = dayDishes.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onToggleProduct(p.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  active ? 'border-teal-500 bg-teal-50' : 'border-ink-100 hover:bg-ink-50'
                }`}
              >
                {isImageFile(p.image) ? (
                  <img src={p.image} alt="" className="w-6 h-6 rounded-md object-cover shrink-0" />
                ) : (
                  <span className="text-lg shrink-0">{p.image}</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-ink-900 truncate">{p.name}</span>
                </span>
                {active && <XIcon size={14} className="text-teal-600 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}

function MonthCard({ m, promos, dishes, notified, onToggleProduct, onPublish, onUnpublish }) {
  const [selectedDate, setSelectedDate] = useState(null)

  const stats = monthStats(m, promos)
  const percentage = stats.totalDays > 0 ? Math.round((stats.configuredDays / stats.totalDays) * 100) : 0
  const datesWithPromo = new Set(
    stats.businessDays
      .filter((d) => (m.days[d.date] || []).some((pid) => productWithPromo(pid, promos)))
      .map((d) => d.date)
  )
  const dayDishes = selectedDate ? m.days[selectedDate] || [] : []
  const dayPreorders = selectedDate ? (m.preorders || {})[selectedDate] || 0 : 0

  return (
    <Card padded={false}>
      <div className="px-5 py-3.5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <CalendarDays size={16} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900 text-sm">{m.month}</p>
            {m.publicationDate && (
              <p className="text-[11px] text-ink-400">Publicado el {m.publicationDate}</p>
            )}
          </div>
          <Badge tone={m.status === 'Publicado' ? 'success' : 'neutral'}>{m.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {m.status === 'Publicado' ? (
            <Button icon={Undo2} variant="outline" onClick={onUnpublish}>
              Pasar a borrador
            </Button>
          ) : (
            <Button icon={Send} onClick={onPublish}>
              Publicar menú
            </Button>
          )}
        </div>
      </div>

      {notified && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 bg-success-50 text-success-600 text-xs font-medium rounded-xl px-3.5 py-3">
          <Mail size={15} className="shrink-0" />
          Notificación enviada por correo a todos los usuarios registrados.
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
            <span>Progreso del mes</span>
            <span className="font-semibold text-ink-700">{percentage}% planificado</span>
          </div>
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <StatChip icon={CalendarCheck} label="Días configurados" value={`${stats.configuredDays}/${stats.totalDays}`} />
          <StatChip icon={UtensilsCrossed} label="Platos registrados" value={stats.registeredDishes} />
          <StatChip icon={Tag} label="Promociones activas" value={stats.activePromos} />
          <StatChip icon={ClipboardList} label="Preórdenes del mes" value={stats.totalPreorders} />
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-[400px] shrink-0">
            <MonthlyCalendar
              year={m.year}
              monthIndex={m.monthIndex}
              daysMap={m.days}
              preordersMap={m.preorders}
              onEditDay={setSelectedDate}
              selectedDate={selectedDate}
              datesWithPromo={datesWithPromo}
            />
          </div>
          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <DayEditPanel
                date={selectedDate}
                dishes={dishes}
                dayDishes={dayDishes}
                dayPreorders={dayPreorders}
                onToggleProduct={(productId) => onToggleProduct(selectedDate, productId)}
                onClose={() => setSelectedDate(null)}
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
  const [tab, setTab] = useState('monthly')
  const { promotions: promos, setPromotions: setPromos } = usePromotions()

  const [monthlyMenus, setMonthlyMenus] = useState(initialMonthlyMenu)
  const [notifiedMenu, setNotifiedMenu] = useState(null) // id of the just-published menu

  const [newMonthModalOpen, setNewMonthModalOpen] = useState(false)
  const [newMonth, setNewMonth] = useState('') // 'YYYY-MM'
  const [newMonthError, setNewMonthError] = useState('')

  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [editingPromoId, setEditingPromoId] = useState(null)
  const [promoForm, setPromoForm] = useState(emptyPromoForm)
  const [promoError, setPromoError] = useState('')

  // Monthly Menu dishes: their own entity, separate from the Products
  // catalog, that once created becomes available to assign to days on
  // the monthly calendar.
  const [dishes, setDishes] = useState(initialMenuDishes)
  const [ingredientsCatalog, setIngredientsCatalog] = useState(initialIngredientsCatalog)
  const [dishModalOpen, setDishModalOpen] = useState(false)
  const [editingDishId, setEditingDishId] = useState(null)
  const [dishForm, setDishForm] = useState(emptyDishForm)
  const [dishErrors, setDishErrors] = useState({})

  function toggleMonthlyProduct(menuId, date, productId) {
    setMonthlyMenus((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m
        const current = m.days[date] || []
        const exists = current.includes(productId)
        return {
          ...m,
          days: {
            ...m.days,
            [date]: exists ? current.filter((id) => id !== productId) : [...current, productId],
          },
        }
      })
    )
  }

  function addToIngredientsCatalog(newIngredient) {
    setIngredientsCatalog((prev) =>
      prev.some((i) => i.toLowerCase() === newIngredient.toLowerCase())
        ? prev
        : [...prev, newIngredient].sort((a, b) => a.localeCompare(b, 'es'))
    )
  }

  function updateDishField(field, value) {
    setDishForm((prev) => ({ ...prev, [field]: value }))
    setDishErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function openNewDishModal() {
    setEditingDishId(null)
    setDishForm(emptyDishForm)
    setDishErrors({})
    setDishModalOpen(true)
  }

  function openEditDishModal(dish) {
    setEditingDishId(dish.id)
    setDishForm({
      name: dish.name,
      description: dish.description,
      image: dish.image,
      ingredients: [...dish.ingredients],
    })
    setDishErrors({})
    setDishModalOpen(true)
  }

  function handleDishImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateDishField('image', reader.result)
    reader.readAsDataURL(file)
  }

  function handleSaveDish(e) {
    e.preventDefault()
    const validationErrors = validateDish(dishForm)
    if (Object.keys(validationErrors).length > 0) {
      setDishErrors(validationErrors)
      return
    }

    if (editingDishId) {
      setDishes((prev) => prev.map((p) => (p.id === editingDishId ? { ...p, ...dishForm } : p)))
    } else {
      setDishes((prev) => [...prev, { ...dishForm, id: `pl${Date.now()}` }])
    }
    setDishModalOpen(false)
  }

  function handleDeleteDish(id) {
    setDishes((prev) => prev.filter((p) => p.id !== id))
    setMonthlyMenus((prev) =>
      prev.map((m) => ({
        ...m,
        days: Object.fromEntries(
          Object.entries(m.days).map(([date, ids]) => [date, ids.filter((pid) => pid !== id)])
        ),
      }))
    )
  }

  function openNewMonthModal() {
    setNewMonth('')
    setNewMonthError('')
    setNewMonthModalOpen(true)
  }

  function handleCreateMonth() {
    if (!newMonth) return
    const [year, month] = newMonth.split('-').map(Number)
    const monthIndex = month - 1
    const alreadyExists = monthlyMenus.some((m) => m.year === year && m.monthIndex === monthIndex)
    if (alreadyExists) {
      setNewMonthError('Ya existe un menú mensual para ese mes.')
      return
    }
    const businessDays = getMonthWeekdays(year, monthIndex)
    setMonthlyMenus((prev) => [
      {
        id: `mm${Date.now()}`,
        month: monthLabel(year, monthIndex),
        year,
        monthIndex,
        status: 'Borrador',
        publicationDate: null,
        days: Object.fromEntries(businessDays.map((d) => [d.date, []])),
      },
      ...prev,
    ])
    setNewMonthModalOpen(false)
  }

  function handlePublishMonth(menuId) {
    setMonthlyMenus((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, status: 'Publicado', publicationDate: formatDateISO(TODAY) } : m
      )
    )
    // RF-09: publishing automatically triggers an email notification to
    // all registered users (parents, teachers, and staff).
    setNotifiedMenu(menuId)
    setTimeout(() => setNotifiedMenu((current) => (current === menuId ? null : current)), 4000)
  }

  function handleUnpublishMonth(menuId) {
    setMonthlyMenus((prev) => prev.map((m) => (m.id === menuId ? { ...m, status: 'Borrador' } : m)))
  }

  function hasActivePromo(productId, excludeId) {
    return promos.some(
      (p) => p.id !== excludeId && p.products.includes(productId) && calculatePromoStatus(p) === 'Activa'
    )
  }

  function openNewPromoModal() {
    setEditingPromoId(null)
    setPromoForm(emptyPromoForm)
    setPromoError('')
    setPromoModalOpen(true)
  }

  function openEditPromoModal(promo) {
    setEditingPromoId(promo.id)
    setPromoForm({
      products: [...promo.products],
      image: promo.image,
      discount: String(promo.discount),
      startDate: promo.startDate,
      endDate: promo.endDate,
    })
    setPromoError('')
    setPromoModalOpen(true)
  }

  function toggleApplicableProduct(productId) {
    const alreadyChosen = promoForm.products.includes(productId)
    if (!alreadyChosen && hasActivePromo(productId, editingPromoId)) {
      setPromoError('Ese producto ya tiene una promoción activa. Espera a que venza o elige otro producto.')
      return
    }
    setPromoError('')
    setPromoForm((prev) => ({
      ...prev,
      products: alreadyChosen ? prev.products.filter((id) => id !== productId) : [...prev.products, productId],
    }))
  }

  function selectAllAvailable() {
    setPromoError('')
    const available = products
      .filter((p) => !hasActivePromo(p.id, editingPromoId))
      .map((p) => p.id)
    setPromoForm((prev) => ({ ...prev, products: available }))
  }

  function clearAll() {
    setPromoError('')
    setPromoForm((prev) => ({ ...prev, products: [] }))
  }

  function handlePromoImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPromoForm((prev) => ({ ...prev, image: reader.result }))
    reader.readAsDataURL(file)
  }

  function handleSavePromo(e) {
    e.preventDefault()
    if (promoForm.products.length === 0) {
      setPromoError('Selecciona al menos un producto para la promoción.')
      return
    }
    if (promoForm.products.some((id) => hasActivePromo(id, editingPromoId))) {
      setPromoError('Uno de los productos elegidos ya tiene una promoción activa.')
      return
    }
    if (!promoForm.discount || Number(promoForm.discount) <= 0) {
      setPromoError('Ingresa un porcentaje de descuento válido.')
      return
    }

    const payload = { ...promoForm, discount: Number(promoForm.discount) || 0 }

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
              { id: 'monthly', label: 'Menú Mensual' },
              { id: 'dishes', label: 'Platillos' },
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

          {tab === 'monthly' && (
            <Button icon={Plus} onClick={openNewMonthModal}>
              Nuevo menú mensual
            </Button>
          )}
          {tab === 'dishes' && (
            <Button icon={UtensilsCrossed} onClick={openNewDishModal}>
              Nuevo platillo
            </Button>
          )}
          {tab === 'promos' && (
            <Button icon={Plus} onClick={openNewPromoModal}>
              Nueva promoción
            </Button>
          )}
        </div>

        {tab === 'dishes' && (
          <Card padded={false}>
            <div className="px-5 py-3.5 border-b border-ink-100">
              <p className="font-display font-semibold text-ink-900 text-sm">Platillos del Menú Mensual</p>
            </div>
            <div className="p-5">
              {dishes.length === 0 ? (
                <p className="text-xs text-ink-400 text-center py-4">
                  No hay platillos creados todavía. Crea el primero con "Nuevo platillo".
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {dishes.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start gap-2.5 rounded-xl border border-ink-100 px-3.5 py-3"
                    >
                      {isImageFile(p.image) ? (
                        <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <span className="text-2xl shrink-0">{p.image}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink-900 truncate">{p.name}</p>
                        <p className="text-xs text-ink-400 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.ingredients.map((ing) => (
                            <span key={ing} className="text-[10px] bg-ink-50 text-ink-500 rounded-full px-2 py-0.5">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => openEditDishModal(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(p.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {tab === 'monthly' && (
          <div className="space-y-5">
            {[...monthlyMenus]
              .sort((a, b) => b.year * 12 + b.monthIndex - (a.year * 12 + a.monthIndex))
              .map((m) => (
                <MonthCard
                  key={m.id}
                  m={m}
                  promos={promos}
                  dishes={dishes}
                  notified={notifiedMenu === m.id}
                  onToggleProduct={(date, productId) => toggleMonthlyProduct(m.id, date, productId)}
                  onPublish={() => handlePublishMonth(m.id)}
                  onUnpublish={() => handleUnpublishMonth(m.id)}
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
                      const status = calculatePromoStatus(promo)
                      const applicableProducts = promo.products
                        .map((id) => products.find((p) => p.id === id))
                        .filter(Boolean)
                      return (
                        <tr key={promo.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
                                {isImageFile(promo.image) ? (
                                  <img src={promo.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-lg">{promo.image}</span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {applicableProducts.map((p) => (
                                  <Badge key={p.id} tone="neutral">
                                    {p.image} {p.name}
                                  </Badge>
                                ))}
                                {applicableProducts.length === 0 && <span className="text-ink-300">—</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                              -{promo.discount}%
                            </span>
                          </td>
                          <td className="px-5 py-3 text-ink-500">{promo.startDate}</td>
                          <td className="px-5 py-3 text-ink-500">{promo.endDate}</td>
                          <td className="px-5 py-3">
                            <Badge tone={status === 'Activa' ? 'success' : 'neutral'}>{status}</Badge>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => openEditPromoModal(promo)}
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

      {/* New monthly menu modal: only picks the month, planning happens in the main view */}
      <Modal
        open={newMonthModalOpen}
        onClose={() => setNewMonthModalOpen(false)}
        title="Nuevo menú mensual"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewMonthModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMonth} disabled={!newMonth}>
              Crear borrador
            </Button>
          </>
        }
      >
        <Field label="Mes a planificar">
          <Input
            type="month"
            value={newMonth}
            onChange={(e) => {
              setNewMonth(e.target.value)
              setNewMonthError('')
            }}
          />
        </Field>
        {newMonthError && <p className="text-xs text-danger-600 mt-1.5">{newMonthError}</p>}
      </Modal>

      {/* New/edit promotion modal */}
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
                onClick={promoForm.products.length > 0 ? clearAll : selectAllAvailable}
                className="text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                {promoForm.products.length > 0 ? 'Quitar todos' : 'Seleccionar todos los disponibles'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => {
                const active = promoForm.products.includes(p.id)
                const blocked = !active && hasActivePromo(p.id, editingPromoId)
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={blocked}
                    onClick={() => toggleApplicableProduct(p.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      active
                        ? 'border-teal-500 bg-teal-50'
                        : blocked
                        ? 'border-ink-100 bg-ink-50 opacity-50 cursor-not-allowed'
                        : 'border-ink-100 hover:bg-ink-50'
                    }`}
                  >
                    <span className="text-base">{p.image}</span>
                    <span className="text-xs font-medium text-ink-900 truncate">
                      {p.name}
                      {blocked && <span className="block text-[10px] text-ink-400">Ya en otra promoción</span>}
                    </span>
                    {active && <XIcon size={13} className="text-teal-600 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
            {promoError && <p className="text-xs text-danger-600 mt-1.5">{promoError}</p>}
          </Field>

          <Field label="Imagen de la promoción">
            <div className="flex items-center gap-3">
              {isImageFile(promoForm.image) ? (
                <img src={promoForm.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-100" />
              ) : (
                <span className="text-3xl">{promoForm.image}</span>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
                <Upload size={15} />
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handlePromoImageFile} />
              </label>
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Descuento (%)">
              <Input
                type="number"
                value={promoForm.discount}
                onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                placeholder="0"
              />
            </Field>
            <Field label="Inicio">
              <Input
                type="date"
                value={promoForm.startDate}
                onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
              />
            </Field>
            <Field label="Fin">
              <Input
                type="date"
                value={promoForm.endDate}
                onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
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

      {/* New/edit Monthly Menu dish modal: entity separate from the Products catalog */}
      <Modal
        open={dishModalOpen}
        onClose={() => setDishModalOpen(false)}
        title={editingDishId ? 'Editar platillo' : 'Nuevo platillo del Menú Mensual'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDishModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDish}>
              {editingDishId ? 'Guardar cambios' : 'Crear platillo'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveDish}>
          <Field label="Nombre del platillo">
            <Input
              value={dishForm.name}
              onChange={(e) => updateDishField('name', e.target.value)}
              placeholder="Ej. Almuerzo Ejecutivo"
            />
            {dishErrors.name && <p className="text-xs text-danger-600 mt-1.5">{dishErrors.name}</p>}
          </Field>

          <Field label="Descripción" >
            <Textarea
              value={dishForm.description}
              onChange={(e) => updateDishField('description', e.target.value)}
              placeholder="Breve descripción del platillo..."
            />
            {dishErrors.description && (
              <p className="text-xs text-danger-600 mt-1.5">{dishErrors.description}</p>
            )}
          </Field>

          <Field label="Imagen del platillo">
            <div className="flex items-center gap-3">
              {isImageFile(dishForm.image) ? (
                <img src={dishForm.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-100" />
              ) : (
                <span className="text-3xl">{dishForm.image}</span>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
                <Upload size={15} />
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleDishImageFile} />
              </label>
            </div>
            {dishErrors.image && <p className="text-xs text-danger-600 mt-1.5">{dishErrors.image}</p>}
          </Field>

          <Field
            label="Ingredientes (obligatorio)"
            hint="Busca en el catálogo o agrega uno nuevo. Requerido para validar alérgenos, ya que este platillo se prepara bajo demanda según el conteo de preórdenes del día."
          >
            <IngredientsInput
              value={dishForm.ingredients}
              catalog={ingredientsCatalog}
              onChange={(newIngredients) => updateDishField('ingredients', newIngredients)}
              onNewIngredient={addToIngredientsCatalog}
            />
            {dishErrors.ingredients && (
              <p className="text-xs text-danger-600 mt-1.5">{dishErrors.ingredients}</p>
            )}
          </Field>
        </form>
      </Modal>
    </>
  )
}
