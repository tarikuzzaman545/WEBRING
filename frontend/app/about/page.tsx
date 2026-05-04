import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import type { Settings } from "@/types/content";

export default function AboutPage() {
  const settings = STATIC_CONTENT.settings as Settings;
  const team = STATIC_CONTENT.team;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-black uppercase text-accent">Who We Are</p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl lg:text-8xl">
              We Are WEBRING
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
              A premium design studio based in Bangladesh, combining AI technology with human creative expertise to deliver world-class product visuals for e-commerce brands globally.
            </p>
          </Reveal>
        </section>

        {/* Philosophy */}
        <section className="border-y border-white/10 bg-surface/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <Reveal>
              <div className="rounded-card border border-white/15 bg-black p-8 lg:p-12">
                <p className="text-xs font-black uppercase text-accent mb-6">Our Philosophy</p>
                <p className="text-3xl font-black uppercase leading-tight text-white lg:text-4xl">
                  &ldquo;We take a raw product image and engineer it into a visual that sells — combining AI precision with human artistry.&rdquo;
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-accent px-4 py-16 text-black sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1480px] grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { value: "200+", label: "Brands Served" },
              { value: "5,000+", label: "Images Delivered" },
              { value: "3", label: "Creative Minds" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat) => (
              <Reveal key={stat.label}>
                <div className="text-center">
                  <p className="text-5xl font-black lg:text-6xl">{stat.value}</p>
                  <p className="mt-2 text-sm font-black uppercase opacity-70">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mb-12">
            <p className="mb-4 text-xs font-black uppercase text-accent">The Team</p>
            <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl">
              The Minds Behind WEBRING
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Reveal key={member._id}>
                <article className="overflow-hidden rounded-card border border-white/15 bg-surface">
                  <img
                    className="aspect-[4/5] w-full object-cover object-top max-h-[400px] sm:max-h-[500px]"
                    src={member.photoUrl}
                    alt={member.name}
                  />
                  <div className="p-6">
                    <p className="text-xs font-black uppercase text-accent">{member.role}</p>
                    <h3 className="mt-2 text-3xl font-black uppercase leading-none text-white">
                      {member.name}
                    </h3>
                    {member.bio && (
                      <p className="mt-4 text-sm leading-6 text-muted">{member.bio}</p>
                    )}
                    {member.socialLinks?.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {member.socialLinks.map((link) => (
                          <a
                            href={link.url}
                            className="rounded-full border border-white/15 px-3 py-2 text-xs font-black uppercase text-white transition hover:border-accent hover:text-accent"
                            key={link.url}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="overflow-hidden border-y border-white/10 bg-white text-black">
          <div className="masked-fade flex w-max animate-[ticker_28s_linear_infinite]">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex">
                {["Photoshop", "Midjourney", "Gemini AI", "Firefly", "After Effects", "Figma", "ComfyUI", "Lightroom"].map((tool) => (
                  <span key={`${tool}-${i}`} className="border-r border-black/10 px-8 py-5 text-2xl font-black uppercase sm:text-3xl">
                    {tool}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px] text-center">
            <h2 className="text-5xl font-black uppercase leading-[0.84] sm:text-7xl">
              Ready To Work Together?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-semibold opacity-75">
              Book a free 30-minute strategy call and let&apos;s discuss how we can transform your product visuals.
            </p>
            <a
              href="/contract"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black px-8 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
            >
              Book a Call
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto grid max-w-[1480px] gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <p className="font-black uppercase text-white">{settings.brandName}</p>
        <p>{settings.contact.email} {settings.contact.phone ? `/ ${settings.contact.phone}` : ""}</p>
      </footer>
    </div>
  );
}
