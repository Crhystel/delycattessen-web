import { Pencil, Trash2, RefreshCw } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { isImageSource } from "../../../lib/images";
import { calculatePromoStatus } from "../../../lib/promoRules";

function PromotionRow({ promo, products, onEdit, onDelete }) {
  const status = calculatePromoStatus(promo);
  const applicable = promo.products
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <tr className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
            {isImageSource(promo.image) ? (
              <img
                src={promo.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg">{promo.image}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {applicable.map((p) => (
              <Badge key={p.id} tone="neutral">
                {p.image} {p.name}
              </Badge>
            ))}
            {applicable.length === 0 && (
              <span className="text-ink-300">—</span>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
          -{promo.discount}%
        </span>
      </td>
      <td className="px-5 py-3 text-ink-500">{promo.startDate}</td>
      <td className="px-5 py-3 text-ink-500">{promo.endDate}</td>
      <td className="px-5 py-3">
        <Badge tone={status === "Activa" ? "success" : "neutral"}>
          {status}
        </Badge>
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
            onClick={() => onDelete(promo.id)}
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
  products,
  onEdit,
  onDelete,
}) {
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
                <th className="px-5 py-3 font-medium">Descuento</th>
                <th className="px-5 py-3 font-medium">Fecha inicio</th>
                <th className="px-5 py-3 font-medium">Fecha vencimiento</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <PromotionRow
                  key={promo.id}
                  promo={promo}
                  products={products}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {promotions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
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
