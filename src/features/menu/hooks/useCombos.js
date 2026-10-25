import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import { getCombos, createCombo, updateCombo, deleteCombo } from "../services";
import { adaptCombo } from "../menuUtils";

// Combos (fixed-price product bundles) of the selected institution plus
// save/delete actions.
export function useCombos() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();

  const fetchCombos = useCallback(
    async () => (await getCombos(selectedInstitution)).map(adaptCombo),
    [selectedInstitution],
  );
  const {
    data: combos,
    loading,
    reload,
  } = useAsyncData(fetchCombos, {
    initialData: [],
    errorTitle: "No se pudieron cargar las promociones",
  });

  // Resolves true when saved so the form can close itself. Reloads because
  // the backend recalculates the status and the regular price.
  const saveCombo = useCallback(
    async (payload, id) => {
      try {
        if (id) {
          await updateCombo(id, payload, selectedInstitution);
          toast.success(
            "Promoción actualizada",
            "Los cambios se guardaron correctamente.",
          );
        } else {
          await createCombo(payload, selectedInstitution);
          toast.success(
            "Promoción creada",
            "El combo se ofrecerá en caja durante su vigencia.",
          );
        }
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo guardar la promoción", err.message);
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  // Resolves true when deleted.
  const removeCombo = useCallback(
    async (id) => {
      try {
        await deleteCombo(id, selectedInstitution);
        toast.success(
          "Promoción eliminada",
          "El combo ya no se ofrecerá en caja.",
        );
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo eliminar la promoción", err.message);
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  return { combos, loading, saveCombo, removeCombo };
}
