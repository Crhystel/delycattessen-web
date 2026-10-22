// Sales channels in the order the API returns them. Colors point at the theme
// tokens in index.css so charts follow the palette.
export const CHANNELS = [
  { key: "CASH", label: "Efectivo", color: "var(--color-brand-500)" },
  { key: "WALLET", label: "Saldo de billetera", color: "var(--color-teal-500)" },
  { key: "CREDIT", label: "Crédito docente", color: "var(--color-secondary-500)" },
  { key: "PREORDER", label: "Pre-órdenes", color: "var(--color-success-500)" },
];

export const CHANNEL_BY_KEY = Object.fromEntries(
  CHANNELS.map((channel) => [channel.key, channel]),
);

export const AXIS_COLOR = "var(--color-ink-500)";
export const GRID_COLOR = "var(--color-ink-100)";
