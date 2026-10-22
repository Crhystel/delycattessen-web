import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";
import { tokenStore } from "../lib/tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Template method: request() fixes the algorithm (headers → fetch → parse →
// error handling), while onError() is the step subclasses override.
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // The bearer token is read from the session store, never passed by callers.
  // Public endpoints (login, password reset) opt out with `auth: false`.
  async request(endpoint, options = {}) {
    const { method = "GET", body, isFormData = false, auth = true } = options;
    const token = auth ? this.getToken() : null;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: this.buildHeaders(token, isFormData),
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
    const data = await this.parseBody(response);
    if (!response.ok)
      return this.onError(response, data, {
        endpoint,
        options,
        hadToken: !!token,
      });
    return data;
  }

  getToken() {
    return tokenStore.getAccess();
  }

  buildHeaders(token, isFormData) {
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async parseBody(response) {
    return response.json().catch(() => null);
  }

  onError(response, data) {
    throw new Error(this.extractErrorMessage(data));
  }
  extractErrorMessage(data) {
    if (!data) return "Ocurrió un error al conectar con el servidor.";
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    // DRF validation errors come as { field: ["msg1", "msg2"] } or
    // { non_field_errors: ["msg"] } — surface the first one found.
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) {
      return data[firstKey][0];
    }

    return "Ocurrió un error al conectar con el servidor.";
  }
}

// Overrides the error step. A 401 on a request that carried a token means the
// access token expired: renew it with the refresh token and replay the request
// ONCE. A 401 is raised by authentication before the view runs, so nothing was
// written and replaying cannot duplicate a payment or an update. Network errors
// and 5xx are never replayed (the server may have processed them).
// Only when the refresh token is rejected is the session reported as expired.
class AuthAwareApiClient extends ApiClient {
  refreshing = null;

  constructor(baseUrl, eventBus) {
    super(baseUrl);
    this.eventBus = eventBus;
  }

  async onError(response, data, context) {
    const { endpoint, options, hadToken } = context;
    if (response.status === 401 && hadToken) {
      if (!options.retried && (await this.renewAccessToken())) {
        return this.request(endpoint, { ...options, retried: true });
      }
      this.eventBus.emit(SESSION_EXPIRED);
    }
    return super.onError(response, data, context);
  }

  // Concurrent 401s share a single renewal.
  renewAccessToken() {
    this.refreshing ??= this.requestNewAccessToken().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  // true = renewed, false = refresh token missing/rejected, throws = transient.
  async requestNewAccessToken() {
    const refresh = tokenStore.getRefresh();
    if (!refresh) return false;
    const response = await fetch(`${this.baseUrl}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (response.status >= 500) {
      throw new Error("No se pudo renovar la sesión. Intenta de nuevo.");
    }
    if (!response.ok) return false;
    const data = await response.json();
    tokenStore.setTokens({ access: data.access, refresh: data.refresh ?? refresh });
    return true;
  }
}

const defaultClient = new AuthAwareApiClient(API_BASE_URL, authEvents);

export function apiClient(endpoint, options) {
  return defaultClient.request(endpoint, options);
}
