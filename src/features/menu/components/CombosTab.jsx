import { Pencil, Trash2, Package } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { PROMO_STATUS } from "../menuUtils";

function ComboRow({ combo, showInstitution, onEdit, onDelete }) {
  const status = PROMO_STATUS[combo.status] ?? PROMO_STATUS.EXPIRED;

  function handleDelete() {
    if (
      window.confirm(
        `¿Eliminar la promoción "${combo.name}"? Dejará de ofrecerse en caja.`,
      )
    )
      onDelete(combo.id);
  }

  return (
    <tr className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-14 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
            {combo.image ? (
              <img
                src={combo.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={15} />
            )}
          </div>
          <div>
            <p className="font-medium text-ink-900">{combo.name}</p>
            <p className="text-xs text-ink-400">
              {combo.items
                .map((item) => `${item.quantity}× ${item.name}`)
                .join(" + ")}
            </p>
          </div>
        </div>
      </td>
      {showInstitution && (
        <td className="px-5 py-3 text-ink-500">{combo.institutionName}</td>
      )}
      <td className="px-5 py-3">
        <span className="text-ink-300 line-through text-xs mr-1.5">
          ${combo.regularPrice.toFixed(2)}
        </span>
        <span className="text-teal-700 font-semibold">
          ${combo.price.toFixed(2)}
        </span>
      </td>
      <td className="px-5 py-3 text-ink-500">{combo.startDate}</td>
      <td className="px-5 py-3 text-ink-500">{combo.endDate}</td>
      <td className="px-5 py-3">
        <Badge tone={status.tone}>{status.label}</Badge>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onEdit(combo)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function CombosTab({
  combos,
  loading,
  showInstitution,
  onEdit,
  onDelete,
}) {
  const colSpan = showInstitution ? 7 : 6;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 bg-ink-50/70 border border-ink-100 text-xs text-ink-500 rounded-xl px-3.5 py-3">
        <Package size={14} className="shrink-0 mt-0.5" />
        Un combo agrupa varios productos a un precio fijo. Mientras está
        vigente se muestra como banner en la app y el cajero lo agrega al
        carrito con un toque.
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Combo</th>
                {showInstitution && (
                  <th className="px-5 py-3 font-medium">Sede</th>
                )}
                <th className="px-5 py-3 font-medium">Precio</th>
                <th className="px-5 py-3 font-medium">Fecha inicio</th>
                <th className="px-5 py-3 font-medium">Fecha vencimiento</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-5 py-8 text-center text-ink-300"
                  >
                    Cargando promociones...
                  </td>
                </tr>
              )}
              {!loading &&
                combos.map((combo) => (
                  <ComboRow
                    key={combo.id}
                    combo={combo}
                    showInstitution={showInstitution}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              {!loading && combos.length === 0 && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-5 py-8 text-center text-ink-300"
                  >
                    No hay promociones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
