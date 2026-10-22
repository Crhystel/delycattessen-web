import { apiClient } from "../../services/apiClient";
import { institutionQuery } from "../../lib/institutions";

function buildProductFormData(data) {
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

export function getAdminProducts(institution) {
  return apiClient(`/catalog/menu/admin/${institutionQuery(institution)}`);
}

export function createProduct(data, institution) {
  return apiClient(`/catalog/menu/create/${institutionQuery(institution)}`, {
    method: "POST",
    body: buildProductFormData(data),
    isFormData: true,
  });
}

export function updateProduct(id, data, institution) {
  return apiClient(`/catalog/menu/${id}/${institutionQuery(institution)}`, {
    method: "PATCH",
    body: buildProductFormData(data),
    isFormData: true,
  });
}

export function deleteProduct(id, institution) {
  return apiClient(`/catalog/menu/${id}/${institutionQuery(institution)}`, {
    method: "DELETE",
  });
}

export function getIngredients() {
  return apiClient("/catalog/ingredients/");
}

export function createIngredient(name) {
  return apiClient("/catalog/ingredients/create/", {
    method: "POST",
    body: { name },
  });
}

export function updateIngredient(id, data) {
  return apiClient(`/catalog/ingredients/${id}/`, {
    method: "PATCH",
    body: data,
  });
}

export function getAllergens() {
  return apiClient("/catalog/allergens/");
}
