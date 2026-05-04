"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Loader2, CheckCircle, Check,
  Camera, Image as ImageIcon, ShoppingBag, Video, PenTool, HelpCircle, Clock,
  ChevronLeftIcon, ChevronRightIcon,
} from "lucide-react";
import { STATIC_CONTENT } from "@/lib/staticContent";
import { SiteHeader } from "@/components/SiteHeader";
import type { Settings } from "@/types/content";

/* ───── Service Options ───── */
const SERVICE_OPTIONS = [
  { id: "AI Product Photography", icon: Camera },
  { id: "Lifestyle Photography", icon: ImageIcon },
  { id: "E-commerce Visual Package", icon: ShoppingBag },
  { id: "AI Video Content", icon: Video },
  { id: "Brand Identity", icon: PenTool },
  { id: "Not sure yet — need consultation", icon: HelpCircle },
];

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

/* ───── Mini Calendar ───── */
function MiniCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const [viewing, setViewing] = useState(new Date());
  const year = viewing.getFullYear();
  const month = viewing.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const arr: (number | null)[] = Array(first).fill(null);
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
  }, [year, month]);

  const monthName = viewing.toLocaleString("en", { month: "long", year: "numeric" });

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (d < today) return true;
    // Disable weekends (Sat=6, Sun=0) — optional
    const dow = d.getDay();
    return dow === 0 || dow === 6;
  };

  const fmt = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-black text-white">{monthName}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewing(new Date(year, month - 1))}
            className="rounded-full border border-white/15 p-1 text-muted transition hover:text-white"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => setViewing(new Date(year, month + 1))}
            className="rounded-full border border-white/15 p-1 text-muted transition hover:text-white"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-black uppercase text-muted">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
          <span key={d} className="py-2">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;
          const disabled = isDisabled(day);
          const sel = selectedDate === fmt(day);
          const isToday = new Date(year, month, day).getTime() === today.getTime();
          return (
            <button
              type="button"
              key={day}
              disabled={disabled}
              onClick={() => onSelect(fmt(day))}
              className={`rounded-full py-2 text-sm font-bold transition ${
                sel
                  ? "bg-accent text-black"
                  : disabled
                  ? "text-white/20 cursor-not-allowed"
                  : isToday
                  ? "text-accent hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───── Main Page ───── */
export default function BookPage() {
  const settings = STATIC_CONTENT.settings as Settings;
  const team = STATIC_CONTENT.team;

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState({
    productCategory: "", productCount: "", budget: "", notes: "",
  });
  const [dateTime, setDateTime] = useState({ date: "", timeSlot: "" });
  const [info, setInfo] = useState({
    name: "", email: "", whatsapp: "", company: "", referral: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleService = (id: string) => {
    if (id === "Not sure yet — need consultation") {
      setServices([id]);
      return;
    }
    let next = services.filter((s) => s !== "Not sure yet — need consultation");
    next = next.includes(id) ? next.filter((s) => s !== id) : [...next, id];
    setServices(next);
  };

  const canProceed = () => {
    if (step === 1) return services.length > 0;
    if (step === 2) return projectDetails.productCategory && projectDetails.productCount && projectDetails.budget;
    if (step === 3) return dateTime.date && dateTime.timeSlot;
    if (step === 4) return info.name.length >= 2 && /\S+@\S+\.\S+/.test(info.email);
    return false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white placeholder:text-muted outline-none transition focus:border-accent";

  const selectClass =
    "w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white outline-none transition focus:border-accent appearance-none";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader settings={settings} />

      <main className="mx-auto max-w-[1480px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Left Panel */}
          <div className="w-full lg:w-1/3">
            <p className="mb-4 text-xs font-black uppercase text-accent">Start Your Project</p>
            <h1 className="text-5xl font-black uppercase leading-[0.84] text-white sm:text-6xl">
              Book a Free Strategy Call
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              30 minutes with our team. We&apos;ll understand your product, your goals, and how WEBRING can help engineer your visual reality.
            </p>

            <div className="mt-10">
              <h3 className="mb-4 font-bold text-white">What to expect:</h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Product visual strategy session",
                  "Personalized service recommendation",
                  "Transparent pricing overview",
                  "Sample deliverable discussion",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Check size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 rounded-card border border-white/15 bg-surface p-5">
              <p className="mb-3 text-sm font-bold text-white">You&apos;ll meet with our team:</p>
              <div className="flex -space-x-3">
                {team.map((m) => (
                  <img
                    key={m._id}
                    src={m.photoUrl}
                    alt={m.name}
                    className="h-11 w-11 rounded-full border-2 border-surface object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-card border border-white/15 bg-surface p-8 md:p-10">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[500px] flex-col items-center justify-center text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-black uppercase text-white">Your Call Is Booked!</h2>
                  <p className="mt-4 max-w-md text-muted">
                    Thank you for choosing WEBRING. We&apos;ve sent a calendar invitation to your email. We look forward to speaking with you.
                  </p>
                  <Link
                    href="/"
                    className="mt-8 rounded-full bg-accent px-8 py-3 text-sm font-black uppercase text-black transition hover:-translate-y-1"
                  >
                    Return Home
                  </Link>
                </motion.div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="mb-3 flex items-center justify-between text-xs font-black uppercase text-muted">
                      <span>Step 0{step}/04</span>
                      <span>{Math.round((step / 4) * 100)}% Complete</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* STEP 1 */}
                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="mb-6 text-2xl font-black uppercase text-white">What do you need help with?</h2>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {SERVICE_OPTIONS.map((opt) => {
                            const sel = services.includes(opt.id);
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleService(opt.id)}
                                className={`flex items-center rounded-xl border p-4 text-left transition ${
                                  sel
                                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                                    : "border-white/15 bg-white/5 hover:border-accent/50"
                                }`}
                              >
                                <div className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${sel ? "bg-accent text-black" : "bg-white/10 text-muted"}`}>
                                  <Icon size={18} />
                                </div>
                                <span className={`flex-grow text-sm font-bold ${sel ? "text-white" : "text-muted"}`}>{opt.id}</span>
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${sel ? "border-accent bg-accent text-black" : "border-white/30"}`}>
                                  {sel && <Check size={12} strokeWidth={3} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="mb-6 text-2xl font-black uppercase text-white">Tell us about your project</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">Product Category</label>
                            <select value={projectDetails.productCategory} onChange={(e) => setProjectDetails({ ...projectDetails, productCategory: e.target.value })} className={selectClass}>
                              <option value="">Select category...</option>
                              <option value="Jewelry">Jewelry</option>
                              <option value="Clothing & Fashion">Clothing &amp; Fashion</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Supplements">Supplements</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Food & Beverage">Food &amp; Beverage</option>
                              <option value="Skincare & Beauty">Skincare &amp; Beauty</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">Number of Products</label>
                            <select value={projectDetails.productCount} onChange={(e) => setProjectDetails({ ...projectDetails, productCount: e.target.value })} className={selectClass}>
                              <option value="">Select count...</option>
                              <option value="1-5">1-5</option>
                              <option value="6-15">6-15</option>
                              <option value="16-30">16-30</option>
                              <option value="30+">30+</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-white">Budget Range (USD)</label>
                            <select value={projectDetails.budget} onChange={(e) => setProjectDetails({ ...projectDetails, budget: e.target.value })} className={selectClass}>
                              <option value="">Select budget...</option>
                              <option value="Under $200">Under $200</option>
                              <option value="$200-$500">$200-$500</option>
                              <option value="$500-$1500">$500-$1500</option>
                              <option value="$1500+">$1500+</option>
                              <option value="Flexible">Flexible</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-white">Additional Notes (Optional)</label>
                            <textarea
                              value={projectDetails.notes}
                              onChange={(e) => setProjectDetails({ ...projectDetails, notes: e.target.value })}
                              rows={4}
                              placeholder="Tell us about your project, brand, or any specific vision you have..."
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="mb-6 text-2xl font-black uppercase text-white">Pick a Date &amp; Time</h2>
                        <div className="flex flex-col gap-8 md:flex-row">
                          {/* Calendar */}
                          <div className="w-full rounded-xl border border-white/15 bg-white/5 p-4 md:w-1/2">
                            <MiniCalendar selectedDate={dateTime.date} onSelect={(d) => setDateTime({ ...dateTime, date: d, timeSlot: "" })} />
                          </div>
                          {/* Time Slots */}
                          <div className="w-full md:w-1/2">
                            <div className="mb-4 flex items-center gap-2 font-bold text-white">
                              <Clock size={18} className="text-accent" />
                              <span>Select Time (GMT+6)</span>
                            </div>
                            {!dateTime.date ? (
                              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-muted">
                                Please select a date first to view available times.
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                {TIME_SLOTS.map((time) => (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => setDateTime({ ...dateTime, timeSlot: time })}
                                    className={`rounded-xl border py-3 text-sm font-bold transition ${
                                      dateTime.timeSlot === time
                                        ? "border-accent bg-accent text-black"
                                        : "border-white/15 text-white hover:border-accent"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                      <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="mb-6 text-2xl font-black uppercase text-white">Your Information</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">Full Name *</label>
                            <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} className={inputClass} placeholder="John Doe" />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">Email Address *</label>
                            <input value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} type="email" className={inputClass} placeholder="you@brand.com" />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">WhatsApp Number</label>
                            <input value={info.whatsapp} onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })} type="tel" className={inputClass} placeholder="+880..." />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold text-white">Company / Brand Name</label>
                            <input value={info.company} onChange={(e) => setInfo({ ...info, company: e.target.value })} className={inputClass} placeholder="Your Brand" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-bold text-white">How did you find us?</label>
                            <select value={info.referral} onChange={(e) => setInfo({ ...info, referral: e.target.value })} className={selectClass}>
                              <option value="">Select option...</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Facebook">Facebook</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Google Search">Google Search</option>
                              <option value="Referral">Referral</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                    {step > 1 ? (
                      <button type="button" onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 text-sm font-bold text-muted transition hover:text-white">
                        <ChevronLeft size={20} /> Back
                      </button>
                    ) : (
                      <div />
                    )}
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={() => canProceed() && setStep((s) => s + 1)}
                        disabled={!canProceed()}
                        className="flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-black uppercase text-black transition hover:-translate-y-1 disabled:opacity-40"
                      >
                        Continue <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canProceed()}
                        className="flex items-center gap-2 rounded-full bg-accent px-10 py-3 text-sm font-black uppercase text-black transition hover:-translate-y-1 disabled:opacity-40"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Confirm Booking"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto grid max-w-[1480px] gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <p className="font-black uppercase text-white">{settings.brandName}</p>
        <p>{settings.contact.email}</p>
      </footer>
    </div>
  );
}
