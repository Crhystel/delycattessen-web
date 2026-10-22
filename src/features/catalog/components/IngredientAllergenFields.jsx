import { Field } from "../../../components/ui/Field";
import IngredientsInput from "./IngredientsInput";
import IngredientAllergenReview from "./IngredientAllergenReview";

// Ingredient picker + per-ingredient allergen confirmation, shared by the
// product form and the monthly-menu dish form.
// `catalog` comes from useIngredientCatalog; `selected` from its
// resolveSelection(value).
export default function IngredientAllergenFields({
  value,
  onChange,
  error,
  catalog,
  selected,
}) {
  return (
    <>
      <Field
        label="Ingredientes (obligatorio)"
        hint="Busca en el catálogo o agrega uno nuevo. Cada ingrediente nuevo o sin confirmar deberá revisarse abajo antes de guardar."
      >
        <IngredientsInput
          value={value}
          catalog={catalog.ingredients.map((i) => i.name)}
          onChange={onChange}
          onNewIngredient={catalog.addIngredient}
        />
        {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
      </Field>

      {selected.length > 0 && (
        <Field label="Confirmación de alérgenos por ingrediente">
          <div className="space-y-3">
            {selected.map((ingredient) => (
              <IngredientAllergenReview
                key={ingredient.id}
                ingredient={ingredient}
                allergensCatalog={catalog.allergens}
                onToggleAllergen={catalog.toggleAllergen}
                onMarkNoAllergens={catalog.markNoAllergens}
              />
            ))}
          </div>
        </Field>
      )}
    </>
  );
}
