import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }) {
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

  const toast = {
    success: (title, message) => showToast({ type: "success", title, message }),
    error: (title, message) => showToast({ type: "error", title, message }),
    warning: (title, message) => showToast({ type: "warning", title, message }),
    info: (title, message) => showToast({ type: "info", title, message }),
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

export function useToastList() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastList must be used within ToastProvider");
  return { toasts: ctx.toasts, removeToast: ctx.removeToast };
}
