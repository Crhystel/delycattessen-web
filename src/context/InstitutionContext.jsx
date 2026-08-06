import { createContext, useContext, useState, useEffect } from "react";
import { getInstitutions } from "../services/institutionService";
import { getMe } from "../services/authService";
import { useAuth } from "./AuthContext";

const InstitutionContext = createContext(null);

// Special value representing the consolidated view across all institutions
export const ALL_INSTITUTIONS = "all";

export function InstitutionProvider({ children }) {
  const { token } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [ownInstitution, setOwnInstitution] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([getInstitutions(token), getMe(token)])
      .then(([institutionsData, meData]) => {
        setInstitutions(institutionsData);
        setOwnInstitution({
          id: meData.institution,
          name: meData.institution_name,
        });
      })
      .catch(() => {
        setInstitutions([]);
        setOwnInstitution(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const selectedInstitutionName =
    selectedInstitution === ALL_INSTITUTIONS
      ? "Todas las instituciones"
      : selectedInstitution === null
        ? ownInstitution?.name || "Cargando..."
        : institutions.find((i) => i.id === selectedInstitution)?.name || "";

  return (
    <InstitutionContext.Provider
      value={{
        institutions,
        ownInstitution,
        selectedInstitution,
        setSelectedInstitution,
        selectedInstitutionName,
        loading,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const ctx = useContext(InstitutionContext);
  if (!ctx)
    throw new Error("useInstitution debe usarse dentro de InstitutionProvider");
  return ctx;
}
