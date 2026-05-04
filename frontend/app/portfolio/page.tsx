"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import type { Settings, PortfolioItem } from "@/types/content";

const CATEGORIES = ["All", "AI Photography", "Lifestyle", "E-commerce", "Branding"];

export default function PortfolioPage() {
  const settings = STATIC_CONTENT.settings as Settings;
  const portfolio = STATIC_CONTENT.portfolio;

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? portfolio
      : portfolio.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-black uppercase text-accent">Our Work</p>
            <h1 className="text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl lg:text-8xl">
              Selected Work
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted">
              Explore our diverse portfolio of engineered visuals across multiple industries.
            </p>
          </Reveal>
        </section>

        {/* Filter Tabs */}
        <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-3 text-xs font-black uppercase transition ${
                  activeCategory === category
                    ? "bg-accent text-black"
                    : "border border-white/15 text-white hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="mx-auto max-w-[1480px] px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item._id}
                  className="group cursor-pointer overflow-hidden rounded-card border border-white/15 bg-surface"
                  onClick={() => setLightboxItem(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.afterImageUrl}
                      alt={item.title}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-xs font-black uppercase text-accent">{item.category}</span>
                      <h3 className="mt-2 text-2xl font-black uppercase leading-none text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent px-4 py-20 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px] text-center">
            <h2 className="text-5xl font-black uppercase leading-[0.84] sm:text-7xl">
              Want Results Like These?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-semibold opacity-75">
              Let&apos;s discuss your product and create visuals that drive sales.
            </p>
            <a
              href="/contract"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black px-8 py-4 text-sm font-black uppercase transition hover:-translate-y-1"
            >
              Start Your Project
            </a>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
            onClick={() => setLightboxItem(null)}
          >
            <button
              className="absolute right-8 top-8 text-white transition hover:text-accent"
              onClick={() => setLightboxItem(null)}
            >
              <X size={40} strokeWidth={1} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex max-h-[85vh] max-w-5xl flex-col overflow-hidden rounded-card bg-surface md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[40vh] w-full md:h-auto md:w-3/5">
                <img
                  src={lightboxItem.afterImageUrl}
                  alt={lightboxItem.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex w-full flex-col justify-center overflow-y-auto p-8 md:w-2/5 md:p-12">
                <span className="text-xs font-black uppercase text-accent">{lightboxItem.category}</span>
                <h3 className="mt-2 text-3xl font-black uppercase leading-none text-white">
                  {lightboxItem.title}
                </h3>
                {lightboxItem.description && (
                  <p className="mt-4 text-sm leading-6 text-muted">{lightboxItem.description}</p>
                )}
                <a
                  href="/contract"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-black uppercase text-black transition hover:-translate-y-1"
                >
                  Start Similar Project
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto grid max-w-[1480px] gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <p className="font-black uppercase text-white">{settings.brandName}</p>
        <p>{settings.contact.email}</p>
      </footer>
    </div>
  );
}
