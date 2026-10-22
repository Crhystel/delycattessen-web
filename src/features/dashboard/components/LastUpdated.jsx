import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const TICK_MS = 10000;

function ago(lastUpdated, now) {
  const seconds = Math.max(0, Math.round((now - lastUpdated) / 1000));
  if (seconds < 10) return "justo ahora";
  if (seconds < 60) return `hace ${seconds} s`;
  return `hace ${Math.floor(seconds / 60)} min`;
}

// "Actualizado hace X" plus a manual refresh button.
export default function LastUpdated({ lastUpdated, onRefresh }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-ink-500">
      <span className="w-2 h-2 rounded-full bg-success-500" />
      <span>
        {lastUpdated
          ? `Actualizado ${ago(lastUpdated, now)}`
          : "Cargando métricas..."}
      </span>
      <button
        type="button"
        onClick={onRefresh}
        aria-label="Actualizar ahora"
        className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-50"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}
