import { apiClient } from "./apiClient";

function institutionQuery(institutionParam) {
  return institutionParam ? `?institution=${institutionParam}` : "";
}

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

export async function getAdminProducts(token, institutionParam) {
  return apiClient(`/catalog/menu/admin/${institutionQuery(institutionParam)}`, { token });
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

export async function createProduct(data, token, institutionParam) {
  return apiClient(`/catalog/menu/create/${institutionQuery(institutionParam)}`, {
    method: "POST",
    body: buildFormData(data),
    token,
    isFormData: true,
  });
}

export async function updateProduct(id, data, token, institutionParam) {
  return apiClient(`/catalog/menu/${id}/${institutionQuery(institutionParam)}`, {
    method: "PATCH",
    body: buildFormData(data),
    token,
    isFormData: true,
  });
}

export async function deleteProduct(id, token, institutionParam) {
  return apiClient(`/catalog/menu/${id}/${institutionQuery(institutionParam)}`, {
    method: "DELETE",
    token,
  });
}

export async function getAllergens(token) {
  return apiClient("/catalog/allergens/", { token });
}

export async function updateIngredient(id, data, token) {
  return apiClient(`/catalog/ingredients/${id}/`, {
    method: "PATCH",
    body: data,
    token,
  });
}
