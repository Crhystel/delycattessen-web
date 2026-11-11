import { useState } from "react";
import { Plus, GraduationCap, Headset } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageContainer from "../../components/ui/PageContainer";
import PageToolbar from "../../components/ui/PageToolbar";
import SearchInput from "../../components/ui/SearchInput";
import SegmentedTabs from "../../components/ui/SegmentedTabs";
import { useInstitution } from "../../context/InstitutionContext";
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

  function changeTab(id) {
    setTab(id);
    setQuery("");
  }

  return (
    <>
      <Topbar
        title="Gestión de Usuarios"
        subtitle={`Usuarios de crédito y personal operativo de ${scopeLabel}`}
      />

      <PageContainer>
        <PageToolbar
          start={<SegmentedTabs tabs={TABS} value={tab} onChange={changeTab} />}
          actions={
            <Button icon={Plus} onClick={() => setCreateModal(true)}>
              {tab === "TEACHER" ? "Nuevo usuario de crédito" : "Nuevo cajero"}
            </Button>
          }
        />

        {loadError && (
          <div className="rounded-xl bg-danger-50 text-danger-600 text-sm px-4 py-3">
            {loadError}
          </div>
        )}

        <Card padded={false}>
          <div className="p-4 sm:p-5 border-b border-ink-100">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar por nombre..."
            />
          </div>

          <StaffTable
            members={filteredList}
            loading={loading}
            showInstitution={selectedInstitution === ALL_INSTITUTIONS}
            onEdit={(member) => setEditModal({ member })}
            onToggleStatus={toggleStatus}
            onDelete={(member) => setDeleteModal({ member })}
          />
        </Card>
      </PageContainer>

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
