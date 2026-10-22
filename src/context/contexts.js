// Context objects live apart from their Providers (components) and hooks so
// each file has a single kind of export (react-refresh rule).
import { createContext } from "react";

export const AuthContext = createContext(null);
export const InstitutionContext = createContext(null);
export const ToastContext = createContext(null);
export const PromotionsContext = createContext(null);
