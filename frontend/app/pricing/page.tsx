"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import type { Settings } from "@/types/content";

const FAQS = [
  {
    question: "How does AI product photography work?",
    answer: "You send us your raw product images (even smartphone photos). We use a combination of AI tools like Midjourney, Stable Diffusion, and Adobe Firefly along with expert Photoshop work to transform them into studio-quality visuals. The result is indistinguishable from a professional photoshoot.",
  },
  {
    question: "What's the typical turnaround time?",
    answer: "Starter projects are delivered in 3 business days. Growth packages take 5 business days. Enterprise clients get custom timelines based on volume and project scope.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Absolutely! We're based in Bangladesh but serve brands worldwide. Everything is handled digitally — you send us files, we deliver perfection. We communicate in English and operate in GMT+6.",
  },
  {
    question: "Can I request revisions?",
    answer: "Yes! Starter includes 2 revisions, Growth includes unlimited revisions, and Enterprise clients get unlimited revisions with a dedicated project manager.",
  },
  {
    question: "What file formats do you deliver?",
    answer: "We deliver in any format you need — JPEG, PNG, WEBP, TIFF, PSD, or AI. All images are optimized for your specific platform (Amazon, Shopify, social media, etc.).",
  },
  {
    question: "Do you offer refunds?",
    answer: "We work with you until you're satisfied. If for any reason you're not happy with the results after revisions, we offer a full refund within 7 days of delivery.",
  },
];

export default function PricingPage() {
  const settings = STATIC_CONTENT.settings as Settings;
  const pricing = STATIC_CONTENT.pricing;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-black uppercase text-accent">Investment</p>
            <h1 className="mx-auto max-w-5xl text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl">
              Transparent Pricing. Premium Results.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted">
              No hidden fees. Just world-class visual engineering tailored to your brand&apos;s scale.
            </p>
          </Reveal>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-[1480px] px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {pricing.map((plan, index) => (
              <Reveal key={plan._id} delay={index * 0.08}>
                <article
                  className={`flex flex-col rounded-card border p-8 ${
                    plan.popular
                      ? "border-accent bg-accent text-black"
                      : "border-white/15 bg-surface text-white"
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-4 self-start rounded-full bg-black px-4 py-1 text-[10px] font-black uppercase text-accent">
                      Most Popular
                    </span>
                  )}
                  <p className="text-xs font-black uppercase">{plan.name}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-6xl font-black leading-none">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: plan.currency,
                        maximumFractionDigits: 0,
                      }).format(plan.price)}
                    </span>
                    {plan.billingNote && (
                      <span className="pb-2 text-sm font-bold opacity-70">{plan.billingNote}</span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="mt-5 text-sm leading-6 opacity-70">{plan.description}</p>
                  )}
                  <div className="mt-8 grid flex-1 gap-3">
                    {plan.features.map((feature) => (
                      <span className="flex items-center gap-2 text-sm font-bold" key={feature}>
                        <Check className="h-4 w-4 shrink-0" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contract"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full border px-5 py-4 text-sm font-black uppercase transition hover:-translate-y-1 ${
                      plan.popular
                        ? "border-black bg-black text-accent"
                        : "border-white/30 hover:border-accent"
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-white/10 bg-surface/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-12 text-center">
              <p className="mb-4 text-xs font-black uppercase text-accent">FAQ</p>
              <h2 className="text-4xl font-black uppercase text-white sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted">Everything you need to know about working with WEBRING.</p>
            </Reveal>

            <div className="flex flex-col gap-3">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-card border border-white/15 bg-black transition hover:border-accent/30"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="pr-4 font-bold text-white">{faq.question}</span>
                    <span className="shrink-0 text-accent">
                      {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm leading-7 text-muted">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px] text-center">
            <h2 className="text-5xl font-black uppercase leading-[0.84] sm:text-7xl">
              Ready To Get Started?
            </h2>
            <Link
              href="/contract"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black px-8 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
            >
              Book a Free Call
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
