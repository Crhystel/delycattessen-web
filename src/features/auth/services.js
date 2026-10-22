import { apiClient } from "../../services/apiClient";

export function login(email, password) {
  return apiClient("/token/", {
    method: "POST",
    body: { username: email, password },
    auth: false,
  });
}

export function getMe() {
  return apiClient("/users/me/");
}

export function requestPasswordReset(email) {
  return apiClient("/users/password-reset/request/", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export function confirmPasswordReset(
  email,
  code,
  newPassword,
  confirmPassword,
) {
  return apiClient("/users/password-reset/confirm/", {
    method: "POST",
    body: {
      email,
      code,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
    auth: false,
  });
}
