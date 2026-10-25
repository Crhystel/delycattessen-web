import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../services";
import { adaptPromotion } from "../menuUtils";

// Promotions of the selected institution plus save/delete actions.
export function usePromotions() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();

  const fetchPromotions = useCallback(
    async () => (await getPromotions(selectedInstitution)).map(adaptPromotion),
    [selectedInstitution],
  );
  const {
    data: promotions,
    loading,
    reload,
  } = useAsyncData(fetchPromotions, {
    initialData: [],
    errorTitle: "No se pudieron cargar los descuentos",
  });

  // Resolves true when saved so the form can close itself. Reloads instead of
  // patching the list because the backend recalculates the status.
  const savePromotion = useCallback(
    async (payload, id) => {
      try {
        if (id) {
          await updatePromotion(id, payload, selectedInstitution);
          toast.success(
            "Descuento actualizado",
            "Los cambios se guardaron correctamente.",
          );
        } else {
          await createPromotion(payload, selectedInstitution);
          toast.success(
            "Descuento creado",
            "El descuento se aplicará a los productos durante su vigencia.",
          );
        }
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo guardar el descuento", err.message);
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  // Resolves true when deleted.
  const removePromotion = useCallback(
    async (id) => {
      try {
        await deletePromotion(id, selectedInstitution);
        toast.success(
          "Descuento eliminado",
          "Los productos vuelven a su precio original.",
        );
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo eliminar el descuento", err.message);
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  return { promotions, loading, savePromotion, removePromotion };
}
