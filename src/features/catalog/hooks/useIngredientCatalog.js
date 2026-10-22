import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useToast } from "../../../context/ToastContext";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  getAllergens,
} from "../services";

function sortByName(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function fetchSortedIngredients() {
  return sortByName((await getIngredients()) ?? []);
}

async function fetchAllergens() {
  return (await getAllergens()) ?? [];
}

const allergenIds = (ingredient) =>
  (ingredient.allergens || []).map((a) => (typeof a === "object" ? a.id : a));

// Ingredient + allergen catalog shared by every form that declares
// ingredients (products and monthly-menu dishes). The catalog does not depend
// on the selected institution, so it loads once per page.
export function useIngredientCatalog() {
  const toast = useToast();
  const { data: ingredients, setData: setIngredients } = useAsyncData(
    fetchSortedIngredients,
    {
      initialData: [],
      errorTitle: "No se pudieron cargar los ingredientes",
    },
  );
  const { data: allergens } = useAsyncData(fetchAllergens, {
    initialData: [],
    errorTitle: "No se pudieron cargar los alérgenos",
  });

  const addIngredient = useCallback(
    async (name) => {
      const exists = ingredients.some(
        (i) => i.name.toLowerCase() === name.toLowerCase(),
      );
      if (exists) return;
      try {
        const created = await createIngredient(name);
        setIngredients((prev) => sortByName([...prev, created]));
        toast.success(
          "Ingrediente agregado",
          `Se agregó "${created.name}" al catálogo.`,
        );
      } catch (err) {
        toast.error("No se pudo agregar el ingrediente", err.message);
      }
    },
    [ingredients, setIngredients, toast],
  );

  const saveAllergens = useCallback(
    async (ingredient, ids) => {
      try {
        const updated = await updateIngredient(ingredient.id, {
          allergens: ids,
        });
        setIngredients((prev) =>
          prev.map((i) => (i.id === ingredient.id ? updated : i)),
        );
      } catch (err) {
        toast.error("No se pudo actualizar", err.message);
      }
    },
    [setIngredients, toast],
  );

  const toggleAllergen = useCallback(
    (ingredient, allergenId) => {
      const current = allergenIds(ingredient);
      const next = current.includes(allergenId)
        ? current.filter((id) => id !== allergenId)
        : [...current, allergenId];
      return saveAllergens(ingredient, next);
    },
    [saveAllergens],
  );

  // Confirms the ingredient has no allergens (backend requires the review).
  const markNoAllergens = useCallback(
    (ingredient) => saveAllergens(ingredient, []),
    [saveAllergens],
  );

  // Resolves the ingredient names typed in a form against the live catalog:
  // `pending` are the ones whose allergens still need to be reviewed.
  const resolveSelection = useCallback(
    (names) => {
      const selected = names
        .map((name) =>
          ingredients.find((i) => i.name.toLowerCase() === name.toLowerCase()),
        )
        .filter(Boolean);
      return {
        selected,
        pending: selected.filter((i) => !i.allergens_reviewed),
        ids: selected.map((i) => i.id),
      };
    },
    [ingredients],
  );

  return {
    ingredients,
    allergens,
    addIngredient,
    toggleAllergen,
    markNoAllergens,
    resolveSelection,
  };
}
