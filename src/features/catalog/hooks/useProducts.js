import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../hooks/useInstitution";
import { useToast } from "../../../hooks/useToast";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services";

// Products of the selected institution plus the save/delete actions.
export function useProducts() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();

  const fetchProducts = useCallback(
    () => getAdminProducts(selectedInstitution),
    [selectedInstitution],
  );
  const {
    data: products,
    loading,
    reload,
  } = useAsyncData(fetchProducts, {
    initialData: [],
    errorTitle: "No se pudo cargar el catálogo",
  });

  // Resolves true when saved so the form can close itself.
  const saveProduct = useCallback(
    async (payload, id) => {
      try {
        if (id) {
          await updateProduct(id, payload, selectedInstitution);
          toast.success(
            "Producto actualizado",
            "Los cambios se guardaron correctamente.",
          );
        } else {
          await createProduct(payload, selectedInstitution);
          toast.success(
            "Producto creado",
            "El producto se agregó al catálogo.",
          );
        }
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo guardar", err.message);
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  const removeProduct = useCallback(
    async (id) => {
      try {
        await deleteProduct(id, selectedInstitution);
        toast.success(
          "Producto eliminado",
          "Se quitó del catálogo correctamente.",
        );
        reload();
      } catch (err) {
        toast.error("No se pudo eliminar", err.message);
      }
    },
    [selectedInstitution, reload, toast],
  );

  return { products, loading, saveProduct, removeProduct };
}
