import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastList } from "../../context/ToastContext";

const STYLES = {
  success: {
    bg: "bg-success-50",
    border: "border-success-500",
    icon: "text-success-700",
    title: "text-success-700",
    IconComponent: CheckCircle2,
  },
  error: {
    bg: "bg-danger-50",
    border: "border-danger-500",
    icon: "text-danger-700",
    title: "text-danger-700",
    IconComponent: XCircle,
  },
  warning: {
    bg: "bg-warning-50",
    border: "border-warning-500",
    icon: "text-warning-700",
    title: "text-warning-700",
    IconComponent: AlertTriangle,
  },
  info: {
    bg: "bg-teal-50",
    border: "border-teal-500",
    icon: "text-teal-700",
    title: "text-teal-700",
    IconComponent: Info,
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastList();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => {
        const style = STYLES[t.type] || STYLES.info;
        const Icon = style.IconComponent;
        return (
          <div
            key={t.id}
            className={`${style.bg} border-l-4 ${style.border} rounded-lg shadow-lg p-4 flex gap-3 items-start animate-in slide-in-from-right`}
          >
            <Icon size={20} className={`${style.icon} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className={`text-sm font-semibold ${style.title}`}>
                  {t.title}
                </p>
              )}
              {t.message && (
                <p className="text-sm text-ink-700 mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-400 hover:text-ink-600 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
