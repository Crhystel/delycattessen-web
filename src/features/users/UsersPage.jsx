import { useState } from "react";
import { Plus, Search, GraduationCap, Headset } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useInstitution } from "../../hooks/useInstitution";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useStaff } from "./hooks/useStaff";
import { fullName } from "./staffForm";
import StaffTable from "./components/StaffTable";
import CreateStaffModal from "./components/CreateStaffModal";
import EditStaffModal from "./components/EditStaffModal";
import DeleteStaffModal from "./components/DeleteStaffModal";

const TABS = [
  {
    id: "TEACHER",
    label: "Usuarios de crédito (Docentes)",
    icon: GraduationCap,
  },
  { id: "OPERATIONS_STAFF", label: "Personal Operativo", icon: Headset },
];

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
  // Each modal is mounted only while open; the key remounts it per opening.
  const [createModal, setCreateModal] = useState(null);
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

          <Button icon={Plus} onClick={() => setCreateModal({ key: Date.now() })}>
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
            onEdit={(member) => setEditModal({ key: Date.now(), member })}
            onToggleStatus={toggleStatus}
            onDelete={(member) => setDeleteModal({ key: Date.now(), member })}
          />
        </Card>
      </main>

      {createModal && (
        <CreateStaffModal
          key={createModal.key}
          role={tab}
          onCreate={createMember}
          onClose={() => setCreateModal(null)}
        />
      )}
      {editModal && (
        <EditStaffModal
          key={editModal.key}
          member={editModal.member}
          onUpdate={updateMember}
          onClose={() => setEditModal(null)}
        />
      )}
      {deleteModal && (
        <DeleteStaffModal
          key={deleteModal.key}
          member={deleteModal.member}
          onDelete={removeMember}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </>
  );
}
