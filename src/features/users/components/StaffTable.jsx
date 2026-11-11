import { UserCheck, UserX, Pencil, Trash2 } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import DataTable from "../../../components/ui/DataTable";
import { fullName } from "../staffForm";
import {
  canDeleteStaff,
  canEditStaff,
  isManagedByOwner,
} from "../staffRules";

function StatusBadge({ member }) {
  return (
    <Badge tone={member.is_active ? "success" : "neutral"}>
      {member.is_active ? "Activo" : "Inactivo"}
    </Badge>
  );
}

// Edit/delete are offered per account according to staffRules.
function StaffActions({ member, onEdit, onToggleStatus, onDelete, align }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${align === "end" ? "justify-end" : ""}`}
    >
      {isManagedByOwner(member) && (
        <span className="text-xs text-ink-300">Gestiona su propio perfil</span>
      )}
      {canEditStaff(member) && (
        <button
          onClick={() => onEdit(member)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg text-ink-600 bg-ink-50 hover:bg-ink-100 transition-colors"
        >
          <Pencil size={13} />
          Editar
        </button>
      )}
      <button
        onClick={() => onToggleStatus(member)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg transition-colors ${
          member.is_active
            ? "text-danger-600 bg-danger-50 hover:bg-danger-100"
            : "text-success-600 bg-success-50 hover:bg-success-100"
        }`}
      >
        {member.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
        {member.is_active ? "Desactivar" : "Activar"}
      </button>
      {canDeleteStaff(member) && (
        <button
          onClick={() => onDelete(member)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 md:py-1.5 rounded-lg text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors"
        >
          <Trash2 size={13} />
          Eliminar
        </button>
      )}
    </div>
  );
}

export default function StaffTable({
  members,
  loading,
  showInstitution,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  const actions = { onEdit, onToggleStatus, onDelete };

  const columns = [
    {
      key: "name",
      header: "Nombre completo",
      className: "font-medium text-ink-900",
      cell: fullName,
    },
    {
      key: "email",
      header: "Correo",
      className: "text-ink-500",
      cell: (member) => member.email,
    },
    ...(showInstitution
      ? [
          {
            key: "institution",
            header: "Institución",
            className: "text-ink-500",
            cell: (member) => member.institution_name,
          },
        ]
      : []),
    {
      key: "status",
      header: "Estado",
      cell: (member) => <StatusBadge member={member} />,
    },
    {
      key: "actions",
      header: "Acción",
      align: "right",
      cell: (member) => (
        <StaffActions member={member} align="end" {...actions} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={members}
      rowKey={(member) => member.id}
      loading={loading}
      emptyText="No hay usuarios registrados en este alcance."
      renderCard={(member) => (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-ink-900 truncate">
                {fullName(member)}
              </p>
              <p className="text-sm text-ink-500 truncate">{member.email}</p>
              {showInstitution && (
                <p className="text-xs text-ink-400 truncate">
                  {member.institution_name}
                </p>
              )}
            </div>
            <StatusBadge member={member} />
          </div>
          <StaffActions member={member} {...actions} />
        </div>
      )}
    />
  );
}
