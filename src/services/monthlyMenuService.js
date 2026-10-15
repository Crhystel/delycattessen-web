import { apiClient } from "./apiClient";

function institutionQuery(institutionParam) {
  return institutionParam ? `?institution=${institutionParam}` : "";
}

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

export async function getDishes(token, institutionParam) {
  return apiClient(`/catalog/dishes/${institutionQuery(institutionParam)}`, { token });
}

export async function createDish(data, token, institutionParam) {
  return apiClient(`/catalog/dishes/${institutionQuery(institutionParam)}`, {
    method: "POST",
    body: buildDishFormData(data),
    token,
    isFormData: true,
  });
}

export async function updateDish(id, data, token, institutionParam) {
  return apiClient(`/catalog/dishes/${id}/${institutionQuery(institutionParam)}`, {
    method: "PATCH",
    body: buildDishFormData(data),
    token,
    isFormData: true,
  });
}

export async function deleteDish(id, token, institutionParam) {
  return apiClient(`/catalog/dishes/${id}/${institutionQuery(institutionParam)}`, {
    method: "DELETE",
    token,
  });
}

export async function getMonthlyMenus(token, institutionParam) {
  return apiClient(`/catalog/monthly_menus/${institutionQuery(institutionParam)}`, { token });
}

export async function createMonthlyMenu({ year, month }, token, institutionParam) {
  return apiClient(`/catalog/monthly_menus/${institutionQuery(institutionParam)}`, {
    method: "POST",
    body: { year, month },
    token,
  });
}

export async function updateMenuDay(menuId, date, dishIds, token, institutionParam) {
  return apiClient(`/catalog/monthly_menus/${menuId}/days/${date}/${institutionQuery(institutionParam)}`, {
    method: "PUT",
    body: { dish_ids: dishIds },
    token,
  });
}

export async function publishMonthlyMenu(menuId, token, institutionParam) {
  return apiClient(`/catalog/monthly_menus/${menuId}/publish/${institutionQuery(institutionParam)}`, {
    method: "POST",
    token,
  });
}

export async function unpublishMonthlyMenu(menuId, token, institutionParam) {
  return apiClient(`/catalog/monthly_menus/${menuId}/unpublish/${institutionQuery(institutionParam)}`, {
    method: "POST",
    token,
  });
}
