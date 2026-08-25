import { apiClient } from "./apiClient";

export async function getInstitutions(token) {
  return apiClient("/users/institutions/", { token });
}
