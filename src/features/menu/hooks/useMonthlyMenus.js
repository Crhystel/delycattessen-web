import { useCallback, useState } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import {
  getMonthlyMenus,
  createMonthlyMenu,
  updateMenuDay,
  publishMonthlyMenu,
  unpublishMonthlyMenu,
} from "../services";
import { adaptMonthlyMenu } from "../menuUtils";

const NOTIFICATION_MS = 5000;

// Monthly menus of the selected institution plus planning/publishing actions.
export function useMonthlyMenus() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();
  // Id of the menu that was just published (shows the "email sent" banner).
  const [notifiedMenuId, setNotifiedMenuId] = useState(null);

  const fetchMenus = useCallback(
    async () => (await getMonthlyMenus(selectedInstitution)).map(adaptMonthlyMenu),
    [selectedInstitution],
  );
  const {
    data: menus,
    setData: setMenus,
  } = useAsyncData(fetchMenus, {
    initialData: [],
    errorTitle: "Error al cargar menús mensuales",
  });

  const replaceMenu = useCallback(
    (updated) =>
      setMenus((prev) => prev.map((m) => (m.id === updated.id ? updated : m))),
    [setMenus],
  );

  const setDayDishes = useCallback(
    (menuId, date, dishIds) =>
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menuId
            ? { ...m, days: { ...m.days, [date]: dishIds } }
            : m,
        ),
      ),
    [setMenus],
  );

  // Toggles a dish on a day, optimistically; rolls back if the API rejects.
  const toggleDayDish = useCallback(
    async (menuId, date, dishId) => {
      const menu = menus.find((m) => m.id === menuId);
      if (!menu) return;

      if ((menu.preorders?.[date] || 0) > 0) {
        toast.warning(
          "Día bloqueado",
          "Este día ya tiene preórdenes y no se puede modificar.",
        );
        return;
      }

      const current = menu.days[date] || [];
      const next = current.includes(dishId)
        ? current.filter((id) => id !== dishId)
        : [...current, dishId];

      setDayDishes(menuId, date, next);
      try {
        await updateMenuDay(menuId, date, next, selectedInstitution);
      } catch (err) {
        setDayDishes(menuId, date, current);
        toast.error("No se pudo actualizar el día", err.message);
      }
    },
    [menus, selectedInstitution, setDayDishes, toast],
  );

  // Returns { error } with a message the "new month" form can show inline.
  const createMenu = useCallback(
    async (yearMonth) => {
      const [year, month] = yearMonth.split("-").map(Number);
      if (menus.some((m) => m.year === year && m.monthIndex === month - 1)) {
        return { error: "Ya existe un menú mensual para ese mes." };
      }
      try {
        const created = adaptMonthlyMenu(
          await createMonthlyMenu({ year, month }, selectedInstitution),
        );
        setMenus((prev) => [created, ...prev]);
        toast.success(
          "Menú creado",
          "Borrador de menú mensual creado exitosamente.",
        );
        return {};
      } catch (err) {
        return { error: err.message };
      }
    },
    [menus, selectedInstitution, setMenus, toast],
  );

  const publishMenu = useCallback(
    async (menuId) => {
      try {
        replaceMenu(
          adaptMonthlyMenu(await publishMonthlyMenu(menuId, selectedInstitution)),
        );
        setNotifiedMenuId(menuId);
        setTimeout(
          () => setNotifiedMenuId((current) => (current === menuId ? null : current)),
          NOTIFICATION_MS,
        );
        toast.success(
          "Menú publicado",
          "Notificación enviada por correo a los padres de familia de la institución.",
        );
      } catch (err) {
        toast.error("No se pudo publicar el menú", err.message);
      }
    },
    [selectedInstitution, replaceMenu, toast],
  );

  const unpublishMenu = useCallback(
    async (menuId) => {
      try {
        replaceMenu(
          adaptMonthlyMenu(
            await unpublishMonthlyMenu(menuId, selectedInstitution),
          ),
        );
        toast.success(
          "Menú en borrador",
          "El menú mensual volvió a estado borrador.",
        );
      } catch (err) {
        toast.error("No se pudo pasar a borrador", err.message);
      }
    },
    [selectedInstitution, replaceMenu, toast],
  );

  // Called after a dish is deleted so no day keeps a dangling reference.
  const removeDishFromDays = useCallback(
    (dishId) =>
      setMenus((prev) =>
        prev.map((m) => ({
          ...m,
          days: Object.fromEntries(
            Object.entries(m.days).map(([date, ids]) => [
              date,
              ids.filter((id) => id !== dishId),
            ]),
          ),
        })),
      ),
    [setMenus],
  );

  return {
    menus,
    notifiedMenuId,
    toggleDayDish,
    createMenu,
    publishMenu,
    unpublishMenu,
    removeDishFromDays,
  };
}
