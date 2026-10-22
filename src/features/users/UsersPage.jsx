import { useState } from "react";
import { Plus, Search, GraduationCap, Headset } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useInstitution } from "../../context/InstitutionContext";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useStaff } from "./hooks/useStaff";
import { fullName } from "./staffForm";
import StaffTable from "./components/StaffTable";
import CreateStaffModal from "./components/CreateStaffModal";
import EditStaffModal from "./components/EditStaffModal";

const TABS = [
  {
    id: "TEACHER",
    label: "Usuarios de crédito (Docentes)",
    icon: GraduationCap,
  },
  { id: "OPERATIONS_STAFF", label: "Personal Operativo", icon: Headset },
];

function DeleteStaffModal({ member, onDelete, onClose }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const deleted = await onDelete(member);
    setDeleting(false);
    if (deleted) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Eliminar personal operativo"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-700">
        ¿Eliminar definitivamente a{" "}
        <span className="font-semibold">{fullName(member)}</span>? Esta acción
        no se puede deshacer.
      </p>
    </Modal>
  );
}

export default function UsersPage() {
  const { selectedInstitution, institutions } = useInstitution();
  const {
    staff,
    loading,
    loadError,
    createMember,
    updateMember,
    toggleStatus,
    removeMember,
  } = useStaff();

  const [tab, setTab] = useState("TEACHER");
  const [query, setQuery] = useState("");
  // Each modal is rendered only while its state is set.
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const scopeLabel =
    selectedInstitution === ALL_INSTITUTIONS
      ? "todas las instituciones"
      : selectedInstitution
        ? institutions.find((i) => i.id === selectedInstitution)?.name || ""
        : "tu institución";

  const filteredList = staff.filter(
    (u) =>
      u.role === tab && fullName(u).toLowerCase().includes(query.toLowerCase()),
  );

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

          <Button icon={Plus} onClick={() => setCreateModal(true)}>
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

          <StaffTable
            members={filteredList}
            loading={loading}
            canManage={tab === "OPERATIONS_STAFF"}
            showInstitution={selectedInstitution === ALL_INSTITUTIONS}
            onEdit={(member) => setEditModal({ member })}
            onToggleStatus={toggleStatus}
            onDelete={(member) => setDeleteModal({ member })}
          />
        </Card>
      </main>

      {createModal && (
        <CreateStaffModal
          role={tab}
          onCreate={createMember}
          onClose={() => setCreateModal(false)}
        />
      )}
      {editModal && (
        <EditStaffModal
          member={editModal.member}
          onUpdate={updateMember}
          onClose={() => setEditModal(null)}
        />
      )}
      {deleteModal && (
        <DeleteStaffModal
          member={deleteModal.member}
          onDelete={removeMember}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </>
  );
}
