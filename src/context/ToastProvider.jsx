import { useState, useCallback, useMemo } from "react";
import { ToastContext } from "./contexts";

const AUTO_DISMISS_MS = 5000;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
      return id;
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      success: (title, message) =>
        showToast({ type: "success", title, message }),
      error: (title, message) => showToast({ type: "error", title, message }),
      warning: (title, message) =>
        showToast({ type: "warning", title, message }),
      info: (title, message) => showToast({ type: "info", title, message }),
    }),
    [showToast],
  );

  const value = useMemo(
    () => ({ toast, toasts, removeToast }),
    [toast, toasts, removeToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
