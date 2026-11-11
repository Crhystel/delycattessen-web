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

// Defines the signed-in user's own password. The server closes the other sessions
// and answers with fresh tokens for this device ({ message, access, refresh }).
export function changePassword({ currentPassword, newPassword, confirmPassword }) {
  return apiClient("/users/change-password/", {
    method: "POST",
    body: {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
  });
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
