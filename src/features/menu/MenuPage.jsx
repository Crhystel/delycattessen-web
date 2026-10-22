import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Button from "../../components/ui/Button";
import { useInstitution } from "../../context/InstitutionContext";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useIngredientCatalog } from "../catalog/hooks/useIngredientCatalog";
import { useProducts } from "../catalog/hooks/useProducts";
import { useDishes } from "./hooks/useDishes";
import { useMonthlyMenus } from "./hooks/useMonthlyMenus";
import { usePromotions } from "./hooks/usePromotions";
import { sortMenusNewestFirst } from "./menuUtils";
import MonthCard from "./components/MonthCard";
import DishesTab from "./components/DishesTab";
import PromotionsTab from "./components/PromotionsTab";
import NewMonthModal from "./components/NewMonthModal";
import DishFormModal from "./components/DishFormModal";
import PromotionFormModal from "./components/PromotionFormModal";

const TABS = [
  { id: "monthly", label: "Menú Mensual" },
  { id: "dishes", label: "Platillos" },
  { id: "promos", label: "Promociones" },
];

export default function MenuPage() {
  const { selectedInstitution } = useInstitution();
  const {
    promotions,
    loading: promotionsLoading,
    savePromotion,
    removePromotion,
  } = usePromotions();
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
  // Each modal is rendered only while its state is set.
  const [newMonthModal, setNewMonthModal] = useState(false);
  const [dishModal, setDishModal] = useState(null); // { dish }
  const [promoModal, setPromoModal] = useState(null); // { promo }

  const showInstitution = selectedInstitution === ALL_INSTITUTIONS;

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
          <div className="flex bg-white border border-ink-100 rounded-xl p-1 w-fit text-sm">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  tab === t.id
                    ? "bg-teal-500 text-white"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "monthly" && (
            <Button
              icon={Plus}
              onClick={() => setNewMonthModal(true)}
            >
              Nuevo menú mensual
            </Button>
          )}
          {tab === "dishes" && (
            <Button
              icon={UtensilsCrossed}
              onClick={() => setDishModal({ dish: null })}
            >
              Nuevo platillo
            </Button>
          )}
          {tab === "promos" && (
            <Button
              icon={Plus}
              onClick={() => setPromoModal({ promo: null })}
            >
              Nueva promoción
            </Button>
          )}
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
        {tab === "promos" && (
          <PromotionsTab
            promotions={promotions}
            loading={promotionsLoading}
            showInstitution={showInstitution}
            onEdit={(promo) => setPromoModal({ promo })}
            onDelete={removePromotion}
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
          promotions={promotions}
          products={products}
          onSave={savePromotion}
          onClose={() => setPromoModal(null)}
        />
      )}
    </>
  );
}
