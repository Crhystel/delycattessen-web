import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

function DishCard({ dish, showInstitution, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-ink-100 px-3.5 py-3">
      {dish.image ? (
        <img
          src={dish.image}
          alt={dish.name}
          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-ink-100"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-ink-100 text-ink-400 flex items-center justify-center shrink-0">
          <UtensilsCrossed size={20} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-ink-900 truncate">
            {dish.name}
          </p>
          <span className="text-xs font-bold text-teal-700 shrink-0">
            ${Number(dish.price || 0).toFixed(2)}
          </span>
        </div>
        {showInstitution && dish.institutionName && (
          <Badge tone="neutral">{dish.institutionName}</Badge>
        )}
        <p className="text-xs text-ink-400 line-clamp-2 mt-0.5">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {dish.ingredients.map((ing) => (
            <span
              key={ing}
              className="text-[10px] bg-ink-50 text-ink-500 rounded-full px-2 py-0.5"
            >
              {ing}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={() => onEdit(dish)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(dish.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function DishesTab({
  dishes,
  showInstitution,
  onEdit,
  onDelete,
}) {
  return (
    <Card padded={false}>
      <div className="px-5 py-3.5 border-b border-ink-100">
        <p className="font-display font-semibold text-ink-900 text-sm">
          Platillos del Menú Mensual
        </p>
      </div>
      <div className="p-5">
        {dishes.length === 0 ? (
          <p className="text-xs text-ink-400 text-center py-4">
            No hay platillos creados todavía. Crea el primero con "Nuevo
            platillo".
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                showInstitution={showInstitution}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
