import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  PackageCheck,
  ArrowRight,
} from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { productos, categorias } from '../../data/mockData'
import { usePos } from '../../context/PosContext'

export default function Venta() {
  const navigate = useNavigate()
  const {
    selectedUser,
    cartDetailed,
    cartTotal,
    addToCart,
    decreaseFromCart,
    removeFromCart,
    allergenConflicts,
    parentalControlBlock,
  } = usePos()
  const [categoria, setCategoria] = useState('Todas')

  useEffect(() => {
    if (!selectedUser) navigate('/pos/identificacion')
  }, [selectedUser, navigate])

  if (!selectedUser) return null

  const productosFiltrados =
    categoria === 'Todas' ? productos : productos.filter((p) => p.categoria === categoria)

  const tieneConflictos = allergenConflicts.length > 0
  const excedeLimite = !!parentalControlBlock
  const puedeCobrar = cartDetailed.length > 0 && !tieneConflictos && !excedeLimite

  return (
    <main className="flex-1 grid lg:grid-cols-[1fr_380px]">
      {/* Catalogo */}
      <section className="p-6">
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {['Todas', ...categorias].map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                categoria === c
                  ? 'bg-teal-500 border-teal-500 text-white'
                  : 'bg-white border-ink-100 text-ink-500 hover:bg-ink-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosFiltrados.map((p) => {
            const tieneAlergenoConflicto = p.alergenos.some((a) => selectedUser.alergenos?.includes(a))
            const agotado = p.stock === 0
            return (
              <button
                key={p.id}
                disabled={agotado}
                onClick={() => addToCart(p.id)}
                className={`relative text-left bg-white rounded-2xl border p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  tieneAlergenoConflicto
                    ? 'border-danger-500 ring-1 ring-danger-100'
                    : 'border-ink-100 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {tieneAlergenoConflicto && (
                  <span className="absolute top-3 right-3 text-danger-500">
                    <ShieldAlert size={16} />
                  </span>
                )}
                <div className="text-3xl mb-2">{p.imagen}</div>
                <p className="font-semibold text-ink-900 text-sm leading-tight">{p.nombre}</p>
                <p className="text-xs text-ink-500 mt-0.5">{p.categoria}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-bold text-brand-600">${p.precio.toFixed(2)}</span>
                  {agotado ? (
                    <Badge tone="danger">Agotado</Badge>
                  ) : (
                    <span className="text-xs text-ink-300">{p.stock} disp.</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Panel de carrito */}
      <aside className="bg-white border-l border-ink-100 p-5 flex flex-col">
        <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
          <div className="w-11 h-11 rounded-xl bg-ink-50 flex items-center justify-center text-2xl">
            {selectedUser.foto}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 text-sm truncate">{selectedUser.nombre}</p>
            <p className="text-xs text-ink-500">{selectedUser.institucion}</p>
          </div>
          <Badge tone={selectedUser.tipo === 'Docente' ? 'teal' : 'brand'} className="ml-auto shrink-0">
            {selectedUser.tipo === 'Docente' ? <GraduationCap size={11} /> : null}
            {selectedUser.tipo}
          </Badge>
        </div>

        <div className="py-4 space-y-2.5 text-sm border-b border-ink-100">
          {selectedUser.tipo === 'Docente' ? (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Modalidad</span>
              <span className="font-semibold text-ink-900">Consumo a crédito</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Saldo digital</span>
              <span className="font-semibold text-ink-900">${selectedUser.saldo.toFixed(2)}</span>
            </div>
          )}
          {selectedUser.controlParental && (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Límite diario</span>
              <span className="font-semibold text-ink-900">
                ${selectedUser.gastoHoy.toFixed(2)} / ${selectedUser.controlParental.limiteDiario.toFixed(2)}
              </span>
            </div>
          )}
          {selectedUser.alergenos.length > 0 && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-500">Alérgenos</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {selectedUser.alergenos.map((a) => (
                  <Badge key={a} tone="warning">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedUser.preorden && (
          <div className="my-4 bg-success-50 rounded-xl p-3.5 flex items-start gap-2.5">
            <PackageCheck size={18} className="text-success-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-success-600">Preorden pendiente</p>
              <p className="text-xs text-ink-700 mt-0.5">{selectedUser.preorden.producto}</p>
              <button
                onClick={() => navigate('/pos/confirmacion')}
                className="text-xs font-semibold text-success-600 underline mt-1.5"
              >
                Ir a entregar pedido →
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-soft my-4 space-y-3 min-h-[120px]">
          {cartDetailed.length === 0 ? (
            <p className="text-sm text-ink-300 text-center py-8">El carrito está vacío.</p>
          ) : (
            cartDetailed.map(({ productId, qty, product }) => (
              <div key={productId} className="flex items-center gap-3">
                <span className="text-xl">{product.imagen}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{product.nombre}</p>
                  <p className="text-xs text-ink-500">${(product.precio * qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decreaseFromCart(productId)}
                    className="w-6 h-6 rounded-md bg-ink-100 flex items-center justify-center text-ink-700"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                  <button
                    onClick={() => addToCart(productId)}
                    className="w-6 h-6 rounded-md bg-ink-100 flex items-center justify-center text-ink-700"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-danger-500 hover:bg-danger-50 ml-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {tieneConflictos && (
          <div className="bg-danger-50 text-danger-600 rounded-xl p-3.5 mb-3 flex items-start gap-2.5">
            <ShieldAlert size={17} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold mb-1">Bloqueo por alérgenos</p>
              {allergenConflicts.map((c) => (
                <p key={c}>{c}</p>
              ))}
            </div>
          </div>
        )}

        {excedeLimite && (
          <div className="bg-warning-50 text-warning-600 rounded-xl p-3.5 mb-3 flex items-start gap-2.5">
            <AlertTriangle size={17} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold mb-1">Límite de gasto diario excedido</p>
              <p>
                Total proyectado ${parentalControlBlock.proyectado.toFixed(2)} supera el límite de $
                {parentalControlBlock.limiteDiario.toFixed(2)} configurado por el representante.
              </p>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-ink-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ink-500">Total a cobrar</span>
            <span className="font-display font-bold text-2xl text-ink-900">${cartTotal.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            disabled={!puedeCobrar}
            onClick={() => navigate('/pos/confirmacion')}
          >
            Continuar al cobro
          </Button>
        </div>
      </aside>
    </main>
  )
}
