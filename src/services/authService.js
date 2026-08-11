import { apiClient } from "./apiClient";

export async function login(email, password) {
  return apiClient("/token/", {
    method: "POST",
    body: { email, password },
  });
}

export async function getMe(token) {
  return apiClient("/usuarios/me/", { token });
}
export async function requestPasswordReset(email) {
  return apiClient("/usuarios/password-reset/request/", {
    method: "POST",
    body: { email },
  });
}
export async function confirmPasswordReset(
  email,
  code,
  newPassword,
  confirmPassword,
) {
  return apiClient("/usuarios/password-reset/confirm/", {
    method: "POST",
    body: {
      email,
      code,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
  });
}
