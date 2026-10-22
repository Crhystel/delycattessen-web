import { UserCheck, UserX, Pencil, Trash2 } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { fullName } from "../staffForm";
import {
  canDeleteStaff,
  canEditStaff,
  isManagedByOwner,
} from "../staffRules";

function StaffRow({
  member,
  showInstitution,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <tr className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
      <td className="px-5 py-3 font-medium text-ink-900">
        {fullName(member)}
      </td>
      <td className="px-5 py-3 text-ink-500">{member.email}</td>
      {showInstitution && (
        <td className="px-5 py-3 text-ink-500">{member.institution_name}</td>
      )}
      <td className="px-5 py-3">
        <Badge tone={member.is_active ? "success" : "neutral"}>
          {member.is_active ? "Activo" : "Inactivo"}
        </Badge>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {isManagedByOwner(member) && (
            <span className="text-xs text-ink-300">
              Gestiona su propio perfil
            </span>
          )}
          {canEditStaff(member) && (
            <button
              onClick={() => onEdit(member)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-ink-600 bg-ink-50 hover:bg-ink-100 transition-colors"
            >
              <Pencil size={13} />
              Editar
            </button>
          )}
          <button
            onClick={() => onToggleStatus(member)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
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
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors"
            >
              <Trash2 size={13} />
              Eliminar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Edit/delete are offered per account according to staffRules.
export default function StaffTable({
  members,
  loading,
  showInstitution,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  const colSpan = showInstitution ? 5 : 4;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-ink-100">
            <th className="px-5 py-3 font-medium">Nombre completo</th>
            <th className="px-5 py-3 font-medium">Correo</th>
            {showInstitution && (
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
                colSpan={colSpan}
                className="px-5 py-8 text-center text-ink-300"
              >
                Cargando...
              </td>
            </tr>
          )}
          {!loading &&
            members.map((member) => (
              <StaffRow
                key={member.id}
                member={member}
                showInstitution={showInstitution}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))}
          {!loading && members.length === 0 && (
            <tr>
              <td
                colSpan={colSpan}
                className="px-5 py-8 text-center text-ink-300"
              >
                No hay usuarios registrados en este alcance.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
