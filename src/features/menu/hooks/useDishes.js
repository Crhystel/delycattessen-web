import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../hooks/useInstitution";
import { useToast } from "../../../hooks/useToast";
import { getDishes, createDish, updateDish, deleteDish } from "../services";
import { adaptDish } from "../menuUtils";

// Monthly-menu dishes of the selected institution plus save/delete actions.
export function useDishes() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();

  const fetchDishes = useCallback(
    async () => (await getDishes(selectedInstitution)).map(adaptDish),
    [selectedInstitution],
  );
  const {
    data: dishes,
    setData: setDishes,
    loading,
  } = useAsyncData(fetchDishes, {
    initialData: [],
    errorTitle: "Error al cargar platillos",
  });

  // Resolves true when saved so the form can close itself.
  const saveDish = useCallback(
    async (payload, id) => {
      try {
        if (id) {
          const updated = adaptDish(
            await updateDish(id, payload, selectedInstitution),
          );
          setDishes((prev) => prev.map((d) => (d.id === id ? updated : d)));
          toast.success(
            "Platillo actualizado",
            "El platillo se ha modificado exitosamente.",
          );
        } else {
          const created = adaptDish(
            await createDish(payload, selectedInstitution),
          );
          setDishes((prev) => [...prev, created]);
          toast.success(
            "Platillo creado",
            "El nuevo platillo ha sido agregado al catálogo.",
          );
        }
        return true;
      } catch (err) {
        toast.error("Error al guardar platillo", err.message);
        return false;
      }
    },
    [selectedInstitution, setDishes, toast],
  );

  // Resolves true when deleted.
  const removeDish = useCallback(
    async (id) => {
      try {
        await deleteDish(id, selectedInstitution);
        setDishes((prev) => prev.filter((d) => d.id !== id));
        toast.success(
          "Platillo eliminado",
          "El platillo ha sido eliminado exitosamente.",
        );
        return true;
      } catch (err) {
        toast.error("No se pudo eliminar el platillo", err.message);
        return false;
      }
    },
    [selectedInstitution, setDishes, toast],
  );

  return { dishes, loading, saveDish, removeDish };
}
