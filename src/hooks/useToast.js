import { useContext } from "react";
import { ToastContext } from "../context/contexts";

function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Stable { success, error, warning, info } helpers; safe in effect deps.
export function useToast() {
  return useToastContext().toast;
}

// Only for ToastContainer: the list of visible toasts.
export function useToastList() {
  const { toasts, removeToast } = useToastContext();
  return { toasts, removeToast };
}
