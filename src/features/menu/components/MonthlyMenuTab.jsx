import { usePromotions } from "../../../hooks/usePromotions";
import { sortMenusNewestFirst } from "../menuUtils";
import MonthCard from "./MonthCard";

export default function MonthlyMenuTab({
  menus,
  dishes,
  notifiedMenuId,
  showInstitution,
  onToggleDish,
  onPublish,
  onUnpublish,
}) {
  const { promotions } = usePromotions();

  return (
    <div className="space-y-5">
      {sortMenusNewestFirst(menus).map((menu) => (
        <MonthCard
          key={menu.id}
          menu={menu}
          promos={promotions}
          dishes={dishes}
          notified={notifiedMenuId === menu.id}
          showInstitution={showInstitution}
          onToggleDish={(date, dishId) => onToggleDish(menu.id, date, dishId)}
          onPublish={() => onPublish(menu.id)}
          onUnpublish={() => onUnpublish(menu.id)}
        />
      ))}
    </div>
  );
}
