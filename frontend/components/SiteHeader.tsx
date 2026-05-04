import Link from "next/link";
import type { Settings } from "@/types/content";

export function SiteHeader({ settings }: { settings: Settings }) {
  const logo = settings.logoUrl ? (
    <img className="h-10 w-auto" src={settings.logoUrl} alt={settings.brandName} />
  ) : (
    <span className="grid text-xl font-black uppercase leading-[0.8]">
      <span>{settings.brandName}</span>
      <span>Studio</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1480px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-white" aria-label={`${settings.brandName} home`}>
          {logo}
        </Link>
        <nav className="hidden justify-center gap-6 text-xs font-black uppercase text-muted md:flex">
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/services" className="transition hover:text-white">Services</Link>
          <Link href="/portfolio" className="transition hover:text-white">Portfolio</Link>
          <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
        </nav>
        <Link
          href="/contract"
          className="rounded-full border border-accent bg-accent px-4 py-3 text-xs font-black uppercase text-black transition hover:-translate-y-0.5"
        >
          {settings.hero.primaryCta || "Book a Call"}
        </Link>
      </div>
    </header>
  );
}
