import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Template method: request() fixes the algorithm (headers → fetch → parse →
// error handling), while onError() is the step subclasses override.
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, { method = "GET", body, token } = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: this.buildHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await this.parseBody(response);
    if (!response.ok)
      return this.onError(response, data, { hadToken: !!token });
    return data;
  }

  buildHeaders(token) {
    const headers = { "Content-Type": "application/json" };
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

// Overrides the error step: a 401 on a request that carried a token means
// the session expired, not that the request itself was malformed.
class AuthAwareApiClient extends ApiClient {
  constructor(baseUrl, eventBus) {
    super(baseUrl);
    this.eventBus = eventBus;
  }

  onError(response, data, context) {
    if (response.status === 401 && context.hadToken) {
      this.eventBus.emit(SESSION_EXPIRED);
    }
    return super.onError(response, data, context);
  }
}

const defaultClient = new AuthAwareApiClient(API_BASE_URL, authEvents);

export function apiClient(endpoint, options) {
  return defaultClient.request(endpoint, options);
}
