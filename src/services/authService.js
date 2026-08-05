import { apiClient } from "./apiClient";

export async function login(email, password) {
  return apiClient("/token/", {
    method: "POST",
    body: { email, password },
  });
}
