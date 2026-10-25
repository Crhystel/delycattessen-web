import SegmentedTabs from "../../../components/ui/SegmentedTabs";
import PromotionsTab from "./PromotionsTab";
import CombosTab from "./CombosTab";

// "Descuentos y Promociones": discounts (Promotion in the API) and
// promotions as fixed-price combos.
const OFFER_TABS = [
  { id: "discounts", label: "Descuentos" },
  { id: "combos", label: "Promociones (combos)" },
];

export default function OffersTab({
  view,
  onViewChange,
  discounts,
  combos,
  showInstitution,
  onEditDiscount,
  onEditCombo,
}) {
  return (
    <div className="space-y-4">
      <SegmentedTabs tabs={OFFER_TABS} value={view} onChange={onViewChange} />
      {view === "discounts" ? (
        <PromotionsTab
          promotions={discounts.promotions}
          loading={discounts.loading}
          showInstitution={showInstitution}
          onEdit={onEditDiscount}
          onDelete={discounts.removePromotion}
        />
      ) : (
        <CombosTab
          combos={combos.combos}
          loading={combos.loading}
          showInstitution={showInstitution}
          onEdit={onEditCombo}
          onDelete={combos.removeCombo}
        />
      )}
    </div>
  );
}
