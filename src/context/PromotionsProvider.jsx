import { useState, useMemo } from "react";
// TODO: mock data until the promotions API exists (see data/mockData.js).
import { promotions as initialPromotions } from "../data/mockData";
import { PromotionsContext } from "./contexts";

export default function PromotionsProvider({ children }) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const value = useMemo(() => ({ promotions, setPromotions }), [promotions]);

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  );
}
