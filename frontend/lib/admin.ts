import { API_URL } from "./api";

export async function adminFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...init?.headers
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Admin request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
