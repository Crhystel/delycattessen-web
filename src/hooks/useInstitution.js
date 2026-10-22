import { useContext } from "react";
import { InstitutionContext } from "../context/contexts";

export function useInstitution() {
  const ctx = useContext(InstitutionContext);
  if (!ctx)
    throw new Error("useInstitution must be used within InstitutionProvider");
  return ctx;
}
