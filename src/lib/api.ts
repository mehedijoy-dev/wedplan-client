import { authClient } from "@/lib/auth-client";

import { API_URL } from "@/lib/config";
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  // Logged in thakle JWT pathao
  const { data } = await authClient.token();
  if (data?.token) headers.set("Authorization", `Bearer ${data.token}`);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }
  return json as T;
}
