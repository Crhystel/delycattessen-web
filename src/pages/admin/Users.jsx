import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  UserCheck,
  UserX,
  Search,
  GraduationCap,
  Headset,
  Pencil,
  Trash2,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";
import Topbar from "../../components/admin/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, Input } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import {
  useInstitution,
  ALL_INSTITUTIONS,
} from "../../context/InstitutionContext";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../services/staffService";

const TABS = [
  {
    id: "TEACHER",
    label: "Usuarios de crédito (Docentes)",
    icon: GraduationCap,
  },
  { id: "OPERATIONS_STAFF", label: "Personal Operativo", icon: Headset },
];

const EMPTY_FORM = {
  first_name: "",
  second_name: "",
  last_name: "",
  second_last_name: "",
  email: "",
};

function fullName(u) {
  return [u.first_name, u.second_name, u.last_name, u.second_last_name]
    .filter(Boolean)
    .join(" ");
}

function PasswordNotice() {
  return (
    <div className="flex items-start gap-2.5 bg-warning-50 text-warning-600 text-xs rounded-xl px-3.5 py-3 mb-4">
      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
      <p>
        Esta contraseña es temporal: el usuario deberá cambiarla
        obligatoriamente en su primer inicio de sesión.
      </p>
    </div>
  );
}

function CredentialsPanel({ email, password }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(
      `Correo: ${email}\nContraseña temporal: ${password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <PasswordNotice />
      <div className="rounded-xl border border-ink-100 p-4 space-y-2 font-mono text-sm">
        <p>
          <span className="text-ink-500">Correo:</span> {email}
        </p>
        <p>
          <span className="text-ink-500">Contraseña:</span> {password}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        icon={copied ? Check : Copy}
        onClick={copy}
        className="w-full mt-3"
      >
        {copied ? "Copiado" : "Copiar credenciales"}
      </Button>
    </div>
  );
}

export default function Users() {
  const { token } = useAuth();
  const { selectedInstitution, institutions } = useInstitution();

  const [tab, setTab] = useState("TEACHER");
  const [query, setQuery] = useState("");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadStaff = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getStaff(token, selectedInstitution)
      .then(setStaff)
      .catch(() =>
        setLoadError("No se pudo cargar el personal. Intenta de nuevo."),
      )
      .finally(() => setLoading(false));
  }, [token, selectedInstitution]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const scopeLabel =
    selectedInstitution === ALL_INSTITUTIONS
      ? "todas las instituciones"
      : selectedInstitution
        ? institutions.find((i) => i.id === selectedInstitution)?.name ||
          ""
        : "tu institución";

  const filteredList = staff.filter(
    (u) =>
      u.role === tab &&
      fullName(u).toLowerCase().includes(query.toLowerCase()),
  );

  // Create account (shared between both tabs)
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  function openCreateModal() {
    setCreateForm(EMPTY_FORM);
    setCreateError("");
    setCreatedCredentials(null);
    setCreateModal(true);
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();
    if (
      !createForm.first_name.trim() ||
      !createForm.last_name.trim() ||
      !createForm.email.trim()
    )
      return;
    setCreating(true);
    setCreateError("");
    try {
      const data = await createStaff(token, { ...createForm, role: tab });
      setCreatedCredentials({
        email: data.email,
        password: data.password_temporal,
      });
      loadStaff();
    } catch (err) {
      setCreateError(err.message || "No se pudo crear la cuenta.");
    } finally {
      setCreating(false);
    }
  }

  // Edit / activate-deactivate / delete (Operations Staff only, per RF-03)
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  function openEditStaffModal(staffMember) {
    setEditModal(staffMember);
    setEditForm({
      first_name: staffMember.first_name,
      second_name: staffMember.second_name,
      last_name: staffMember.last_name,
      second_last_name: staffMember.second_last_name,
      email: staffMember.email,
    });
    setEditError("");
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editModal) return;
    setSavingEdit(true);
    setEditError("");
    try {
      await updateStaff(token, editModal.id, editForm);
      setEditModal(null);
      loadStaff();
    } catch (err) {
      setEditError(err.message || "No se pudo guardar los cambios.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function toggleStatus(staffMember) {
    try {
      await updateStaff(token, staffMember.id, { is_active: !staffMember.is_active });
      loadStaff();
    } catch {
      setLoadError("No se pudo actualizar el estado de la cuenta.");
    }
  }

  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteStaff() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteStaff(token, deleteModal.id);
      setDeleteModal(null);
      loadStaff();
    } catch (err) {
      setLoadError(err.message || "No se pudo eliminar la cuenta.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        title="Gestión de Usuarios"
        subtitle={`Usuarios de crédito y personal operativo de ${scopeLabel}`}
      />

      <main className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  tab === id
                    ? "bg-teal-500 text-white"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <Button icon={Plus} onClick={openCreateModal}>
            {tab === "TEACHER" ? "Nuevo usuario de crédito" : "Nuevo cajero"}
          </Button>
        </div>

        {loadError && (
          <div className="rounded-xl bg-danger-50 text-danger-600 text-sm px-4 py-3">
            {loadError}
          </div>
        )}

        <Card padded={false}>
          <div className="p-5 border-b border-ink-100">
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Nombre completo</th>
                  <th className="px-5 py-3 font-medium">Correo</th>
                  {selectedInstitution === ALL_INSTITUTIONS && (
                    <th className="px-5 py-3 font-medium">Institución</th>
                  )}
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-ink-300"
                    >
                      Cargando...
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredList.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60"
                    >
                      <td className="px-5 py-3 font-medium text-ink-900">
                        {fullName(u)}
                      </td>
                      <td className="px-5 py-3 text-ink-500">{u.email}</td>
                      {selectedInstitution === ALL_INSTITUTIONS && (
                        <td className="px-5 py-3 text-ink-500">
                          {u.institution_name}
                        </td>
                      )}
                      <td className="px-5 py-3">
                        <Badge tone={u.is_active ? "success" : "neutral"}>
                          {u.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tab === "OPERATIONS_STAFF" && (
                            <button
                              onClick={() => openEditStaffModal(u)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-ink-600 bg-ink-50 hover:bg-ink-100 transition-colors"
                            >
                              <Pencil size={13} />
                              Editar
                            </button>
                          )}
                          <button
                            onClick={() => toggleStatus(u)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              u.is_active
                                ? "text-danger-600 bg-danger-50 hover:bg-danger-100"
                                : "text-success-600 bg-success-50 hover:bg-success-100"
                            }`}
                          >
                            {u.is_active ? (
                              <UserX size={13} />
                            ) : (
                              <UserCheck size={13} />
                            )}
                            {u.is_active ? "Desactivar" : "Activar"}
                          </button>
                          {tab === "OPERATIONS_STAFF" && (
                            <button
                              onClick={() => setDeleteModal(u)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors"
                            >
                              <Trash2 size={13} />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {!loading && filteredList.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-ink-300"
                    >
                      No hay usuarios registrados en este alcance.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Create account modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title={
          tab === "TEACHER"
            ? "Nuevo usuario de crédito"
            : "Nuevo cajero / personal operativo"
        }
        footer={
          createdCredentials ? (
            <Button onClick={() => setCreateModal(false)}>Listo</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSubmit} disabled={creating}>
                {creating ? "Creando..." : "Crear cuenta"}
              </Button>
            </>
          )
        }
      >
        {createdCredentials ? (
          <CredentialsPanel
            email={createdCredentials.email}
            password={createdCredentials.password}
          />
        ) : (
          <form onSubmit={handleCreateSubmit}>
            <Field label="Primer nombre">
              <Input
                value={createForm.first_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, first_name: e.target.value })
                }
                placeholder="Primer nombre"
              />
            </Field>
            <Field label="Segundo nombre (opcional)">
              <Input
                value={createForm.second_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, second_name: e.target.value })
                }
                placeholder="Segundo nombre"
              />
            </Field>
            <Field label="Primer apellido">
              <Input
                value={createForm.last_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, last_name: e.target.value })
                }
                placeholder="Primer apellido"
              />
            </Field>
            <Field label="Segundo apellido (opcional)">
              <Input
                value={createForm.second_last_name}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    second_last_name: e.target.value,
                  })
                }
                placeholder="Segundo apellido"
              />
            </Field>
            <Field label="Correo">
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => {
                  setCreateForm({ ...createForm, email: e.target.value });
                  setCreateError("");
                }}
                placeholder="nombre@delycattessen.com"
              />
              {createError && (
                <p className="text-xs text-danger-600 mt-1.5">{createError}</p>
              )}
            </Field>
          </form>
        )}
      </Modal>

      {/* Edit operations staff modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Editar personal operativo"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModal(null)}>
              Cerrar
            </Button>
            <Button onClick={handleEditSubmit} disabled={savingEdit}>
              {savingEdit ? "Guardando..." : "Guardar cambios"}
            </Button>
          </>
        }
      >
        {editModal && (
          <form onSubmit={handleEditSubmit}>
            <Field label="Primer nombre">
              <Input
                value={editForm.first_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, first_name: e.target.value })
                }
              />
            </Field>
            <Field label="Segundo nombre (opcional)">
              <Input
                value={editForm.second_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, second_name: e.target.value })
                }
              />
            </Field>
            <Field label="Primer apellido">
              <Input
                value={editForm.last_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, last_name: e.target.value })
                }
              />
            </Field>
            <Field label="Segundo apellido (opcional)">
              <Input
                value={editForm.second_last_name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    second_last_name: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Correo">
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => {
                  setEditForm({ ...editForm, email: e.target.value });
                  setEditError("");
                }}
              />
              {editError && (
                <p className="text-xs text-danger-600 mt-1.5">{editError}</p>
              )}
            </Field>
          </form>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Eliminar personal operativo"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteStaff}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
      >
        {deleteModal && (
          <p className="text-sm text-ink-700">
            ¿Eliminar definitivamente a{" "}
            <span className="font-semibold">
              {fullName(deleteModal)}
            </span>
            ? Esta acción no se puede deshacer.
          </p>
        )}
      </Modal>
    </>
  );
}
