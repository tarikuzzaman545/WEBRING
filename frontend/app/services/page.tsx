import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import type { Settings } from "@/types/content";

export default function ServicesPage() {
  const settings = STATIC_CONTENT.settings as Settings;
  const services = STATIC_CONTENT.services;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-black uppercase text-accent">What We Do</p>
            <h1 className="mx-auto max-w-5xl text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl lg:text-8xl">
              Our Services
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted">
              Comprehensive visual engineering solutions designed to elevate your brand and maximize conversions.
            </p>
          </Reveal>
        </section>

        {/* Services Detail */}
        <section className="mx-auto max-w-[1480px] px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={index * 0.05}>
                <div className={`flex flex-col gap-8 rounded-card border border-white/15 bg-surface overflow-hidden lg:flex-row ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    {service.sampleImageUrl && (
                      <img
                        src={service.sampleImageUrl}
                        alt={service.title}
                        className="h-full w-full object-cover aspect-[4/3] lg:aspect-auto lg:min-h-[500px]"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
                    <span className="mb-4 text-xs font-black uppercase text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-4xl font-black uppercase leading-none text-white mb-4">
                      {service.title}
                    </h2>
                    <p className="text-base leading-7 text-muted mb-8">
                      {service.description}
                    </p>
                    {service.deliverables?.length ? (
                      <div className="grid gap-3 mb-8">
                        {service.deliverables.map((item) => (
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-white/80" key={item}>
                            <Check className="h-4 w-4 text-accent" />
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      href="/contract"
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black uppercase text-black transition hover:-translate-y-1"
                    >
                      Get a Quote
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="border-y border-white/10 bg-surface/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <Reveal className="mb-12 text-center">
              <p className="mb-4 text-xs font-black uppercase text-accent">How We Work</p>
              <h2 className="text-4xl font-black uppercase text-white sm:text-6xl">Our Process</h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Submit", desc: "Send us your raw product images and brand guidelines. We accept any format." },
                { step: "02", title: "Strategy", desc: "We analyze your product and create a visual strategy tailored to your target audience." },
                { step: "03", title: "Engineer", desc: "Our team combines AI tools with expert editing to transform your images." },
                { step: "04", title: "Deliver", desc: "Receive polished, platform-optimized images ready to boost your conversions." },
              ].map((item) => (
                <Reveal key={item.step}>
                  <div className="rounded-card border border-white/15 bg-black p-6">
                    <span className="text-5xl font-black text-accent/30">{item.step}</span>
                    <h3 className="mt-4 text-2xl font-black uppercase text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px] text-center">
            <h2 className="text-5xl font-black uppercase leading-[0.84] sm:text-7xl">
              Let&apos;s Create Something Amazing
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-semibold opacity-75">
              Every project starts with a conversation. Tell us about your brand.
            </p>
            <Link
              href="/contract"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black px-8 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
            >
              Start Your Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto grid max-w-[1480px] gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <p className="font-black uppercase text-white">{settings.brandName}</p>
        <p>{settings.contact.email}</p>
      </footer>
    </div>
  );
}
