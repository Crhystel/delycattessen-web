import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Pencil, Trash2, Search, Upload, EyeOff } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import IngredientsInput from '../../components/admin/IngredientsInput'
import {
  products as initialProducts,
  categories,
  ingredientsCatalog as initialIngredientsCatalog,
} from '../../data/mockData'
import { usePromotions, activePromoFor } from '../../context/PromotionsContext'

const emptyForm = {
  name: '',
  description: '',
  category: categories[0],
  price: '',
  stock: '',
  ingredients: [],
  image: '🍴',
}

function isImageFile(image) {
  return typeof image === 'string' && image.startsWith('data:')
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'El nombre del producto es obligatorio.'
  if (!form.description.trim()) errors.description = 'La descripción es obligatoria.'
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Ingresa un precio válido.'
  if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Ingresa el stock disponible.'
  if (!form.image) errors.image = 'Selecciona o sube una imagen para el producto.'
  if (form.ingredients.length === 0) errors.ingredients = 'Debes declarar los ingredientes para validar alérgenos'
  return errors
}

export default function Products() {
  const { promotions } = usePromotions()
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/catalog/menu/', { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);


  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [ingredientsCatalog, setIngredientsCatalog] = useState(initialIngredientsCatalog)

  function addToCatalog(newIngredient) {
    setIngredientsCatalog((prev) =>
      prev.some((i) => i.toLowerCase() === newIngredient.toLowerCase())
        ? prev
        : [...prev, newIngredient].sort((a, b) => a.localeCompare(b, 'es'))
    )
  }

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function openNew() {
    navigate('/admin/products/create')
  }

  function openEdit(p) {
    setEditingId(p.id)
    setForm({
      ...p,
      price: String(p.price),
      stock: String(p.stock),
      ingredients: [...p.ingredients],
    })
    setErrors({})
    setModalOpen(true)
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateField('image', reader.result)
    reader.readAsDataURL(file)
  }

  function handleSave(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      status: Number(form.stock) > 0 ? 'Activo' : 'Agotado',
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
                  const hidden = p.stock <= 0
                  const promo = activePromoFor(p.id, promotions)
                  const discountedPrice = promo ? p.price * (1 - promo.discount / 100) : null
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition-opacity ${
                        hidden ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {isImageFile(p.image) ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className={`w-8 h-8 rounded-lg object-cover ${hidden ? 'grayscale' : ''}`}
                            />
                          ) : (
                            <span className={`text-xl ${hidden ? 'grayscale' : ''}`}>{p.image}</span>
                          )}
                          <div>
                            <p className="font-medium text-ink-900">{p.name}</p>
                            {p.description && (
                              <p className="text-xs text-ink-400 line-clamp-1">{p.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-500">{p.category}</td>
                      <td className="px-5 py-3">
                        {promo ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-ink-300 line-through text-xs">${p.price.toFixed(2)}</span>
                            <span className="text-teal-700 font-semibold">${discountedPrice.toFixed(2)}</span>
                            <Badge tone="success">-{promo.discount}%</Badge>
                          </div>
                        ) : (
                          <span className="text-ink-700 font-medium">${p.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-ink-700">{p.stock} u.</td>
                      <td className="px-5 py-3">
                        {hidden ? (
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

      {/* Product modal */}
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
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ej. Sandwich de Pollo"
              />
              {errors.name && <p className="text-xs text-danger-600 mt-1.5">{errors.name}</p>}
            </Field>
            <Field label="Categoría">
              <Select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                {categories.map((c) => (
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
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <p className="text-xs text-danger-600 mt-1.5">{errors.price}</p>}
            </Field>
            <Field label="Stock disponible">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-danger-600 mt-1.5">{errors.stock}</p>}
            </Field>
          </div>

          <Field label="Imagen del producto">
            <div className="flex items-center gap-3">
              {isImageFile(form.image) ? (
                <img src={form.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-ink-100" />
              ) : (
                <span className="text-3xl">{form.image}</span>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
                <Upload size={15} />
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
              </label>
            </div>
            {errors.image && <p className="text-xs text-danger-600 mt-1.5">{errors.image}</p>}
          </Field>

          <Field label="Descripción">
            <Textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Breve descripción del producto..."
            />
            {errors.description && <p className="text-xs text-danger-600 mt-1.5">{errors.description}</p>}
          </Field>

          <Field label="Ingredientes (obligatorio)" hint="Busca en el catálogo o agrega uno nuevo. Requerido para validar alérgenos en el POS.">
            <IngredientsInput
              value={form.ingredients}
              catalog={ingredientsCatalog}
              onChange={(newIngredients) => updateField('ingredients', newIngredients)}
              onNewIngredient={addToCatalog}
            />
            {errors.ingredients && <p className="text-xs text-danger-600 mt-1.5">{errors.ingredients}</p>}
          </Field>
        </form>
      </Modal>
    </>
  )
}
