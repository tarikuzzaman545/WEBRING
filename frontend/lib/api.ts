import type { AvailabilitySlot, PublicContent } from "@/types/content";
import { STATIC_CONTENT } from "./staticContent";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error("No API URL configured");
  }
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

export async function getPublicContent(): Promise<PublicContent> {
  // Try fetching from backend API first
  if (API_URL) {
    try {
      return await apiFetch<PublicContent>("/api/public/content", { cache: "no-store" });
    } catch (error) {
      console.warn("Backend unavailable, using static content");
    }
  }
  // Fallback to static content — website works without backend
  return STATIC_CONTENT;
}

export async function getAvailability(date: string) {
  if (API_URL) {
    try {
      return await apiFetch<{ date: string; slots: AvailabilitySlot[] }>(
        `/api/bookings/availability?date=${encodeURIComponent(date)}`,
        { cache: "no-store" }
      );
    } catch (error) {
      console.warn("Backend unavailable for availability");
    }
  }
  return {
    date,
    slots: [
      { start: "10:00", end: "11:00", label: "10:00 AM", available: true },
      { start: "11:00", end: "12:00", label: "11:00 AM", available: true },
      { start: "14:00", end: "15:00", label: "2:00 PM", available: true },
      { start: "15:00", end: "16:00", label: "3:00 PM", available: true },
      { start: "16:00", end: "17:00", label: "4:00 PM", available: true },
    ],
  };
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
