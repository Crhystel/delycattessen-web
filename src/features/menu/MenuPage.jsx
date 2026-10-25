import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Button from "../../components/ui/Button";
import SegmentedTabs from "../../components/ui/SegmentedTabs";
import { useInstitution } from "../../context/InstitutionContext";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useIngredientCatalog } from "../catalog/hooks/useIngredientCatalog";
import { useProducts } from "../catalog/hooks/useProducts";
import { useDishes } from "./hooks/useDishes";
import { useMonthlyMenus } from "./hooks/useMonthlyMenus";
import { usePromotions } from "./hooks/usePromotions";
import { useCombos } from "./hooks/useCombos";
import { sortMenusNewestFirst } from "./menuUtils";
import MonthCard from "./components/MonthCard";
import DishesTab from "./components/DishesTab";
import OffersTab from "./components/OffersTab";
import NewMonthModal from "./components/NewMonthModal";
import DishFormModal from "./components/DishFormModal";
import PromotionFormModal from "./components/PromotionFormModal";
import ComboFormModal from "./components/ComboFormModal";

const TABS = [
  { id: "monthly", label: "Menú Mensual" },
  { id: "dishes", label: "Platillos" },
  { id: "offers", label: "Descuentos y Promociones" },
];

// "New ..." button of each (sub)tab.
const NEW_ACTIONS = {
  monthly: { label: "Nuevo menú mensual", icon: Plus },
  dishes: { label: "Nuevo platillo", icon: UtensilsCrossed },
  discounts: { label: "Nuevo descuento", icon: Plus },
  combos: { label: "Nueva promoción", icon: Plus },
};

export default function MenuPage() {
  const { selectedInstitution } = useInstitution();
  const discounts = usePromotions();
  const combos = useCombos();
  // Only catalog products can be promoted (never monthly menu dishes).
  const { products } = useProducts();
  const catalog = useIngredientCatalog();
  const { dishes, saveDish, removeDish } = useDishes();
  const {
    menus,
    notifiedMenuId,
    toggleDayDish,
    createMenu,
    publishMenu,
    unpublishMenu,
    removeDishFromDays,
  } = useMonthlyMenus();

  const [tab, setTab] = useState("monthly");
  const [offerTab, setOfferTab] = useState("discounts");
  // Each modal is rendered only while its state is set.
  const [newMonthModal, setNewMonthModal] = useState(false);
  const [dishModal, setDishModal] = useState(null); // { dish }
  const [promoModal, setPromoModal] = useState(null); // { promo }
  const [comboModal, setComboModal] = useState(null); // { combo }

  const showInstitution = selectedInstitution === ALL_INSTITUTIONS;
  const actionId = tab === "offers" ? offerTab : tab;
  const action = NEW_ACTIONS[actionId];
  const openNew = {
    monthly: () => setNewMonthModal(true),
    dishes: () => setDishModal({ dish: null }),
    discounts: () => setPromoModal({ promo: null }),
    combos: () => setComboModal({ combo: null }),
  };

  async function handleDeleteDish(id) {
    if (await removeDish(id)) removeDishFromDays(id);
  }

  return (
    <>
      <Topbar
        title="Menú y Promociones"
        subtitle="Planificación mensual y campañas con vigencia definida"
      />

      <main className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />

          <Button icon={action.icon} onClick={openNew[actionId]}>
            {action.label}
          </Button>
        </div>

        {tab === "monthly" && (
          <div className="space-y-5">
            {sortMenusNewestFirst(menus).map((menu) => (
              <MonthCard
                key={menu.id}
                menu={menu}
                dishes={dishes}
                notified={notifiedMenuId === menu.id}
                showInstitution={showInstitution}
                onToggleDish={(date, dishId) =>
                  toggleDayDish(menu.id, date, dishId)
                }
                onPublish={() => publishMenu(menu.id)}
                onUnpublish={() => unpublishMenu(menu.id)}
              />
            ))}
          </div>
        )}
        {tab === "dishes" && (
          <DishesTab
            dishes={dishes}
            showInstitution={showInstitution}
            onEdit={(dish) => setDishModal({ dish })}
            onDelete={handleDeleteDish}
          />
        )}
        {tab === "offers" && (
          <OffersTab
            view={offerTab}
            onViewChange={setOfferTab}
            discounts={discounts}
            combos={combos}
            showInstitution={showInstitution}
            onEditDiscount={(promo) => setPromoModal({ promo })}
            onEditCombo={(combo) => setComboModal({ combo })}
          />
        )}
      </main>

      {newMonthModal && (
        <NewMonthModal
          onCreate={createMenu}
          onClose={() => setNewMonthModal(false)}
        />
      )}
      {dishModal && (
        <DishFormModal
          dish={dishModal.dish}
          catalog={catalog}
          onSave={saveDish}
          onClose={() => setDishModal(null)}
        />
      )}
      {promoModal && (
        <PromotionFormModal
          promo={promoModal.promo}
          promotions={discounts.promotions}
          products={products}
          onSave={discounts.savePromotion}
          onClose={() => setPromoModal(null)}
        />
      )}
      {comboModal && (
        <ComboFormModal
          combo={comboModal.combo}
          products={products}
          onSave={combos.saveCombo}
          onClose={() => setComboModal(null)}
        />
      )}
    </>
  );
}
