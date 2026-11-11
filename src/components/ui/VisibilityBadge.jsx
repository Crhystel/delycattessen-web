import { EyeOff } from "lucide-react";
import Badge from "./Badge";

// Whether an item (product, combo) is offered; without stock it is hidden.
export default function VisibilityBadge({ visible }) {
  if (visible) return <Badge tone="success">Visible</Badge>;
  return (
    <Badge tone="danger">
      <EyeOff size={11} />
      Oculto · sin stock
    </Badge>
  );
}
