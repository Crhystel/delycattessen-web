// Mixin: adds pub/sub capability to any base class without forcing an
// inheritance chain on consumers that don't need it.
export const EmitterMixin = (Base) =>
  class extends Base {
    #listeners = new Map();

    on(event, handler) {
      if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
      this.#listeners.get(event).add(handler);
      return () => this.off(event, handler);
    }

    off(event, handler) {
      this.#listeners.get(event)?.delete(handler);
    }

    emit(event, payload) {
      this.#listeners.get(event)?.forEach((handler) => handler(payload));
    }
  };

class EventBus extends EmitterMixin(class {}) {}

// App-wide bus so low-level modules (apiClient) can signal high-level ones
// (AuthContext) without importing each other directly.
export const authEvents = new EventBus();
export const SESSION_EXPIRED = "session-expired";
