import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useInstitution } from "../../../context/InstitutionContext";
import { useToast } from "../../../context/ToastContext";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../services";
import { fullName } from "../staffForm";

// Staff of the selected institution plus the account actions. Actions toast
// their own outcome; the ones with a form return { error } so it can show the
// message inline.
export function useStaff() {
  const toast = useToast();
  const { selectedInstitution } = useInstitution();

  const fetchStaff = useCallback(
    () => getStaff(selectedInstitution),
    [selectedInstitution],
  );
  const {
    data: staff,
    loading,
    error,
    reload,
  } = useAsyncData(fetchStaff, { initialData: [] });

  const createMember = useCallback(
    async (form, role) => {
      try {
        const data = await createStaff({ ...form, role }, selectedInstitution);
        toast.success(
          "Cuenta creada",
          `${fullName(form)} fue registrado correctamente.`,
        );
        reload();
        return {
          credentials: { email: data.email, password: data.temporary_password },
        };
      } catch (err) {
        const message = err.message || "No se pudo crear la cuenta.";
        toast.error("No se pudo crear la cuenta", message);
        return { error: message };
      }
    },
    [selectedInstitution, reload, toast],
  );

  const updateMember = useCallback(
    async (id, form) => {
      try {
        await updateStaff(id, form, selectedInstitution);
        toast.success(
          "Cambios guardados",
          `Se actualizó la información de ${fullName(form)}.`,
        );
        reload();
        return {};
      } catch (err) {
        const message = err.message || "No se pudo guardar los cambios.";
        toast.error("No se pudo guardar", message);
        return { error: message };
      }
    },
    [selectedInstitution, reload, toast],
  );

  const toggleStatus = useCallback(
    async (member) => {
      const nextActive = !member.is_active;
      try {
        await updateStaff(
          member.id,
          { is_active: nextActive },
          selectedInstitution,
        );
        toast.success(
          nextActive ? "Cuenta activada" : "Cuenta desactivada",
          `${fullName(member)} ahora está ${nextActive ? "activo" : "inactivo"}.`,
        );
        reload();
      } catch (err) {
        toast.error(
          "No se pudo actualizar el estado",
          err.message || "Intenta de nuevo.",
        );
      }
    },
    [selectedInstitution, reload, toast],
  );

  // Resolves true when deleted so the confirmation can close.
  const removeMember = useCallback(
    async (member) => {
      try {
        await deleteStaff(member.id, selectedInstitution);
        toast.success(
          "Personal eliminado",
          `${fullName(member)} se eliminó correctamente.`,
        );
        reload();
        return true;
      } catch (err) {
        toast.error("No se pudo eliminar", err.message || "Intenta de nuevo.");
        return false;
      }
    },
    [selectedInstitution, reload, toast],
  );

  return {
    staff,
    loading,
    loadError: error
      ? "No se pudo cargar el personal. Intenta de nuevo."
      : "",
    createMember,
    updateMember,
    toggleStatus,
    removeMember,
  };
}
