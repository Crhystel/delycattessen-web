import { useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  Send,
  Undo2,
  Mail,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { monthStats } from "../menuUtils";
import MonthlyCalendar from "./MonthlyCalendar";
import DayEditPanel from "./DayEditPanel";

function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-white text-teal-600 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900 leading-tight">{value}</p>
        <p className="text-[11px] text-ink-500 truncate">{label}</p>
      </div>
    </div>
  );
}

export default function MonthCard({
  menu,
  dishes,
  notified,
  showInstitution,
  onToggleDish,
  onPublish,
  onUnpublish,
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  const stats = monthStats(menu);
  const percentage =
    stats.totalDays > 0
      ? Math.round((stats.configuredDays / stats.totalDays) * 100)
      : 0;
  const dayDishes = selectedDate ? menu.days[selectedDate] || [] : [];
  const dayPreorders = selectedDate
    ? (menu.preorders || {})[selectedDate] || 0
    : 0;
  const isPublished = menu.status === "Publicado";

  return (
    <Card padded={false}>
      <div className="px-5 py-3.5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <CalendarDays size={16} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900 text-sm">
              {menu.month}
            </p>
            {menu.publicationDate && (
              <p className="text-[11px] text-ink-400">
                Publicado el {menu.publicationDate}
              </p>
            )}
          </div>
          <Badge tone={isPublished ? "success" : "neutral"}>{menu.status}</Badge>
          {showInstitution && menu.institutionName && (
            <Badge tone="neutral">{menu.institutionName}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isPublished ? (
            <Button
              icon={Undo2}
              variant="outline"
              onClick={onUnpublish}
              disabled={menu.totalPreorders > 0}
              title={
                menu.totalPreorders > 0
                  ? "No se puede pasar a borrador: el menú ya tiene preórdenes."
                  : undefined
              }
            >
              Pasar a borrador
            </Button>
          ) : (
            <Button icon={Send} onClick={onPublish}>
              Publicar menú
            </Button>
          )}
        </div>
      </div>

      {notified && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 bg-success-50 text-success-600 text-xs font-medium rounded-xl px-3.5 py-3">
          <Mail size={15} className="shrink-0" />
          Notificación enviada por correo a los padres de familia de la
          institución.
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
            <span>Progreso del mes</span>
            <span className="font-semibold text-ink-700">
              {percentage}% planificado
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <StatChip
            icon={CalendarCheck}
            label="Días configurados"
            value={`${stats.configuredDays}/${stats.totalDays}`}
          />
          <StatChip
            icon={UtensilsCrossed}
            label="Platos registrados"
            value={stats.registeredDishes}
          />
          <StatChip
            icon={ClipboardList}
            label="Preórdenes del mes"
            value={stats.totalPreorders}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-[400px] shrink-0">
            <MonthlyCalendar
              year={menu.year}
              monthIndex={menu.monthIndex}
              daysMap={menu.days}
              preordersMap={menu.preorders}
              onEditDay={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <DayEditPanel
                date={selectedDate}
                dishes={dishes}
                dayDishes={dayDishes}
                dayPreorders={dayPreorders}
                onToggleDish={(dishId) => onToggleDish(selectedDate, dishId)}
                onClose={() => setSelectedDate(null)}
              />
            ) : (
              <div className="h-full min-h-[180px] flex items-center justify-center rounded-xl border border-dashed border-ink-200 text-xs text-ink-400 text-center px-6">
                Selecciona un día del calendario para ver y editar sus platos
                y bebidas.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
