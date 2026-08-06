import { useState } from 'react'
import { Plus, UserCheck, UserX, Search, GraduationCap, Headset, Pencil, Trash2, ShieldAlert, Eye, EyeOff, RotateCw } from 'lucide-react'
import Topbar from '../../components/admin/Topbar'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/Field'
import {
  usuariosCredito as usuariosCreditoIniciales,
  personalOperativo as personalOperativoInicial,
  padres,
} from '../../data/mockData'
import { useInstitucion } from '../../context/InstitucionContext'

const TABS = [
  { id: 'credito', label: 'Usuarios de crédito (Docentes)', icon: GraduationCap },
  { id: 'operativo', label: 'Personal Operativo', icon: Headset },
]

const FORM_VACIO = { nombre: '', correo: '' }

function generarPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pass = ''
  for (let i = 0; i < 8; i++) pass += chars[Math.floor(Math.random() * chars.length)]
  return pass
}

function AvisoContrasena() {
  return (
    <div className="flex items-start gap-2.5 bg-warning-50 text-warning-600 text-xs rounded-xl px-3.5 py-3 mb-4">
      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
      <p>
        Esta contraseña es temporal: el usuario deberá cambiarla obligatoriamente en su primer inicio de sesión.
      </p>
    </div>
  )
}

export default function Usuarios() {
  const { institucionSeleccionada } = useInstitucion()

  const [tab, setTab] = useState('credito')
  const [query, setQuery] = useState('')

  const [credito, setCredito] = useState(usuariosCreditoIniciales)
  const [operativo, setOperativo] = useState(personalOperativoInicial)

  function correoDuplicado(correo, excludeId) {
    const normalizado = correo.trim().toLowerCase()
    return (
      credito.some((u) => u.id !== excludeId && u.correo.toLowerCase() === normalizado) ||
      operativo.some((u) => u.id !== excludeId && u.correo.toLowerCase() === normalizado) ||
      padres.some((p) => p.correo.toLowerCase() === normalizado)
    )
  }

  // Crear usuario de crédito (docente)
  const [modalCredito, setModalCredito] = useState(false)
  const [formCredito, setFormCredito] = useState(FORM_VACIO)
  const [contrasenaCredito, setContrasenaCredito] = useState(generarPassword())
  const [errorCredito, setErrorCredito] = useState('')

  function abrirNuevoCredito() {
    setFormCredito(FORM_VACIO)
    setContrasenaCredito(generarPassword())
    setErrorCredito('')
    setModalCredito(true)
  }

  function handleSaveCredito(e) {
    e.preventDefault()
    const nombre = formCredito.nombre.trim()
    const correo = formCredito.correo.trim()
    if (!nombre || !correo) return
    if (correoDuplicado(correo)) {
      setErrorCredito('Este correo ya está registrado en el sistema.')
      return
    }
    setCredito((prev) => [
      {
        id: `uc${Date.now()}`,
        nombre,
        correo,
        institucion: institucionSeleccionada.nombre,
        estado: 'Activo',
        montoAcumulado: 0,
        contrasena: contrasenaCredito,
      },
      ...prev,
    ])
    setModalCredito(false)
  }

  // Crear personal operativo
  const [modalOperativo, setModalOperativo] = useState(false)
  const [formOperativo, setFormOperativo] = useState(FORM_VACIO)
  const [contrasenaOperativo, setContrasenaOperativo] = useState(generarPassword())
  const [errorOperativo, setErrorOperativo] = useState('')

  function abrirNuevoOperativo() {
    setFormOperativo(FORM_VACIO)
    setContrasenaOperativo(generarPassword())
    setErrorOperativo('')
    setModalOperativo(true)
  }

  function handleSaveOperativo(e) {
    e.preventDefault()
    const nombre = formOperativo.nombre.trim()
    const correo = formOperativo.correo.trim()
    if (!nombre || !correo) return
    if (correoDuplicado(correo)) {
      setErrorOperativo('Este correo ya está registrado en el sistema.')
      return
    }
    setOperativo((prev) => [
      {
        id: `po${Date.now()}`,
        nombre,
        correo,
        sede: institucionSeleccionada.nombre,
        estado: 'Activo',
        contrasena: contrasenaOperativo,
      },
      ...prev,
    ])
    setModalOperativo(false)
  }

  // Editar personal operativo
  const [modalEditar, setModalEditar] = useState(null) // usuario
  const [formEditar, setFormEditar] = useState({ ...FORM_VACIO, contrasena: '' })
  const [errorEditar, setErrorEditar] = useState('')
  const [contrasenaRestablecida, setContrasenaRestablecida] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  function abrirEditarOperativo(usuario) {
    setModalEditar(usuario)
    setFormEditar({ nombre: usuario.nombre, correo: usuario.correo, contrasena: usuario.contrasena })
    setErrorEditar('')
    setContrasenaRestablecida(false)
    setMostrarContrasena(false)
  }

  function handleRestablecerContrasena() {
    setFormEditar((prev) => ({ ...prev, contrasena: generarPassword() }))
    setContrasenaRestablecida(true)
    setMostrarContrasena(true)
  }

  function handleGuardarEditar(e) {
    e.preventDefault()
    const nombre = formEditar.nombre.trim()
    const correo = formEditar.correo.trim()
    if (!nombre || !correo || !modalEditar) return
    if (correoDuplicado(correo, modalEditar.id)) {
      setErrorEditar('Este correo ya está registrado en el sistema.')
      return
    }
    setOperativo((prev) =>
      prev.map((u) =>
        u.id === modalEditar.id ? { ...u, nombre, correo, contrasena: formEditar.contrasena } : u
      )
    )
    setModalEditar(null)
  }

  // Eliminar personal operativo
  const [modalEliminar, setModalEliminar] = useState(null) // usuario

  function handleEliminarOperativo() {
    if (!modalEliminar) return
    setOperativo((prev) => prev.filter((u) => u.id !== modalEliminar.id))
    setModalEliminar(null)
  }

  function toggleEstado(lista, setLista, id) {
    setLista((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
      )
    )
  }

  const filteredCredito = credito.filter(
    (u) =>
      u.institucion === institucionSeleccionada.nombre &&
      u.nombre.toLowerCase().includes(query.toLowerCase())
  )
  const filteredOperativo = operativo.filter(
    (u) =>
      u.sede === institucionSeleccionada.nombre &&
      u.nombre.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Topbar
        title="Gestión de Usuarios"
        subtitle={`Usuarios de crédito y personal operativo de ${institucionSeleccionada.nombre}`}
      />

      <main className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setQuery('') }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  tab === id ? 'bg-teal-500 text-white' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {tab === 'credito' && (
            <Button icon={Plus} onClick={abrirNuevoCredito}>
              Nuevo usuario de crédito
            </Button>
          )}
          {tab === 'operativo' && (
            <Button icon={Plus} onClick={abrirNuevoOperativo}>
              Nuevo cajero
            </Button>
          )}
        </div>

        <Card padded={false}>
          <div className="p-5 border-b border-ink-100">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
              />
            </div>
          </div>

          {tab === 'credito' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-500 border-b border-ink-100">
                    <th className="px-5 py-3 font-medium">Nombre completo</th>
                    <th className="px-5 py-3 font-medium">Correo</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCredito.map((u) => (
                    <tr key={u.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-medium text-ink-900">{u.nombre}</td>
                      <td className="px-5 py-3 text-ink-500">{u.correo}</td>
                      <td className="px-5 py-3">
                        <Badge tone={u.estado === 'Activo' ? 'success' : 'neutral'}>{u.estado}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleEstado(credito, setCredito, u.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              u.estado === 'Activo'
                                ? 'text-danger-600 bg-danger-50 hover:bg-danger-100'
                                : 'text-success-600 bg-success-50 hover:bg-success-100'
                            }`}
                          >
                            {u.estado === 'Activo' ? <UserX size={13} /> : <UserCheck size={13} />}
                            {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCredito.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-ink-300">
                        No hay usuarios de crédito registrados en esta sede.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'operativo' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-500 border-b border-ink-100">
                    <th className="px-5 py-3 font-medium">Nombre completo</th>
                    <th className="px-5 py-3 font-medium">Correo</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperativo.map((u) => (
                    <tr key={u.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-medium text-ink-900">{u.nombre}</td>
                      <td className="px-5 py-3 text-ink-500">{u.correo}</td>
                      <td className="px-5 py-3">
                        <Badge tone={u.estado === 'Activo' ? 'success' : 'neutral'}>{u.estado}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirEditarOperativo(u)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-ink-600 bg-ink-50 hover:bg-ink-100 transition-colors"
                          >
                            <Pencil size={13} />
                            Editar
                          </button>
                          <button
                            onClick={() => toggleEstado(operativo, setOperativo, u.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              u.estado === 'Activo'
                                ? 'text-danger-600 bg-danger-50 hover:bg-danger-100'
                                : 'text-success-600 bg-success-50 hover:bg-success-100'
                            }`}
                          >
                            {u.estado === 'Activo' ? <UserX size={13} /> : <UserCheck size={13} />}
                            {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => setModalEliminar(u)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors"
                          >
                            <Trash2 size={13} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOperativo.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-ink-300">
                        No hay personal operativo registrado en esta sede.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Modal nuevo usuario de crédito (docente) */}
      <Modal
        open={modalCredito}
        onClose={() => setModalCredito(false)}
        title="Nuevo usuario de crédito"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalCredito(false)}>Cancelar</Button>
            <Button onClick={handleSaveCredito}>Crear cuenta</Button>
          </>
        }
      >
        <form onSubmit={handleSaveCredito}>
          <Field label="Nombre completo">
            <Input
              value={formCredito.nombre}
              onChange={(e) => setFormCredito({ ...formCredito, nombre: e.target.value })}
              placeholder="Lic. Nombre Apellido"
            />
          </Field>
          <Field label="Correo institucional">
            <Input
              type="email"
              value={formCredito.correo}
              onChange={(e) => { setFormCredito({ ...formCredito, correo: e.target.value }); setErrorCredito('') }}
              placeholder="nombre@institucion.edu.ec"
            />
            {errorCredito && <p className="text-xs text-danger-600 mt-1.5">{errorCredito}</p>}
          </Field>
          <AvisoContrasena />
          <Field label="Contraseña generada">
            <div className="flex items-center gap-2">
              <Input value={contrasenaCredito} readOnly className="font-mono" />
              <Button type="button" variant="outline" onClick={() => setContrasenaCredito(generarPassword())}>
                Regenerar
              </Button>
            </div>
          </Field>
        </form>
      </Modal>

      {/* Modal nuevo personal operativo */}
      <Modal
        open={modalOperativo}
        onClose={() => setModalOperativo(false)}
        title="Nuevo cajero / personal operativo"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOperativo(false)}>Cancelar</Button>
            <Button onClick={handleSaveOperativo}>Crear cuenta</Button>
          </>
        }
      >
        <form onSubmit={handleSaveOperativo}>
          <Field label="Nombre completo">
            <Input
              value={formOperativo.nombre}
              onChange={(e) => setFormOperativo({ ...formOperativo, nombre: e.target.value })}
              placeholder="Nombre Apellido"
            />
          </Field>
          <Field label="Correo">
            <Input
              type="email"
              value={formOperativo.correo}
              onChange={(e) => { setFormOperativo({ ...formOperativo, correo: e.target.value }); setErrorOperativo('') }}
              placeholder="nombre@delycattessen.com"
            />
            {errorOperativo && <p className="text-xs text-danger-600 mt-1.5">{errorOperativo}</p>}
          </Field>
          <AvisoContrasena />
          <Field label="Contraseña generada">
            <div className="flex items-center gap-2">
              <Input value={contrasenaOperativo} readOnly className="font-mono" />
              <Button type="button" variant="outline" onClick={() => setContrasenaOperativo(generarPassword())}>
                Regenerar
              </Button>
            </div>
          </Field>
        </form>
      </Modal>

      {/* Modal editar personal operativo */}
      <Modal
        open={!!modalEditar}
        onClose={() => setModalEditar(null)}
        title="Editar personal operativo"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalEditar(null)}>Cancelar</Button>
            <Button onClick={handleGuardarEditar}>Guardar cambios</Button>
          </>
        }
      >
        {modalEditar && (
          <form onSubmit={handleGuardarEditar}>
            <Field label="Nombre completo">
              <Input
                value={formEditar.nombre}
                onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
              />
            </Field>
            <Field label="Correo">
              <Input
                type="email"
                value={formEditar.correo}
                onChange={(e) => { setFormEditar({ ...formEditar, correo: e.target.value }); setErrorEditar('') }}
              />
              {errorEditar && <p className="text-xs text-danger-600 mt-1.5">{errorEditar}</p>}
            </Field>
            {contrasenaRestablecida && <AvisoContrasena />}
            <Field
              label="Contraseña"
              hint={
                contrasenaRestablecida
                  ? undefined
                  : 'Por seguridad, permanece oculta. Restablécela para generar una nueva y mostrarla.'
              }
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={formEditar.contrasena}
                    readOnly
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600"
                  >
                    {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button type="button" variant="outline" icon={RotateCw} onClick={handleRestablecerContrasena}>
                  Restablecer
                </Button>
              </div>
            </Field>
          </form>
        )}
      </Modal>

      {/* Confirmar eliminación de personal operativo */}
      <Modal
        open={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        title="Eliminar personal operativo"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalEliminar(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleEliminarOperativo}>Eliminar</Button>
          </>
        }
      >
        {modalEliminar && (
          <p className="text-sm text-ink-700">
            ¿Eliminar definitivamente a <span className="font-semibold">{modalEliminar.nombre}</span>? Esta acción no se puede deshacer.
          </p>
        )}
      </Modal>
    </>
  )
}
