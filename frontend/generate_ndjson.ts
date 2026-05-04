import { STATIC_CONTENT } from "./lib/staticContent";
import fs from "fs";
import crypto from "crypto";

const ndjson: any[] = [];

// 1. Settings
ndjson.push({
  _id: "siteSettings",
  _type: "settings",
  brandName: STATIC_CONTENT.settings.brandName,
  contactEmail: STATIC_CONTENT.settings.contact.email,
  contactPhone: STATIC_CONTENT.settings.contact.phone,
  hero: {
    _type: "object",
    eyebrow: STATIC_CONTENT.settings.hero.eyebrow,
    headline: STATIC_CONTENT.settings.hero.headline,
    subheadline: STATIC_CONTENT.settings.hero.subheadline,
    primaryCta: STATIC_CONTENT.settings.hero.primaryCta,
    secondaryCta: STATIC_CONTENT.settings.hero.secondaryCta,
  }
});

// 2. Services
STATIC_CONTENT.services.forEach((s) => {
  ndjson.push({
    _id: `service-${s._id}`,
    _type: "service",
    title: s.title,
    description: s.description,
    deliverables: s.deliverables,
  });
});

// 3. Portfolio
STATIC_CONTENT.portfolio.forEach((p) => {
  ndjson.push({
    _id: `portfolio-${p._id}`,
    _type: "portfolio",
    title: p.title,
    category: p.category,
    clientType: p.clientType,
    description: p.description,
    featured: p.featured || false,
  });
});

// 4. Team
STATIC_CONTENT.team.forEach((t) => {
  ndjson.push({
    _id: `team-${t._id}`,
    _type: "team",
    name: t.name,
    role: t.role,
    bio: t.bio,
    socialLinks: t.socialLinks?.map(s => ({
      _key: crypto.randomUUID(),
      label: s.label,
      url: s.url
    }))
  });
});

// 5. Pricing
STATIC_CONTENT.pricing.forEach((p) => {
  ndjson.push({
    _id: `pricing-${p._id}`,
    _type: "pricing",
    name: p.name,
    price: p.price,
    currency: p.currency,
    billingNote: p.billingNote,
    description: p.description,
    features: p.features,
    popular: p.popular,
    ctaLabel: p.ctaLabel,
  });
});

const content = ndjson.map(doc => JSON.stringify(doc)).join("\n");
fs.writeFileSync("data.ndjson", content);
console.log("data.ndjson generated successfully.");
