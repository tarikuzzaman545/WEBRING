import { BookingForm } from "@/components/BookingForm";
import { SiteHeader } from "@/components/SiteHeader";
import { colorToRgb, getPublicContent } from "@/lib/api";
import type { CSSProperties } from "react";

export default async function ContractPage() {
  const content = await getPublicContent();

  if (!content.settings) {
    return null;
  }

  return (
    <div
      style={
        {
          "--color-paper": colorToRgb(content.settings.colors.background, "5 5 5"),
          "--color-surface": colorToRgb(content.settings.colors.surface, "17 17 17"),
          "--color-ink": colorToRgb(content.settings.colors.text, "247 243 234"),
          "--color-muted": colorToRgb(content.settings.colors.muted, "168 162 154"),
          "--color-accent": colorToRgb(content.settings.colors.accent, "215 255 69")
        } as CSSProperties
      }
      className="min-h-screen bg-paper text-ink"
    >
      <SiteHeader settings={content.settings} />
      <main className="mx-auto grid max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8 lg:py-20">
        <section>
          <p className="mb-4 text-xs font-black uppercase text-accent">
            {content.settings.sections.booking.eyebrow}
          </p>
          <h1 className="text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl">
            {content.settings.sections.booking.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            {content.settings.sections.booking.body}
          </p>
          <div className="mt-8 rounded-card border border-white/15 bg-surface p-5 text-sm leading-7 text-muted">
            <p className="font-black uppercase text-white">{content.settings.brandName}</p>
            <p>{content.settings.contact.email}</p>
            <p>{content.settings.contact.phone}</p>
            <p>{content.settings.contact.address}</p>
          </div>
        </section>
        <BookingForm services={content.services} settings={content.settings} />
      </main>
    </div>
  );
}
