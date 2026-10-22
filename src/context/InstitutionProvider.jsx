import { useState, useMemo } from "react";
import { getInstitutions } from "../features/institutions/services";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncData";
import { ALL_INSTITUTIONS } from "../lib/institutions";
import { InstitutionContext } from "./contexts";

export default function InstitutionProvider({ children }) {
  const { token, user } = useAuth();
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const { data, loading } = useAsyncData(getInstitutions, {
    enabled: !!token,
    initialData: [],
  });
  const institutions = useMemo(() => (token ? data : []), [token, data]);

  // The profile (already loaded by AuthProvider) carries the user's own
  // institution, so no second /users/me/ request is needed here.
  const ownInstitution = useMemo(
    () =>
      user?.institution
        ? { id: user.institution, name: user.institution_name }
        : null,
    [user],
  );

  const selectedInstitutionName =
    selectedInstitution === ALL_INSTITUTIONS
      ? "Todas las instituciones"
      : selectedInstitution === null
        ? ownInstitution?.name || "Cargando..."
        : institutions.find((i) => i.id === selectedInstitution)?.name || "";

  const value = useMemo(
    () => ({
      institutions,
      ownInstitution,
      selectedInstitution,
      setSelectedInstitution,
      selectedInstitutionName,
      loading,
    }),
    [
      institutions,
      ownInstitution,
      selectedInstitution,
      selectedInstitutionName,
      loading,
    ],
  );

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}
