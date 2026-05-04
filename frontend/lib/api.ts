import type { AvailabilitySlot, PublicContent } from "@/types/content";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers
    },
    next: init?.cache === "no-store" ? undefined : { revalidate: 60 }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getPublicContent() {
  return apiFetch<PublicContent>("/api/public/content", { cache: "no-store" });
}

export async function getAvailability(date: string) {
  return apiFetch<{ date: string; slots: AvailabilitySlot[] }>(
    `/api/bookings/availability?date=${encodeURIComponent(date)}`,
    { cache: "no-store" }
  );
}

export function colorToRgb(hex: string | undefined, fallback: string) {
  const value = hex || fallback;
  const clean = value.replace("#", "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const num = Number.parseInt(expanded, 16);

  if (Number.isNaN(num)) return fallback;

  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}
