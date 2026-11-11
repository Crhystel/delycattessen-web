import { Package } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import DataTable from "../../../components/ui/DataTable";
import RowIconActions from "../../../components/ui/RowIconActions";
import { PROMO_STATUS } from "../menuUtils";

function ComboInfo({ combo }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-14 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 overflow-hidden">
        {combo.image ? (
          <img src={combo.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <Package size={15} />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-ink-900">{combo.name}</p>
        <p className="text-xs text-ink-400">
          {combo.items.map((item) => `${item.quantity}× ${item.name}`).join(" + ")}
        </p>
      </div>
    </div>
  );
}

function ComboPrice({ combo }) {
  return (
    <span>
      <span className="text-ink-300 line-through text-xs mr-1.5">
        ${combo.regularPrice.toFixed(2)}
      </span>
      <span className="text-teal-700 font-semibold">
        ${combo.price.toFixed(2)}
      </span>
    </span>
  );
}

function ComboStatus({ combo }) {
  const status = PROMO_STATUS[combo.status] ?? PROMO_STATUS.EXPIRED;
  return <Badge tone={status.tone}>{status.label}</Badge>;
}

export default function CombosTab({
  combos,
  loading,
  showInstitution,
  onEdit,
  onDelete,
}) {
  function handleDelete(combo) {
    if (
      window.confirm(
        `¿Eliminar la promoción "${combo.name}"? Dejará de ofrecerse en caja.`,
      )
    )
      onDelete(combo.id);
  }

  const actionsFor = (combo) => (
    <RowIconActions
      label="promoción"
      onEdit={() => onEdit(combo)}
      onDelete={() => handleDelete(combo)}
    />
  );

  const columns = [
    {
      key: "combo",
      header: "Combo",
      cell: (combo) => <ComboInfo combo={combo} />,
    },
    ...(showInstitution
      ? [
          {
            key: "institution",
            header: "Sede",
            className: "text-ink-500",
            cell: (combo) => combo.institutionName,
          },
        ]
      : []),
    {
      key: "price",
      header: "Precio",
      cell: (combo) => <ComboPrice combo={combo} />,
    },
    {
      key: "start",
      header: "Fecha inicio",
      className: "text-ink-500",
      cell: (combo) => combo.startDate,
    },
    {
      key: "end",
      header: "Fecha vencimiento",
      className: "text-ink-500",
      cell: (combo) => combo.endDate,
    },
    {
      key: "status",
      header: "Estado",
      cell: (combo) => <ComboStatus combo={combo} />,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (combo) => <div className="flex justify-end">{actionsFor(combo)}</div>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 bg-ink-50/70 border border-ink-100 text-xs text-ink-500 rounded-xl px-3.5 py-3">
        <Package size={14} className="shrink-0 mt-0.5" />
        Un combo agrupa varios productos a un precio fijo. Mientras está
        vigente se muestra como banner en la app y el cajero lo agrega al
        carrito con un toque.
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          rows={combos}
          rowKey={(combo) => combo.id}
          loading={loading}
          loadingText="Cargando promociones..."
          emptyText="No hay promociones registradas."
          renderCard={(combo) => (
            <div className="space-y-3">
              <ComboInfo combo={combo} />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                <ComboPrice combo={combo} />
                <span className="text-ink-500">
                  {combo.startDate} → {combo.endDate}
                </span>
                <ComboStatus combo={combo} />
              </div>
              {showInstitution && (
                <p className="text-xs text-ink-400">{combo.institutionName}</p>
              )}
              <div className="flex justify-end">{actionsFor(combo)}</div>
            </div>
          )}
        />
      </Card>
    </div>
  );
}
