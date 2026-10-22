import { apiClient } from "../../services/apiClient";

export function getInstitutions() {
  return apiClient("/users/institutions/");
}
