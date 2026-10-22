import { apiClient } from "../../services/apiClient";
import { institutionQuery } from "../../lib/institutions";

function buildDishFormData(data) {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.price !== undefined) formData.append("price", data.price);
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach((id) => formData.append("ingredients", id));
  }
  if (data.imageFile) formData.append("image", data.imageFile);
  return formData;
}

const dishesUrl = (institution) =>
  `/catalog/dishes/${institutionQuery(institution)}`;
const dishUrl = (id, institution) =>
  `/catalog/dishes/${id}/${institutionQuery(institution)}`;
const menusUrl = (institution) =>
  `/catalog/monthly_menus/${institutionQuery(institution)}`;
const menuActionUrl = (menuId, action, institution) =>
  `/catalog/monthly_menus/${menuId}/${action}/${institutionQuery(institution)}`;

export function getDishes(institution) {
  return apiClient(dishesUrl(institution));
}

export function createDish(data, institution) {
  return apiClient(dishesUrl(institution), {
    method: "POST",
    body: buildDishFormData(data),
    isFormData: true,
  });
}

export function updateDish(id, data, institution) {
  return apiClient(dishUrl(id, institution), {
    method: "PATCH",
    body: buildDishFormData(data),
    isFormData: true,
  });
}

export function deleteDish(id, institution) {
  return apiClient(dishUrl(id, institution), { method: "DELETE" });
}

export function getMonthlyMenus(institution) {
  return apiClient(menusUrl(institution));
}

export function createMonthlyMenu({ year, month }, institution) {
  return apiClient(menusUrl(institution), {
    method: "POST",
    body: { year, month },
  });
}

export function updateMenuDay(menuId, date, dishIds, institution) {
  return apiClient(menuActionUrl(menuId, `days/${date}`, institution), {
    method: "PUT",
    body: { dish_ids: dishIds },
  });
}

export function publishMonthlyMenu(menuId, institution) {
  return apiClient(menuActionUrl(menuId, "publish", institution), {
    method: "POST",
  });
}

export function unpublishMonthlyMenu(menuId, institution) {
  return apiClient(menuActionUrl(menuId, "unpublish", institution), {
    method: "POST",
  });
}
