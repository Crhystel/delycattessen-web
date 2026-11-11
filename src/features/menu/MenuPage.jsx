import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Button from "../../components/ui/Button";
import PageContainer from "../../components/ui/PageContainer";
import PageToolbar from "../../components/ui/PageToolbar";
import SegmentedTabs from "../../components/ui/SegmentedTabs";
import { useInstitution } from "../../context/InstitutionContext";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useIngredientCatalog } from "../catalog/hooks/useIngredientCatalog";
import { useProducts } from "../catalog/hooks/useProducts";
import { useDishes } from "./hooks/useDishes";
import { useMonthlyMenus } from "./hooks/useMonthlyMenus";
import { useCombos } from "./hooks/useCombos";
import { sortMenusNewestFirst } from "./menuUtils";
import MonthCard from "./components/MonthCard";
import DishesTab from "./components/DishesTab";
import CombosTab from "./components/CombosTab";
import NewMonthModal from "./components/NewMonthModal";
import DishFormModal from "./components/DishFormModal";
import ComboFormModal from "./components/ComboFormModal";

const TABS = [
  { id: "monthly", label: "Menú Mensual" },
  { id: "dishes", label: "Platillos" },
  { id: "combos", label: "Promociones" },
];

// "New ..." button of each tab.
const NEW_ACTIONS = {
  monthly: { label: "Nuevo menú mensual", icon: Plus },
  dishes: { label: "Nuevo platillo", icon: UtensilsCrossed },
  combos: { label: "Nueva promoción", icon: Plus },
};

export default function MenuPage() {
  const { selectedInstitution } = useInstitution();
  const combos = useCombos();
  // Only catalog products can be part of a combo (never monthly menu dishes).
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
  const [comboModal, setComboModal] = useState(null); // { combo }

  const showInstitution = selectedInstitution === ALL_INSTITUTIONS;
  const action = NEW_ACTIONS[tab];
  const openNew = {
    monthly: () => setNewMonthModal(true),
    dishes: () => setDishModal({ dish: null }),
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

      <PageContainer>
        <PageToolbar
          start={<SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />}
          actions={
            <Button icon={action.icon} onClick={openNew[tab]}>
              {action.label}
            </Button>
          }
        />

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
        {tab === "combos" && (
          <CombosTab
            combos={combos.combos}
            loading={combos.loading}
            showInstitution={showInstitution}
            onEdit={(combo) => setComboModal({ combo })}
            onDelete={combos.removeCombo}
          />
        )}
      </PageContainer>

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
