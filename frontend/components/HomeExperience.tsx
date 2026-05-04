import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Check, Play, Sparkles } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { PortfolioGrid } from "./PortfolioGrid";
import { Reveal } from "./Reveal";
import { SiteHeader } from "./SiteHeader";
import { colorToRgb } from "@/lib/api";
import type { PublicContent, Settings } from "@/types/content";

function SectionIntro({
  eyebrow,
  title,
  body,
  tone = "light"
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  tone?: "light" | "dark";
}) {
  const headingClass = tone === "dark" ? "text-black" : "text-white";
  const bodyClass = tone === "dark" ? "text-black/65" : "text-muted";

  return (
    <Reveal className="mb-10 grid gap-5 lg:grid-cols-[1fr_0.56fr] lg:items-end">
      <div>
        {eyebrow ? <p className="mb-4 text-xs font-black uppercase text-accent">{eyebrow}</p> : null}
        {title ? (
          <h2 className={`max-w-4xl text-4xl font-black uppercase leading-[0.9] sm:text-6xl lg:text-7xl ${headingClass}`}>
            {title}
          </h2>
        ) : null}
      </div>
      {body ? <p className={`max-w-xl text-base leading-7 lg:justify-self-end ${bodyClass}`}>{body}</p> : null}
    </Reveal>
  );
}

export function HomeExperience({ content }: { content: PublicContent }) {
  const settings = content.settings as Settings;
  const featured = content.portfolio.find((item) => item.featured) || content.portfolio[0];

  return (
    <div
      style={
        {
          "--color-paper": colorToRgb(settings.colors.background, "5 5 5"),
          "--color-surface": colorToRgb(settings.colors.surface, "17 17 17"),
          "--color-ink": colorToRgb(settings.colors.text, "247 243 234"),
          "--color-muted": colorToRgb(settings.colors.muted, "168 162 154"),
          "--color-accent": colorToRgb(settings.colors.accent, "215 255 69")
        } as CSSProperties
      }
      className="min-h-screen bg-paper text-ink"
    >
      <SiteHeader settings={settings} />

      <main>
        <section className="relative mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:px-6 lg:min-h-[calc(100vh-74px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <Reveal>
            {settings.hero.eyebrow ? (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase text-accent">
                <Sparkles className="h-4 w-4" />
                {settings.hero.eyebrow}
              </p>
            ) : null}
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.78] text-white sm:text-7xl lg:text-8xl xl:text-[8.8rem]">
              {settings.hero.headline}
            </h1>
            {settings.hero.subheadline ? (
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                {settings.hero.subheadline}
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contract"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black uppercase text-black transition hover:-translate-y-1"
              >
                {settings.hero.primaryCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-black uppercase text-white transition hover:-translate-y-1 hover:border-white/40"
              >
                {settings.hero.secondaryCta}
                <Play className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="absolute -left-8 top-8 hidden rounded-full bg-accent px-4 py-3 text-xs font-black uppercase text-black lg:block">
              AI Production Pipeline
            </div>
            <div className="overflow-hidden rounded-card border border-white/15 bg-surface shadow-2xl">
              {settings.hero.imageUrl ? (
                <img
                  className="aspect-[4/5] h-full w-full object-cover lg:aspect-[5/6]"
                  src={settings.hero.imageUrl}
                  alt={settings.hero.headline || settings.brandName}
                />
              ) : null}
            </div>
          </Reveal>
        </section>

        <section className="overflow-hidden border-y border-white/10 bg-white text-black">
          <div className="masked-fade flex w-max animate-[ticker_28s_linear_infinite]">
            {[...content.services, ...content.services].map((service, index) => (
              <span
                className="border-r border-black/10 px-8 py-5 text-2xl font-black uppercase sm:text-4xl"
                key={`${service._id}-${index}`}
              >
                {service.title}
              </span>
            ))}
          </div>
        </section>

        <section id="work" className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <SectionIntro {...settings.sections.showcase} />
          {featured ? <BeforeAfterSlider item={featured} /> : null}
        </section>

        <section id="services" className="border-y border-white/10 bg-surface/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <SectionIntro {...settings.sections.services} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.services.map((service, index) => (
                <Reveal delay={index * 0.05} key={service._id}>
                  <article className="group grid min-h-[30rem] content-between overflow-hidden rounded-card border border-white/15 bg-black transition hover:-translate-y-1 hover:border-accent/60">
                    {service.sampleImageUrl ? (
                      <img
                        className="h-56 w-full object-cover opacity-80 transition group-hover:opacity-100"
                        src={service.sampleImageUrl}
                        alt={service.title}
                      />
                    ) : null}
                    <div className="p-5">
                      <span className="text-xs font-black uppercase text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-3xl font-black uppercase leading-none text-white">
                        {service.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-muted">{service.description}</p>
                      {service.deliverables?.length ? (
                        <div className="mt-5 grid gap-2">
                          {service.deliverables.map((item) => (
                            <span className="inline-flex items-center gap-2 text-xs font-bold text-white/80" key={item}>
                              <Check className="h-4 w-4 text-accent" />
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <SectionIntro {...settings.sections.portfolio} />
          <PortfolioGrid items={content.portfolio} />
        </section>

        <section id="pricing" className="border-y border-white/10 bg-white px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <SectionIntro {...settings.sections.pricing} tone="dark" />
            <div className="grid gap-4 lg:grid-cols-3">
              {content.pricing.map((plan) => (
                <article
                  className={`rounded-card border p-6 ${
                    plan.popular ? "border-black bg-accent" : "border-black/15 bg-white"
                  }`}
                  key={plan._id}
                >
                  <p className="text-xs font-black uppercase">{plan.name}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-6xl font-black leading-none">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: plan.currency,
                        maximumFractionDigits: 0
                      }).format(plan.price)}
                    </span>
                    {plan.billingNote ? <span className="pb-2 text-sm font-bold opacity-70">{plan.billingNote}</span> : null}
                  </div>
                  {plan.description ? <p className="mt-5 text-sm leading-6 opacity-70">{plan.description}</p> : null}
                  <div className="mt-8 grid gap-3">
                    {plan.features.map((feature) => (
                      <span className="flex items-center gap-2 text-sm font-bold" key={feature}>
                        <Check className="h-4 w-4" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contract"
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-black px-5 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
                  >
                    {plan.ctaLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <SectionIntro {...settings.sections.team} />
          <div className="grid gap-4 lg:grid-cols-3">
            {content.team.map((member) => (
              <article className="overflow-hidden rounded-card border border-white/15 bg-surface" key={member._id}>
                <img className="aspect-[4/5] w-full object-cover" src={member.photoUrl} alt={member.name} />
                <div className="p-5">
                  <p className="text-xs font-black uppercase text-accent">{member.role}</p>
                  <h3 className="mt-2 text-3xl font-black uppercase leading-none text-white">{member.name}</h3>
                  {member.bio ? <p className="mt-4 text-sm leading-6 text-muted">{member.bio}</p> : null}
                  {member.socialLinks?.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {member.socialLinks.map((link) => (
                        <a
                          href={link.url}
                          className="rounded-full border border-white/15 px-3 py-2 text-xs font-black uppercase text-white"
                          key={link.url}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-surface/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <SectionIntro {...settings.about} />
            <Reveal className="rounded-card border border-white/15 bg-black p-6">
              <p className="text-3xl font-black uppercase leading-tight text-white">
                {settings.about.philosophy}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-accent px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              {settings.sections.booking.eyebrow ? (
                <p className="mb-4 text-xs font-black uppercase opacity-70">{settings.sections.booking.eyebrow}</p>
              ) : null}
              <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.84] sm:text-7xl">
                {settings.sections.booking.title}
              </h2>
              {settings.sections.booking.body ? (
                <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 opacity-75">
                  {settings.sections.booking.body}
                </p>
              ) : null}
            </div>
            <Link
              href="/contract"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black px-6 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
            >
              {settings.hero.primaryCta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto grid max-w-[1480px] gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <p className="font-black uppercase text-white">{settings.brandName}</p>
        <p>
          {settings.contact.email} {settings.contact.phone ? `/ ${settings.contact.phone}` : ""}
        </p>
      </footer>
    </div>
  );
}
