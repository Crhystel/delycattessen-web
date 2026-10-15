import { apiClient } from "./apiClient";

function institutionQuery(institutionParam) {
  return institutionParam ? `?institution=${institutionParam}` : "";
}

export async function getStaff(token, institutionParam) {
  return apiClient(`/users/staff/${institutionQuery(institutionParam)}`, { token });
}

export async function createStaff(token, data, institutionParam) {
  return apiClient(`/users/staff/${institutionQuery(institutionParam)}`, {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateStaff(token, id, data, institutionParam) {
  return apiClient(`/users/staff/${id}/${institutionQuery(institutionParam)}`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteStaff(token, id, institutionParam) {
  return apiClient(`/users/staff/${id}/${institutionQuery(institutionParam)}`, {
    method: "DELETE",
    token,
  });
}
