import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  Banknote,
  GraduationCap,
  CheckCircle2,
  Loader2,
  PackageCheck,
  RotateCcw,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { usePos } from '../../context/PosContext'

const metodosEstudiante = [
  { id: 'saldo', label: 'Saldo digital', icon: Wallet },
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
]

export default function Confirmacion() {
  const navigate = useNavigate()
  const { selectedUser, cartDetailed, cartTotal, resetSession } = usePos()
  const [metodo, setMetodo] = useState('saldo')
  const [estado, setEstado] = useState('revision') // revision | procesando | completado

  useEffect(() => {
    if (!selectedUser) navigate('/pos/identificacion')
  }, [selectedUser, navigate])

  if (!selectedUser) return null

  const modoEntrega = cartDetailed.length === 0 && !!selectedUser.preorden
  const esDocente = selectedUser.tipo === 'Docente'

  function confirmar() {
    setEstado('procesando')
    setTimeout(() => setEstado('completado'), 1100)
  }

  function nuevaVenta() {
    resetSession()
    navigate('/pos/identificacion')
  }

  if (estado === 'completado') {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-display font-bold text-xl text-ink-900">
            {modoEntrega ? 'Pedido entregado' : 'Cobro confirmado'}
          </h2>
          <p className="text-sm text-ink-500 mt-1.5">
            {selectedUser.nombre} · {selectedUser.institucion}
          </p>

          <div className="bg-ink-50 rounded-xl p-4 mt-5 text-left">
            {modoEntrega ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-700">{selectedUser.preorden.producto}</span>
                <span className="font-semibold text-success-600">Entregado</span>
              </div>
            ) : (
              <>
                {cartDetailed.map(({ productId, qty, product }) => (
                  <div key={productId} className="flex items-center justify-between text-sm py-1">
                    <span className="text-ink-700">
                      {qty}× {product.nombre}
                    </span>
                    <span className="text-ink-500">${(product.precio * qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-ink-200 mt-2 pt-2 flex items-center justify-between text-sm font-bold text-ink-900">
                  <span>Total {esDocente ? '(crédito docente)' : `(${metodo === 'saldo' ? 'saldo digital' : 'efectivo'})`}</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <Button className="w-full mt-6" icon={RotateCcw} onClick={nuevaVenta}>
            Nueva venta
          </Button>
        </Card>
      </main>
    )
  }

  if (modoEntrega) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <PackageCheck size={28} />
          </div>
          <h2 className="font-display font-bold text-xl text-ink-900">Entrega de preorden</h2>
          <p className="text-sm text-ink-500 mt-1.5">
            {selectedUser.nombre} tiene un pedido prepagado listo para despacho.
          </p>
          <div className="bg-ink-50 rounded-xl p-4 mt-5 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-900">{selectedUser.preorden.producto}</span>
            <span className="text-ink-500">{selectedUser.preorden.estado}</span>
          </div>
          <Button
            className="w-full mt-6"
            icon={estado === 'procesando' ? Loader2 : PackageCheck}
            onClick={confirmar}
            disabled={estado === 'procesando'}
          >
            {estado === 'procesando' ? 'Confirmando…' : 'Confirmar entrega'}
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <h2 className="font-display font-bold text-xl text-ink-900 text-center">Confirmar cobro</h2>
        <p className="text-sm text-ink-500 text-center mt-1.5 mb-5">
          {selectedUser.nombre} · {cartDetailed.length} producto(s)
        </p>

        <div className="bg-ink-50 rounded-xl p-4 mb-5">
          {cartDetailed.map(({ productId, qty, product }) => (
            <div key={productId} className="flex items-center justify-between text-sm py-1">
              <span className="text-ink-700">
                {qty}× {product.nombre}
              </span>
              <span className="text-ink-500">${(product.precio * qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-ink-200 mt-2 pt-2 flex items-center justify-between font-bold text-ink-900">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {esDocente ? (
          <div className="flex items-center gap-3 bg-teal-50 text-teal-700 rounded-xl px-4 py-3 mb-5">
            <GraduationCap size={20} />
            <div className="text-sm">
              <p className="font-semibold">Consumo a crédito docente</p>
              <p className="text-xs text-teal-700/70">Se consolidará en el reporte mensual para RRHH.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {metodosEstudiante.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetodo(m.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-colors ${
                  metodo === m.id ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-ink-100 hover:bg-ink-50'
                }`}
              >
                <m.icon size={20} className={metodo === m.id ? 'text-brand-600' : 'text-ink-500'} />
                <span className="text-sm font-medium text-ink-900">{m.label}</span>
                {m.id === 'saldo' && (
                  <span className="text-xs text-ink-500">Disp. ${selectedUser.saldo.toFixed(2)}</span>
                )}
              </button>
            ))}
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          icon={estado === 'procesando' ? Loader2 : CheckCircle2}
          onClick={confirmar}
          disabled={estado === 'procesando'}
        >
          {estado === 'procesando' ? 'Procesando…' : `Confirmar cobro · $${cartTotal.toFixed(2)}`}
        </Button>
      </Card>
    </main>
  )
}
