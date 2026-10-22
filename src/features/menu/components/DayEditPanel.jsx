import { X as XIcon, UtensilsCrossed } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { formatLongDate } from "../menuUtils";

export default function DayEditPanel({
  date,
  dishes,
  dayDishes,
  dayPreorders,
  onToggleDish,
  onClose,
}) {
  const isReadOnly = dayPreorders > 0;

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="text-[11px] text-ink-400">Editando día</p>
          <p className="font-display font-semibold text-ink-900 text-sm">
            {formatLongDate(date)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 shrink-0"
        >
          <XIcon size={16} />
        </button>
      </div>

      {isReadOnly && (
        <div className="rounded-xl border border-warning-200 bg-warning-50 px-3.5 py-2.5 text-xs text-warning-800 mb-3">
          Este día ya tiene preórdenes y no se puede modificar.
        </div>
      )}

      <div className="flex items-center justify-between mb-2.5 gap-2 flex-wrap">
        <p className="text-xs text-ink-500">
          {dayDishes.length} plato{dayDishes.length !== 1 ? "s" : ""}{" "}
          seleccionado{dayDishes.length !== 1 ? "s" : ""}
        </p>
        <Badge tone={dayPreorders > 0 ? "success" : "neutral"}>
          {dayPreorders} preorden{dayPreorders !== 1 ? "es" : ""} este día
        </Badge>
      </div>

      {dishes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 text-xs text-ink-400 text-center px-4 py-6">
          Aún no hay platillos creados. Crea uno en "Platillos del Menú
          Mensual" para poder asignarlo a este día.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {dishes.map((dish) => {
            const active = dayDishes.includes(dish.id);
            return (
              <button
                key={dish.id}
                type="button"
                disabled={isReadOnly}
                onClick={() => !isReadOnly && onToggleDish(dish.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "border-teal-500 bg-teal-50"
                    : "border-ink-100 hover:bg-ink-50"
                } ${isReadOnly ? "cursor-not-allowed opacity-75" : ""}`}
              >
                {dish.image ? (
                  <img
                    src={dish.image}
                    alt=""
                    className="w-6 h-6 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-md bg-ink-100 text-ink-500 flex items-center justify-center shrink-0">
                    <UtensilsCrossed size={13} />
                  </div>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-ink-900 truncate">
                    {dish.name}
                  </span>
                </span>
                {active && (
                  <XIcon size={14} className="text-teal-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
