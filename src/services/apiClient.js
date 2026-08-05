const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiClient(
  endpoint,
  { method = "GET", body, token } = {},
) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || "Ocurrió un error al conectar con el servidor.",
    );
  }

  return data;
}
