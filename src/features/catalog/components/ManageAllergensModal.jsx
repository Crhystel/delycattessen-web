import Modal from "../../../components/ui/Modal";
import IngredientAllergenReview from "./IngredientAllergenReview";

export default function ManageAllergensModal({ open, onClose, catalog }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Alérgenos por ingrediente"
      width="max-w-2xl"
    >
      <p className="text-sm text-ink-500 mb-4">
        Marca qué alérgenos contiene cada ingrediente. Los productos calculan
        sus alérgenos automáticamente según los ingredientes que uses, y el
        sistema bloqueará la compra a los niños que tengan esa alergia
        registrada.
      </p>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {catalog.ingredients.map((ingredient) => (
          <IngredientAllergenReview
            key={ingredient.id}
            ingredient={ingredient}
            allergensCatalog={catalog.allergens}
            onToggleAllergen={catalog.toggleAllergen}
            onMarkNoAllergens={catalog.markNoAllergens}
          />
        ))}
      </div>
    </Modal>
  );
}
