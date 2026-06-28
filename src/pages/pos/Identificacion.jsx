import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanFace, QrCode, Loader2, PackageCheck, GraduationCap } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import { usuariosPOS } from '../../data/mockData'
import { usePos } from '../../context/PosContext'

export default function Identificacion() {
  const navigate = useNavigate()
  const { setSelectedUser, resetSession } = usePos()
  const [metodo, setMetodo] = useState('facial')
  const [escaneando, setEscaneando] = useState(null)

  function handleSeleccionar(usuario) {
    setEscaneando(usuario.id)
    // Simula el tiempo de captura/validacion del patron biometrico o QR (RF-06)
    setTimeout(() => {
      setSelectedUser(usuario)
      navigate('/pos/venta')
    }, 850)
  }

  return (
    <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-2xl text-ink-900">Identifica al usuario</h2>
        <p className="text-sm text-ink-500 mt-1">
          Reconocimiento facial o código QR dinámico para recuperar perfil, saldo y restricciones.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex bg-white border border-ink-100 rounded-xl p-1 text-sm">
          {[
            { id: 'facial', label: 'Reconocimiento Facial', icon: ScanFace },
            { id: 'qr', label: 'Código QR', icon: QrCode },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMetodo(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                metodo === m.id ? 'bg-teal-500 text-white' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <m.icon size={16} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-ink-100 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
          {metodo === 'facial' ? <ScanFace size={28} /> : <QrCode size={28} />}
        </div>
        <p className="text-sm text-ink-500 max-w-sm">
          {metodo === 'facial'
            ? 'Apunta la cámara hacia el rostro del estudiante o docente. El sistema compara contra vectores cifrados, nunca fotografías planas.'
            : 'Solicita al usuario presentar el código QR dinámico generado en su app móvil.'}
        </p>
        <p className="text-xs text-ink-300 mt-3">
          Prototipo: selecciona una identidad simulada abajo para continuar el flujo.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {usuariosPOS.map((u) => (
          <button
            key={u.id}
            onClick={() => handleSeleccionar(u)}
            disabled={!!escaneando}
            className="relative bg-white rounded-2xl border border-ink-100 p-4 text-left hover:border-teal-300 hover:shadow-md transition-all disabled:opacity-60"
          >
            {escaneando === u.id && (
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Loader2 size={22} className="animate-spin text-teal-500" />
                <span className="text-xs font-medium text-ink-500">Validando…</span>
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-ink-50 flex items-center justify-center text-2xl mb-3">
              {u.foto}
            </div>
            <p className="font-semibold text-ink-900 text-sm leading-tight">{u.nombre}</p>
            <p className="text-xs text-ink-500 mt-0.5">{u.institucion}</p>
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <Badge tone={u.tipo === 'Docente' ? 'teal' : 'brand'}>
                {u.tipo === 'Docente' && <GraduationCap size={11} />}
                {u.tipo}
              </Badge>
              {u.preorden && (
                <Badge tone="success">
                  <PackageCheck size={11} />
                  Preorden
                </Badge>
              )}
              {u.alergenos.length > 0 && <Badge tone="warning">{u.alergenos.length} alérgeno(s)</Badge>}
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}
