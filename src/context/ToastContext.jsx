import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

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
