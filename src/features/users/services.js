import { apiClient } from "../../services/apiClient";
import { institutionQuery } from "../../lib/institutions";

export function getStaff(institution) {
  return apiClient(`/users/staff/${institutionQuery(institution)}`);
}

export function createStaff(data, institution) {
  return apiClient(`/users/staff/${institutionQuery(institution)}`, {
    method: "POST",
    body: data,
  });
}

export function updateStaff(id, data, institution) {
  return apiClient(`/users/staff/${id}/${institutionQuery(institution)}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteStaff(id, institution) {
  return apiClient(`/users/staff/${id}/${institutionQuery(institution)}`, {
    method: "DELETE",
  });
}
