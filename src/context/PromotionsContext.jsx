import { createContext, useContext, useState, useMemo } from "react";
// TODO: mock data until the promotions API exists (see data/mockData.js).
import { promotions as initialPromotions } from "../data/mockData";

const PromotionsContext = createContext(null);

export function PromotionsProvider({ children }) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const value = useMemo(() => ({ promotions, setPromotions }), [promotions]);

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx)
    throw new Error("usePromotions must be used within PromotionsProvider");
  return ctx;
}
