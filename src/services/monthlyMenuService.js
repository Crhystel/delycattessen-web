import { apiClient } from "./apiClient";

function buildDishFormData(data) {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.price !== undefined) formData.append("price", data.price);
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach((id) => formData.append("ingredients", id));
  }
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }
  return formData;
}

export async function getDishes(token) {
  return apiClient("/catalog/dishes/", { token });
}

export async function createDish(data, token) {
  return apiClient("/catalog/dishes/", {
    method: "POST",
    body: buildDishFormData(data),
    token,
    isFormData: true,
  });
}

export async function updateDish(id, data, token) {
  return apiClient(`/catalog/dishes/${id}/`, {
    method: "PATCH",
    body: buildDishFormData(data),
    token,
    isFormData: true,
  });
}

export async function deleteDish(id, token) {
  return apiClient(`/catalog/dishes/${id}/`, {
    method: "DELETE",
    token,
  });
}

export async function getMonthlyMenus(token) {
  return apiClient("/catalog/monthly_menus/", { token });
}

export async function createMonthlyMenu({ year, month }, token) {
  return apiClient("/catalog/monthly_menus/", {
    method: "POST",
    body: { year, month },
    token,
  });
}

export async function updateMenuDay(menuId, date, dishIds, token) {
  return apiClient(`/catalog/monthly_menus/${menuId}/days/${date}/`, {
    method: "PUT",
    body: { dish_ids: dishIds },
    token,
  });
}

export async function publishMonthlyMenu(menuId, token) {
  return apiClient(`/catalog/monthly_menus/${menuId}/publish/`, {
    method: "POST",
    token,
  });
}

export async function unpublishMonthlyMenu(menuId, token) {
  return apiClient(`/catalog/monthly_menus/${menuId}/unpublish/`, {
    method: "POST",
    token,
  });
}
