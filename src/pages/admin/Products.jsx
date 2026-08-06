import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Upload, EyeOff } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import IngredientesInput from '../../components/admin/IngredientesInput'
import {
  productos as productosIniciales,
  categorias,
  catalogoIngredientes as catalogoIngredientesInicial,
} from '../../data/mockData'
import { usePromociones, promoActivaDe } from '../../context/PromocionesContext'

const emptyForm = {
  nombre: '',
  descripcion: '',
  categoria: categorias[0],
  precio: '',
  stock: '',
  ingredientes: [],
  imagen: '🍴',
}

function isImagenArchivo(imagen) {
  return typeof imagen === 'string' && imagen.startsWith('data:')
}

function validar(form) {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'El nombre del producto es obligatorio.'
  if (!form.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria.'
  if (form.precio === '' || Number(form.precio) <= 0) errores.precio = 'Ingresa un precio válido.'
  if (form.stock === '' || Number(form.stock) < 0) errores.stock = 'Ingresa el stock disponible.'
  if (!form.imagen) errores.imagen = 'Selecciona o sube una imagen para el producto.'
  if (form.ingredientes.length === 0) errores.ingredientes = 'Debes declarar los ingredientes para validar alérgenos'
  return errores
}

export default function Productos() {
  const { promociones } = usePromociones()
  const [items, setItems] = useState(productosIniciales)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errores, setErrores] = useState({})
  const [catalogoIngredientes, setCatalogoIngredientes] = useState(catalogoIngredientesInicial)

  function agregarACatalogo(nuevo) {
    setCatalogoIngredientes((prev) =>
      prev.some((i) => i.toLowerCase() === nuevo.toLowerCase())
        ? prev
        : [...prev, nuevo].sort((a, b) => a.localeCompare(b, 'es'))
    )
  }

  const filtered = useMemo(
    () => items.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setErrores({})
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditingId(p.id)
    setForm({
      ...p,
      precio: String(p.precio),
      stock: String(p.stock),
      ingredientes: [...p.ingredientes],
    })
    setErrores({})
    setModalOpen(true)
  }

  function handleImagenFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => actualizarCampo('imagen', reader.result)
    reader.readAsDataURL(file)
  }

  function handleSave(e) {
    e.preventDefault()
    const erroresValidacion = validar(form)
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    const payload = {
      ...form,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0,
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

  return (
    <>
      <Topbar
        title="Catálogo e Inventario"
        subtitle="Gestión de productos, ingredientes y stock"
      />

      <main className="p-6 space-y-5">
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

          <div className="px-5 py-2.5 border-b border-ink-100 bg-ink-50/50 text-xs text-ink-400 flex items-center gap-1.5">
            <EyeOff size={13} />
            Los productos con stock en cero se atenúan y quedan ocultos automáticamente del catálogo activo.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">Categoría</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Visibilidad</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const oculto = p.stock <= 0
                  const promo = promoActivaDe(p.id, promociones)
                  const precioConDescuento = promo ? p.precio * (1 - promo.descuento / 100) : null
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition-opacity ${
                        oculto ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {isImagenArchivo(p.imagen) ? (
                            <img
                              src={p.imagen}
                              alt={p.nombre}
                              className={`w-8 h-8 rounded-lg object-cover ${oculto ? 'grayscale' : ''}`}
                            />
                          ) : (
                            <span className={`text-xl ${oculto ? 'grayscale' : ''}`}>{p.imagen}</span>
                          )}
                          <div>
                            <p className="font-medium text-ink-900">{p.nombre}</p>
                            {p.descripcion && (
                              <p className="text-xs text-ink-400 line-clamp-1">{p.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-500">{p.categoria}</td>
                      <td className="px-5 py-3">
                        {promo ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-ink-300 line-through text-xs">${p.precio.toFixed(2)}</span>
                            <span className="text-teal-700 font-semibold">${precioConDescuento.toFixed(2)}</span>
                            <Badge tone="success">-{promo.descuento}%</Badge>
                          </div>
                        ) : (
                          <span className="text-ink-700 font-medium">${p.precio.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-ink-700">{p.stock} u.</td>
                      <td className="px-5 py-3">
                        {oculto ? (
                          <Badge tone="danger">
                            <EyeOff size={11} />
                            Oculto · sin stock
                          </Badge>
                        ) : (
                          <Badge tone="success">Visible</Badge>
                        )}
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
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-ink-300">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
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
                onChange={(e) => actualizarCampo('nombre', e.target.value)}
                placeholder="Ej. Sandwich de Pollo"
              />
              {errores.nombre && <p className="text-xs text-danger-600 mt-1.5">{errores.nombre}</p>}
            </Field>
            <Field label="Categoría">
              <Select value={form.categoria} onChange={(e) => actualizarCampo('categoria', e.target.value)}>
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
                onChange={(e) => actualizarCampo('precio', e.target.value)}
                placeholder="0.00"
              />
              {errores.precio && <p className="text-xs text-danger-600 mt-1.5">{errores.precio}</p>}
            </Field>
            <Field label="Stock disponible">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => actualizarCampo('stock', e.target.value)}
                placeholder="0"
              />
              {errores.stock && <p className="text-xs text-danger-600 mt-1.5">{errores.stock}</p>}
            </Field>
          </div>

          <Field label="Imagen del producto">
            <div className="flex items-center gap-3">
              {isImagenArchivo(form.imagen) ? (
                <img src={form.imagen} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-100" />
              ) : (
                <span className="text-3xl">{form.imagen}</span>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
                <Upload size={15} />
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleImagenFile} />
              </label>
            </div>
            {errores.imagen && <p className="text-xs text-danger-600 mt-1.5">{errores.imagen}</p>}
          </Field>

          <Field label="Descripción">
            <Textarea
              value={form.descripcion}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
              placeholder="Breve descripción del producto..."
            />
            {errores.descripcion && <p className="text-xs text-danger-600 mt-1.5">{errores.descripcion}</p>}
          </Field>

          <Field label="Ingredientes (obligatorio)" hint="Busca en el catálogo o agrega uno nuevo. Requerido para validar alérgenos en el POS.">
            <IngredientesInput
              value={form.ingredientes}
              catalogo={catalogoIngredientes}
              onChange={(nuevos) => actualizarCampo('ingredientes', nuevos)}
              onNuevoIngrediente={agregarACatalogo}
            />
            {errores.ingredientes && <p className="text-xs text-danger-600 mt-1.5">{errores.ingredientes}</p>}
          </Field>
        </form>
      </Modal>
    </>
  )
}
