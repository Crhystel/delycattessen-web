import { apiClient } from "./apiClient";

export async function getIngredients(token) {
  return apiClient("/catalog/ingredients/", { token });
}

export async function createProduct(data, token) {
  return apiClient("/catalog/menu/create/", {
    method: "POST",
    body: data,
    token,
  });
}
