import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { formatChange } from "../dashboardUtils";

// Percentage change against the previous period. `change` is null when the
// previous period had nothing to compare with.
export default function ChangeBadge({ change, compact = false }) {
  if (change === null || change === undefined) {
    return (
      <span className="text-xs text-ink-300">
        {compact ? "Sin comparativa" : "Sin periodo anterior para comparar"}
      </span>
    );
  }
  const tone = change > 0 ? "success" : change < 0 ? "danger" : "neutral";
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge tone={tone}>
        <Icon size={12} />
        {formatChange(change)}
      </Badge>
      {!compact && (
        <span className="text-xs text-ink-300">vs periodo anterior</span>
      )}
    </span>
  );
}
