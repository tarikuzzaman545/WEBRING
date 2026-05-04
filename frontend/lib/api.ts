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

import { client } from "../sanity/lib/client";
import { urlForImage } from "../sanity/lib/image";
import { settingsQuery, servicesQuery, portfolioQuery, teamQuery, pricingQuery } from "./queries";

export async function getPublicContent(): Promise<PublicContent> {
  try {
    const [settings, services, portfolio, team, pricing] = await Promise.all([
      client.fetch(settingsQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(servicesQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(portfolioQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(teamQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(pricingQuery, {}, { next: { revalidate: 60 } })
    ]);

    // Merge Sanity data with static fallbacks where Sanity might be missing images
    return {
      settings: settings ? {
        ...STATIC_CONTENT.settings,
        brandName: settings.brandName || STATIC_CONTENT.settings.brandName,
        logoUrl: settings.logo ? urlForImage(settings.logo)?.url() : STATIC_CONTENT.settings.logoUrl,
        contact: {
          email: settings.contactEmail || STATIC_CONTENT.settings.contact.email,
          phone: settings.contactPhone || STATIC_CONTENT.settings.contact.phone,
          socials: STATIC_CONTENT.settings.contact.socials
        },
        hero: {
          ...STATIC_CONTENT.settings.hero,
          eyebrow: settings.hero?.eyebrow || STATIC_CONTENT.settings.hero.eyebrow,
          headline: settings.hero?.headline || STATIC_CONTENT.settings.hero.headline,
          subheadline: settings.hero?.subheadline || STATIC_CONTENT.settings.hero.subheadline,
          primaryCta: settings.hero?.primaryCta || STATIC_CONTENT.settings.hero.primaryCta,
          secondaryCta: settings.hero?.secondaryCta || STATIC_CONTENT.settings.hero.secondaryCta,
          imageUrl: settings.hero?.heroImage ? urlForImage(settings.hero.heroImage)?.url() : STATIC_CONTENT.settings.hero.imageUrl
        }
      } : STATIC_CONTENT.settings,
      services: services?.length > 0 ? services.map((s: any, i: number) => ({
        ...STATIC_CONTENT.services[i % STATIC_CONTENT.services.length],
        _id: s._id,
        title: s.title,
        description: s.description,
        deliverables: s.deliverables,
        sampleImageUrl: s.sampleImage ? urlForImage(s.sampleImage)?.url() : STATIC_CONTENT.services[i % STATIC_CONTENT.services.length]?.sampleImageUrl
      })) : STATIC_CONTENT.services,
      portfolio: portfolio?.length > 0 ? portfolio.map((p: any, i: number) => ({
        ...STATIC_CONTENT.portfolio[i % STATIC_CONTENT.portfolio.length],
        _id: p._id,
        title: p.title,
        category: p.category,
        clientType: p.clientType,
        description: p.description,
        featured: p.featured,
        afterImageUrl: p.afterImage ? urlForImage(p.afterImage)?.url() : STATIC_CONTENT.portfolio[i % STATIC_CONTENT.portfolio.length]?.afterImageUrl,
        beforeImageUrl: p.beforeImage ? urlForImage(p.beforeImage)?.url() : STATIC_CONTENT.portfolio[i % STATIC_CONTENT.portfolio.length]?.beforeImageUrl
      })) : STATIC_CONTENT.portfolio,
      team: team?.length > 0 ? team.map((t: any, i: number) => ({
        ...STATIC_CONTENT.team[i % STATIC_CONTENT.team.length],
        _id: t._id,
        name: t.name,
        role: t.role,
        bio: t.bio,
        socialLinks: t.socialLinks || STATIC_CONTENT.team[i % STATIC_CONTENT.team.length]?.socialLinks,
        photoUrl: t.photo ? urlForImage(t.photo)?.url() : STATIC_CONTENT.team[i % STATIC_CONTENT.team.length]?.photoUrl
      })) : STATIC_CONTENT.team,
      pricing: pricing?.length > 0 ? pricing.map((p: any, i: number) => ({
        ...STATIC_CONTENT.pricing[i % STATIC_CONTENT.pricing.length],
        _id: p._id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        billingNote: p.billingNote,
        description: p.description,
        features: p.features,
        popular: p.popular,
        ctaLabel: p.ctaLabel
      })) : STATIC_CONTENT.pricing
    };
  } catch (error) {
    console.error("Sanity fetch failed, falling back to static:", error);
    return STATIC_CONTENT;
  }
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
