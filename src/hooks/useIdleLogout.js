import { useEffect } from "react";
import { IDLE_TIMEOUT_MS, idleRemainingMs } from "../lib/idleSession";
import { tokenStore } from "../lib/tokenStore";

// Capture phase so scrolling inside nested containers is seen too.
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];
const THROTTLE_MS = 1000;

// Calls `onIdle` once after the user stops interacting for `timeoutMs`.
// The last activity is also written to the token store, so activity in any
// open tab keeps every tab alive. Timers freeze while the tab is hidden or
// the computer sleeps, so the elapsed time is always recomputed from clock
// timestamps instead of trusting the timer alone.
export function useIdleLogout({
  enabled,
  onIdle,
  timeoutMs = IDLE_TIMEOUT_MS,
}) {
  useEffect(() => {
    if (!enabled || !timeoutMs) return undefined;

    let timer;
    let fired = false;
    // In-memory copy so idle detection still works if storage is unavailable.
    let localLast = Date.now();
    tokenStore.touchActivity(localLast);

    const remaining = () => {
      const last = Math.max(localLast, tokenStore.getLastActivity() ?? 0);
      return idleRemainingMs(last, Date.now(), timeoutMs);
    };

    const expire = () => {
      if (fired) return;
      fired = true;
      onIdle();
    };

    const check = () => {
      clearTimeout(timer);
      const left = remaining();
      if (left <= 0) expire();
      else timer = setTimeout(check, left);
    };

    const onActivity = () => {
      const now = Date.now();
      if (now - localLast < THROTTLE_MS) return;
      // Activity right after a long gap (sleep) must not revive the session.
      if (remaining() <= 0) {
        expire();
        return;
      }
      localLast = now;
      tokenStore.touchActivity(now);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };

    ACTIVITY_EVENTS.forEach((name) =>
      window.addEventListener(name, onActivity, {
        passive: true,
        capture: true,
      }),
    );
    document.addEventListener("visibilitychange", onVisibility);
    check();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((name) =>
        window.removeEventListener(name, onActivity, { capture: true }),
      );
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, onIdle, timeoutMs]);
}
