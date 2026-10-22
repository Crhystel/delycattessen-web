import { useContext } from "react";
import { PromotionsContext } from "../context/contexts";

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx)
    throw new Error("usePromotions must be used within PromotionsProvider");
  return ctx;
}
