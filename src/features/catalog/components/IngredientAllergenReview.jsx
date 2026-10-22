import { CheckCircle2, AlertTriangle } from "lucide-react";

// Inline card shown per ingredient inside the product/dish modal: forces the
// admin to explicitly confirm which allergens it has (or that it has
// none) before the product/dish can be saved. Mirrors the same toggle pattern
// used in the standalone "Gestionar alérgenos" modal, so both stay in sync
// against the same backend field (Ingredient.allergens_reviewed).
export default function IngredientAllergenReview({
  ingredient,
  allergensCatalog,
  onToggleAllergen,
  onMarkNoAllergens,
}) {
  const ingredientAllergenIds = (ingredient.allergens || []).map((a) =>
    typeof a === "object" ? a.id : a,
  );
  const isReviewed = Boolean(ingredient.allergens_reviewed);
  const hasNoAllergens = isReviewed && ingredientAllergenIds.length === 0;

  return (
    <div
      className={`border rounded-xl p-3 transition ${
        isReviewed ? "border-ink-100" : "border-danger-300 bg-danger-50/30"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-ink-900 text-sm">{ingredient.name}</p>
        {isReviewed ? (
          <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium">
            <CheckCircle2 size={13} />
            Confirmado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium">
            <AlertTriangle size={13} />
            Pendiente de revisión
          </span>
        )}
      </div>
      <p className="text-xs text-ink-400 mb-2">
        ¿Este ingrediente contiene alguno de estos alérgenos?
      </p>
      <div className="flex flex-wrap gap-2">
        {allergensCatalog.map((allergen) => {
          const checked = ingredientAllergenIds.includes(allergen.id);
          return (
            <button
              key={allergen.id}
              type="button"
              onClick={() => onToggleAllergen(ingredient, allergen.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                checked
                  ? "bg-danger-50 border-danger-500 text-danger-700 font-medium"
                  : "bg-white border-ink-200 text-ink-500 hover:border-ink-300"
              }`}
            >
              {allergen.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onMarkNoAllergens(ingredient)}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            hasNoAllergens
              ? "bg-teal-50 border-teal-500 text-teal-700 font-medium"
              : "bg-white border-ink-200 text-ink-500 hover:border-ink-300"
          }`}
        >
          Sin alérgenos conocidos
        </button>
      </div>
    </div>
  );
}
