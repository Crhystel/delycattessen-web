import { apiClient } from "./apiClient";

export async function getStaff(token, institutionParam) {
  const query = institutionParam ? `?institution=${institutionParam}` : "";
  return apiClient(`/users/staff/${query}`, { token });
}

export async function createStaff(token, data) {
  return apiClient("/users/staff/", { method: "POST", body: data, token });
}

export async function updateStaff(token, id, data) {
  return apiClient(`/users/staff/${id}/`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteStaff(token, id) {
  return apiClient(`/users/staff/${id}/`, { method: "DELETE", token });
}
