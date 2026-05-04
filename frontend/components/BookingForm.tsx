"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, Upload } from "lucide-react";
import { API_URL, getAvailability } from "@/lib/api";
import type { AvailabilitySlot, Service, Settings } from "@/types/content";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export function BookingForm({ services, settings }: { services: Service[]; settings: Settings }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slot, setSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  const defaultService = useMemo(() => services[0], [services]);

  useEffect(() => {
    if (!date) return;

    let alive = true;
    setLoadingSlots(true);
    setSlot("");

    getAvailability(date)
      .then((data) => {
        if (alive) setSlots(data.slots);
      })
      .catch((error: Error) => {
        if (alive) {
          setSlots([]);
          setSubmitState({ status: "error", message: error.message });
        }
      })
      .finally(() => {
        if (alive) setLoadingSlots(false);
      });

    return () => {
      alive = false;
    };
  }, [date]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const selected = services.find((service) => service._id === formData.get("serviceId"));
    formData.set("serviceTitle", selected?.title || String(formData.get("serviceTitle") || ""));
    formData.set("timeSlot", slot);

    setSubmitState({ status: "submitting", message: "" });

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Booking failed");
      }

      form.reset();
      setDate("");
      setSlot("");
      setSlots([]);
      setSubmitState({
        status: "success",
        message: "Booking request sent. Webring will review your product and confirm next steps."
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "Booking failed"
      });
    }
  }

  return (
    <form
      className="grid gap-5 rounded-card border border-white/15 bg-surface p-5 shadow-2xl lg:p-7"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Name
          <input className="admin-input" name="name" required />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Email
          <input className="admin-input" name="email" type="email" required />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Phone
          <input className="admin-input" name="phone" required />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Brand name
          <input className="admin-input" name="brandName" required />
        </label>
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Product type
          <select className="admin-input" name="productType" required defaultValue="">
            <option value="" disabled>
              Select product type
            </option>
            <option>Jewelry</option>
            <option>Furniture</option>
            <option>Supplements</option>
            <option>Clothing</option>
            <option>Beauty</option>
            <option>Electronics</option>
            <option>Other</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Service
          <select className="admin-input" name="serviceId" required defaultValue={defaultService?._id}>
            {services.map((service) => (
              <option value={service._id} key={service._id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-xs font-black uppercase text-muted">
        Upload product image
        <div className="grid min-h-40 place-items-center rounded-card border border-dashed border-white/20 bg-black/35 p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-accent" />
          <input className="mt-4 w-full text-sm text-muted" name="productImage" type="file" accept="image/*" />
        </div>
      </label>

      <label className="grid gap-2 text-xs font-black uppercase text-muted">
        Project description
        <textarea className="admin-input min-h-32" name="projectDescription" required />
      </label>

      <div className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]">
        <label className="grid gap-2 text-xs font-black uppercase text-muted">
          Select date
          <span className="relative">
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            <input
              className="admin-input"
              name="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </span>
        </label>
        <div className="grid gap-2 text-xs font-black uppercase text-muted">
          Select time slot
          <div className="grid min-h-[3.2rem] gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {loadingSlots ? (
              <span className="flex items-center gap-2 text-sm normal-case text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading slots
              </span>
            ) : slots.length ? (
              slots.map((item) => (
                <button
                  className={`rounded-full border px-4 py-3 text-xs font-black uppercase transition ${
                    item.label === slot
                      ? "border-accent bg-accent text-black"
                      : "border-white/15 text-white disabled:cursor-not-allowed disabled:opacity-30"
                  }`}
                  disabled={!item.available}
                  key={item.label}
                  type="button"
                  onClick={() => setSlot(item.label)}
                >
                  {item.label}
                </button>
              ))
            ) : (
              <span className="text-sm normal-case text-muted">
                {date ? "No slots available for this date." : "Pick a date to see availability."}
              </span>
            )}
          </div>
        </div>
      </div>

      <input name="serviceTitle" type="hidden" value={defaultService?.title || ""} readOnly />

      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black uppercase text-black transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={!slot || submitState.status === "submitting"}
      >
        {submitState.status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {settings.hero.primaryCta || "Submit"}
      </button>

      {submitState.message ? (
        <p
          className={`rounded-card border px-4 py-3 text-sm font-bold ${
            submitState.status === "success"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}
