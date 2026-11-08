import { tokenStore } from "./tokenStore";

// Why the panel was left without a session. Shown on the login screen.
export const SESSION_END_REASON = {
  EXPIRED: "expired",
  INACTIVITY: "inactivity",
};

const DEFAULT_IDLE_MINUTES = 60;

// VITE_IDLE_TIMEOUT_MINUTES: minutes without activity before the session is
// closed. 0 disables it; a missing or invalid value falls back to the default.
function parseIdleMinutes(raw) {
  if (raw === undefined || raw === "") return DEFAULT_IDLE_MINUTES;
  const minutes = Number(raw);
  return Number.isFinite(minutes) && minutes >= 0
    ? minutes
    : DEFAULT_IDLE_MINUTES;
}

export const IDLE_TIMEOUT_MS =
  parseIdleMinutes(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) * 60_000;

// Milliseconds left before the session counts as idle (<= 0 means idle).
// Infinity when the feature is off or there is no known activity.
export function idleRemainingMs(
  lastActivity,
  now,
  timeoutMs = IDLE_TIMEOUT_MS,
) {
  if (!timeoutMs || lastActivity == null) return Infinity;
  return timeoutMs - (now - lastActivity);
}

// True when the stored session was last used longer ago than the limit
// (e.g. the browser was closed and reopened much later).
export function isStoredSessionIdle() {
  return idleRemainingMs(tokenStore.getLastActivity(), Date.now()) <= 0;
}
