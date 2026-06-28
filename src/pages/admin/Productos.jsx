import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, PackageX } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { productos as productosIniciales, categorias, mermas as mermasIniciales } from '../../data/mockData'

const emptyForm = {
  nombre: '',
  categoria: categorias[0],
  precio: '',
  stock: '',
  ingredientes: '',
  alergenos: '',
  imagen: '🍴',
}

export default function Productos() {
  const [tab, setTab] = useState('catalogo')
  const [items, setItems] = useState(productosIniciales)
  const [mermasList, setMermasList] = useState(mermasIniciales)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const [mermaModalOpen, setMermaModalOpen] = useState(false)
  const [mermaForm, setMermaForm] = useState({ producto: '', cantidad: '', motivo: '', fecha: '2026-06-17' })

  const filtered = useMemo(
    () => items.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditingId(p.id)
    setForm({
      ...p,
      precio: String(p.precio),
      stock: String(p.stock),
      ingredientes: p.ingredientes.join(', '),
      alergenos: p.alergenos.join(', '),
    })
    setModalOpen(true)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.nombre || !form.ingredientes) return // RF-05: ingredientes obligatorios

    const payload = {
      ...form,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0,
      ingredientes: form.ingredientes.split(',').map((s) => s.trim()).filter(Boolean),
      alergenos: form.alergenos.split(',').map((s) => s.trim()).filter(Boolean),
      estado: Number(form.stock) > 0 ? 'Activo' : 'Agotado',
    }

    if (editingId) {
      setItems((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
    } else {
      setItems((prev) => [...prev, { ...payload, id: `p${Date.now()}` }])
    }
    setModalOpen(false)
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function handleSaveMerma(e) {
    e.preventDefault()
    if (!mermaForm.producto || !mermaForm.cantidad) return
    setMermasList((prev) => [
      { id: `m${Date.now()}`, ...mermaForm, cantidad: Number(mermaForm.cantidad) },
      ...prev,
    ])

    // Descuenta el stock del producto seleccionado (control de mermas en tiempo real)
    setItems((prev) =>
      prev.map((p) =>
        p.nombre === mermaForm.producto
          ? {
              ...p,
              stock: Math.max(0, p.stock - Number(mermaForm.cantidad)),
              estado: Math.max(0, p.stock - Number(mermaForm.cantidad)) > 0 ? 'Activo' : 'Agotado',
            }
          : p
      )
    )

    setMermaForm({ producto: '', cantidad: '', motivo: '', fecha: '2026-06-17' })
    setMermaModalOpen(false)
  }

  return (
    <>
      <Topbar
        title="Catálogo e Inventario"
        subtitle="Gestión de productos, ingredientes, stock y mermas"
      />

      <main className="p-6 space-y-5">
        <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
          {[
            { id: 'catalogo', label: 'Catálogo' },
            { id: 'mermas', label: 'Registro de Mermas' },
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

        {tab === 'catalogo' ? (
          <Card padded={false}>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                />
              </div>
              <Button icon={Plus} onClick={openNew}>
                Nuevo producto
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-500 border-b border-ink-100">
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <th className="px-5 py-3 font-medium">Categoría</th>
                    <th className="px-5 py-3 font-medium">Precio</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Alérgenos</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{p.imagen}</span>
                          <span className="font-medium text-ink-900">{p.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-500">{p.categoria}</td>
                      <td className="px-5 py-3 text-ink-700 font-medium">${p.precio.toFixed(2)}</td>
                      <td className="px-5 py-3 text-ink-700">{p.stock} u.</td>
                      <td className="px-5 py-3">
                        {p.alergenos.length ? (
                          <div className="flex flex-wrap gap-1">
                            {p.alergenos.map((a) => (
                              <Badge key={a} tone="warning">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-ink-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={p.estado === 'Activo' ? 'success' : 'danger'}>{p.estado}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(p)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card padded={false}>
            <div className="p-5 flex items-center justify-between border-b border-ink-100">
              <CardHeader title="Mermas registradas" subtitle="Bajas de inventario por vencimiento o daño" />
              <Button icon={PackageX} variant="secondary" onClick={() => setMermaModalOpen(true)}>
                Registrar merma
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">Cantidad</th>
                  <th className="px-5 py-3 font-medium">Motivo</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {mermasList.map((m) => (
                  <tr key={m.id} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink-900">{m.producto}</td>
                    <td className="px-5 py-3 text-ink-700">{m.cantidad} u.</td>
                    <td className="px-5 py-3 text-ink-500">{m.motivo}</td>
                    <td className="px-5 py-3 text-ink-500">{m.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>

      {/* Modal producto */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar producto' : 'Nuevo producto'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar producto</Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre del producto">
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Sandwich de Pollo"
              />
            </Field>
            <Field label="Categoría">
              <Select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Precio (USD)">
              <Input
                type="number"
                step="0.1"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                placeholder="0.00"
              />
            </Field>
            <Field label="Stock disponible">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </Field>
          </div>

          <Field label="Ingredientes (obligatorio, separados por coma)" hint="Requerido para validar alérgenos en el POS">
            <Textarea
              value={form.ingredientes}
              onChange={(e) => setForm({ ...form, ingredientes: e.target.value })}
              placeholder="Pan integral, pollo, lechuga..."
            />
          </Field>

          <Field label="Alérgenos detectados (separados por coma)">
            <Input
              value={form.alergenos}
              onChange={(e) => setForm({ ...form, alergenos: e.target.value })}
              placeholder="Gluten, Lácteos..."
            />
          </Field>
        </form>
      </Modal>

      {/* Modal merma */}
      <Modal
        open={mermaModalOpen}
        onClose={() => setMermaModalOpen(false)}
        title="Registrar merma"
        footer={
          <>
            <Button variant="outline" onClick={() => setMermaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMerma}>Registrar</Button>
          </>
        }
      >
        <form onSubmit={handleSaveMerma}>
          <Field label="Producto">
            <Select
              value={mermaForm.producto}
              onChange={(e) => setMermaForm({ ...mermaForm, producto: e.target.value })}
            >
              <option value="">Selecciona un producto</option>
              {items.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cantidad afectada">
            <Input
              type="number"
              value={mermaForm.cantidad}
              onChange={(e) => setMermaForm({ ...mermaForm, cantidad: e.target.value })}
            />
          </Field>
          <Field label="Motivo">
            <Input
              value={mermaForm.motivo}
              onChange={(e) => setMermaForm({ ...mermaForm, motivo: e.target.value })}
              placeholder="Vencimiento, rotura, humedad..."
            />
          </Field>
          <Field label="Fecha">
            <Input
              type="date"
              value={mermaForm.fecha}
              onChange={(e) => setMermaForm({ ...mermaForm, fecha: e.target.value })}
            />
          </Field>
        </form>
      </Modal>
    </>
  )
}
