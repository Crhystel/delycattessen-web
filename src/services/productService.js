import { apiClient } from "./apiClient";

function buildFormData(data) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  data.ingredients.forEach((id) => formData.append("ingredients", id));
  if (data.imageFile) formData.append("image", data.imageFile);
  return formData;
}

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
    body: buildFormData(data),
    token,
    isFormData: true,
  });
}

export async function updateProduct(id, data, token) {
  return apiClient(`/catalog/menu/${id}/`, {
    method: "PATCH",
    body: buildFormData(data),
    token,
    isFormData: true,
  });
}

export async function deleteProduct(id, token) {
  return apiClient(`/catalog/menu/${id}/`, { method: "DELETE", token });
}
