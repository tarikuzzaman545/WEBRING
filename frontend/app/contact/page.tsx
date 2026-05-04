"use client";

import { useState } from "react";
import { Mail, MessageCircle, MapPin, Loader2, CheckCircle } from "lucide-react";
import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import type { Settings } from "@/types/content";

export default function ContactPage() {
  const settings = STATIC_CONTENT.settings as Settings;

  const [form, setForm] = useState({ name: "", email: "", subject: "", service: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email is required";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.service) errs.service = "Please select a service";
    if (form.message.length < 10) errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSuccess(true);
    setForm({ name: "", email: "", subject: "", service: "", message: "" });
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const inputClass =
    "w-full rounded-card border border-white/15 bg-white/5 p-4 text-white placeholder:text-muted outline-none transition focus:border-accent";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main>
        <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">

            {/* Left Panel - Info */}
            <div className="w-full lg:w-5/12">
              <Reveal>
                <p className="mb-4 text-xs font-black uppercase text-accent">Get in Touch</p>
                <h1 className="text-5xl font-black uppercase leading-[0.84] text-white sm:text-7xl">
                  Let&apos;s Build Together.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-8 text-muted">
                  Have a project in mind or just want to say hi? We&apos;d love to hear from you. Our team typically responds within 24 hours.
                </p>
              </Reveal>

              <div className="mt-10 flex flex-col gap-6">
                <Reveal delay={0.05}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted">Email</p>
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="text-lg font-bold text-white transition hover:text-accent"
                      >
                        {settings.contact.email}
                      </a>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted">WhatsApp</p>
                      <p className="text-lg font-bold text-white">{settings.contact.phone}</p>
                      <p className="text-sm text-muted">Available Mon-Fri, 10am-6pm (GMT+6)</p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-muted">Location</p>
                      <p className="text-lg font-bold text-white">Dhaka, Bangladesh</p>
                      <p className="text-sm text-muted">Available for projects worldwide</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="mt-10">
                <p className="mb-4 text-xs font-black uppercase text-muted">Follow Us</p>
                <div className="flex gap-3">
                  {settings.contact.socials &&
                    Object.entries(settings.contact.socials).map(([name, url]) => (
                      <a
                        key={name}
                        href={url}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-black uppercase text-white transition hover:border-accent hover:text-accent"
                      >
                        {name.charAt(0).toUpperCase()}
                      </a>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-7/12">
              <Reveal delay={0.1}>
                <div className="rounded-card border border-white/15 bg-surface p-8 md:p-12">
                  {isSuccess ? (
                    <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <CheckCircle size={40} />
                      </div>
                      <h2 className="text-3xl font-black uppercase text-white">Message Sent!</h2>
                      <p className="mt-4 max-w-sm text-muted">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-white">Name *</label>
                          <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            placeholder="Your name"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-white">Email *</label>
                          <input
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            type="email"
                            className={inputClass}
                            placeholder="you@brand.com"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-white">Subject *</label>
                          <input
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className={inputClass}
                            placeholder="Project inquiry"
                          />
                          {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-white">Service Interest *</label>
                          <select
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className={`${inputClass} appearance-none`}
                          >
                            <option value="">Select a service</option>
                            <option value="AI Product Photography">AI Product Photography</option>
                            <option value="Lifestyle Photography">Lifestyle Photography</option>
                            <option value="E-commerce Visual Package">E-commerce Visual Package</option>
                            <option value="AI Video Content">AI Video Content</option>
                            <option value="Brand Identity">Brand Identity</option>
                            <option value="General Inquiry">General Inquiry</option>
                          </select>
                          {errors.service && <p className="mt-1 text-sm text-red-400">{errors.service}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-white">Message *</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={6}
                          className={`${inputClass} resize-none`}
                          placeholder="Tell us about your project..."
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black uppercase text-black transition hover:-translate-y-1 disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
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
