import { RefreshCw, Tag } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import DataTable from "../../../components/ui/DataTable";
import RowIconActions from "../../../components/ui/RowIconActions";
import { PROMO_STATUS } from "../menuUtils";

function PromotionProducts({ promo }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
        {promo.image ? (
          <img src={promo.image} alt="" className="w-full h-full object-cover" />
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
  );
}

function DiscountPill({ promo }) {
  return (
    <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
      -{promo.discount}%
    </span>
  );
}

function PromotionStatus({ promo }) {
  const status = PROMO_STATUS[promo.status] ?? PROMO_STATUS.EXPIRED;
  return <Badge tone={status.tone}>{status.label}</Badge>;
}

export default function PromotionsTab({
  promotions,
  loading,
  showInstitution,
  onEdit,
  onDelete,
}) {
  function handleDelete(promo) {
    if (
      window.confirm(
        "¿Eliminar este descuento? Sus productos volverán a su precio original.",
      )
    )
      onDelete(promo.id);
  }

  const actionsFor = (promo) => (
    <RowIconActions
      label="descuento"
      onEdit={() => onEdit(promo)}
      onDelete={() => handleDelete(promo)}
    />
  );

  const columns = [
    {
      key: "products",
      header: "Producto",
      cell: (promo) => <PromotionProducts promo={promo} />,
    },
    ...(showInstitution
      ? [
          {
            key: "institution",
            header: "Sede",
            className: "text-ink-500",
            cell: (promo) => promo.institutionName,
          },
        ]
      : []),
    {
      key: "discount",
      header: "Descuento",
      cell: (promo) => <DiscountPill promo={promo} />,
    },
    {
      key: "start",
      header: "Fecha inicio",
      className: "text-ink-500",
      cell: (promo) => promo.startDate,
    },
    {
      key: "end",
      header: "Fecha vencimiento",
      className: "text-ink-500",
      cell: (promo) => promo.endDate,
    },
    {
      key: "status",
      header: "Estado",
      cell: (promo) => <PromotionStatus promo={promo} />,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (promo) => <div className="flex justify-end">{actionsFor(promo)}</div>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 bg-ink-50/70 border border-ink-100 text-xs text-ink-500 rounded-xl px-3.5 py-3">
        <RefreshCw size={14} className="shrink-0 mt-0.5" />
        Al llegar la fecha de vencimiento, el sistema retira el descuento y
        restaura el precio original del producto automáticamente.
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          rows={promotions}
          rowKey={(promo) => promo.id}
          loading={loading}
          loadingText="Cargando descuentos..."
          emptyText="No hay descuentos registrados."
          renderCard={(promo) => (
            <div className="space-y-3">
              <PromotionProducts promo={promo} />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                <DiscountPill promo={promo} />
                <span className="text-ink-500">
                  {promo.startDate} → {promo.endDate}
                </span>
                <PromotionStatus promo={promo} />
              </div>
              {showInstitution && (
                <p className="text-xs text-ink-400">{promo.institutionName}</p>
              )}
              <div className="flex justify-end">{actionsFor(promo)}</div>
            </div>
          )}
        />
      </Card>
    </div>
  );
}
