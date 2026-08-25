import { apiClient } from "./apiClient";

export async function getAdminProducts(token) {
  return apiClient("/catalog/menu/admin/", { token });
}

export async function getIngredients(token) {
  return apiClient("/catalog/ingredients/", { token });
}

export async function createIngredient(name, token) {
  return apiClient("/catalog/ingredients/create/", {
    method: "POST",
    body: { name },
    token,
  });
}

export async function createProduct(data, token) {
  return apiClient("/catalog/menu/create/", {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateProduct(id, data, token) {
  return apiClient(`/catalog/menu/${id}/`, {
    method: "PATCH",
    body: data,
    token,
  });
}

export async function deleteProduct(id, token) {
  return apiClient(`/catalog/menu/${id}/`, {
    method: "DELETE",
    token,
  });
}
