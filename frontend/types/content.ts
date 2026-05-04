export type Settings = {
  _id?: string;
  brandName: string;
  logoUrl?: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  hero: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primaryCta?: string;
    secondaryCta?: string;
    imageUrl?: string;
  };
  about: {
    eyebrow?: string;
    title?: string;
    body?: string;
    philosophy?: string;
  };
  sections: Record<
    "showcase" | "services" | "portfolio" | "pricing" | "team" | "booking",
    {
      eyebrow?: string;
      title?: string;
      body?: string;
    }
  >;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    socials?: Record<string, string>;
  };
  booking: {
    timezone?: string;
    availability?: Array<{
      dayOfWeek: number;
      enabled: boolean;
      slots: Array<{ start: string; end: string }>;
    }>;
  };
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  sampleImageUrl?: string;
  sampleVideoUrl?: string;
  deliverables?: string[];
  order?: number;
  active?: boolean;
};

export type PortfolioItem = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  featured?: boolean;
  order?: number;
  active?: boolean;
};

export type PricingPlan = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingNote?: string;
  features: string[];
  ctaLabel?: string;
  popular?: boolean;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio?: string;
  socialLinks?: Array<{ label: string; url: string }>;
};

export type PublicContent = {
  settings: Settings | null;
  services: Service[];
  portfolio: PortfolioItem[];
  pricing: PricingPlan[];
  team: TeamMember[];
};

export type AvailabilitySlot = {
  start: string;
  end: string;
  label: string;
  available: boolean;
};
