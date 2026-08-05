import { apiClient } from "./apiClient";

export async function getInstitutions(token) {
  return apiClient("/usuarios/institutions/", { token });
}
