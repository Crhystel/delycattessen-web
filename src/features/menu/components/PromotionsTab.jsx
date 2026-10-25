import { Pencil, Trash2, RefreshCw, Tag } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { PROMO_STATUS } from "../menuUtils";

function PromotionRow({ promo, showInstitution, onEdit, onDelete }) {
  const status = PROMO_STATUS[promo.status] ?? PROMO_STATUS.EXPIRED;

  function handleDelete() {
    if (
      window.confirm(
        "¿Eliminar este descuento? Sus productos volverán a su precio original.",
      )
    )
      onDelete(promo.id);
  }

  return (
    <tr className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
            {promo.image ? (
              <img
                src={promo.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Tag size={15} />
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {promo.productNames.map((name, i) => (
              <Badge key={promo.products[i]} tone="neutral">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </td>
      {showInstitution && (
        <td className="px-5 py-3 text-ink-500">{promo.institutionName}</td>
      )}
      <td className="px-5 py-3">
        <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
          -{promo.discount}%
        </span>
      </td>
      <td className="px-5 py-3 text-ink-500">{promo.startDate}</td>
      <td className="px-5 py-3 text-ink-500">{promo.endDate}</td>
      <td className="px-5 py-3">
        <Badge tone={status.tone}>{status.label}</Badge>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onEdit(promo)}
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

export default function PromotionsTab({
  promotions,
  loading,
  showInstitution,
  onEdit,
  onDelete,
}) {
  const colSpan = showInstitution ? 7 : 6;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 bg-ink-50/70 border border-ink-100 text-xs text-ink-500 rounded-xl px-3.5 py-3">
        <RefreshCw size={14} className="shrink-0 mt-0.5" />
        Al llegar la fecha de vencimiento, el sistema retira el descuento y
        restaura el precio original del producto automáticamente.
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Producto</th>
                {showInstitution && (
                  <th className="px-5 py-3 font-medium">Sede</th>
                )}
                <th className="px-5 py-3 font-medium">Descuento</th>
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
                    Cargando descuentos...
                  </td>
                </tr>
              )}
              {!loading &&
                promotions.map((promo) => (
                  <PromotionRow
                    key={promo.id}
                    promo={promo}
                    showInstitution={showInstitution}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              {!loading && promotions.length === 0 && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-5 py-8 text-center text-ink-300"
                  >
                    No hay descuentos registrados.
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
