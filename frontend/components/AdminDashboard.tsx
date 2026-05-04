"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { ImageUp, Loader2, Lock, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { adminFetch } from "@/lib/admin";

type ResourceName = "services" | "portfolio" | "pricing" | "team";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox";
  placeholder?: string;
};

const resourceFields: Record<ResourceName, Field[]> = {
  services: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "sampleImageUrl", label: "Sample image URL" },
    { key: "sampleVideoUrl", label: "Sample video URL" },
    { key: "deliverables", label: "Deliverables", type: "textarea", placeholder: "One item per line" },
    { key: "order", label: "Order", type: "number" },
    { key: "active", label: "Active", type: "checkbox" }
  ],
  portfolio: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "beforeImageUrl", label: "Before image URL" },
    { key: "afterImageUrl", label: "After image URL" },
    { key: "order", label: "Order", type: "number" },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "active", label: "Active", type: "checkbox" }
  ],
  pricing: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "price", label: "Price", type: "number" },
    { key: "currency", label: "Currency" },
    { key: "billingNote", label: "Billing note" },
    { key: "features", label: "Features", type: "textarea", placeholder: "One item per line" },
    { key: "ctaLabel", label: "CTA label" },
    { key: "popular", label: "Popular", type: "checkbox" },
    { key: "order", label: "Order", type: "number" },
    { key: "active", label: "Active", type: "checkbox" }
  ],
  team: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "photoUrl", label: "Photo URL" },
    { key: "bio", label: "Bio", type: "textarea" },
    {
      key: "socialLinks",
      label: "Social links",
      type: "textarea",
      placeholder: "LinkedIn|https://linkedin.com/in/name"
    },
    { key: "order", label: "Order", type: "number" },
    { key: "active", label: "Active", type: "checkbox" }
  ]
};

const emptyForms: Record<ResourceName, Record<string, string | boolean>> = {
  services: { active: true, order: "0" },
  portfolio: { active: true, featured: false, order: "0" },
  pricing: { active: true, popular: false, order: "0", currency: "USD" },
  team: { active: true, order: "0" }
};

function toForm(item: Record<string, unknown>, resource: ResourceName) {
  const values: Record<string, string | boolean> = {};
  for (const field of resourceFields[resource]) {
    const value = item[field.key];
    if (Array.isArray(value)) {
      values[field.key] =
        field.key === "socialLinks"
          ? value.map((link) => `${link.label || ""}|${link.url || ""}`).join("\n")
          : value.join("\n");
    } else if (typeof value === "boolean") {
      values[field.key] = value;
    } else if (typeof value === "number") {
      values[field.key] = String(value);
    } else {
      values[field.key] = String(value || "");
    }
  }
  return values;
}

function toPayload(form: Record<string, string | boolean>, resource: ResourceName) {
  const payload: Record<string, unknown> = {};
  for (const field of resourceFields[resource]) {
    const value = form[field.key];
    if (field.type === "checkbox") {
      payload[field.key] = Boolean(value);
    } else if (field.type === "number") {
      payload[field.key] = Number(value || 0);
    } else if (field.key === "features" || field.key === "deliverables") {
      payload[field.key] = String(value || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (field.key === "socialLinks") {
      payload[field.key] = String(value || "")
        .split("\n")
        .map((line) => {
          const [label, url] = line.split("|").map((part) => part.trim());
          return label && url ? { label, url } : null;
        })
        .filter(Boolean);
    } else {
      payload[field.key] = value;
    }
  }
  return payload;
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [settingsJson, setSettingsJson] = useState("");
  const [resource, setResource] = useState<ResourceName>("services");
  const [items, setItems] = useState<Record<ResourceName, Record<string, unknown>[]>>({
    services: [],
    portfolio: [],
    pricing: [],
    team: []
  });
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyForms.services);
  const [editingId, setEditingId] = useState("");
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const activeFields = useMemo(() => resourceFields[resource], [resource]);

  useEffect(() => {
    const stored = window.localStorage.getItem("webring-admin-token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void loadAdminData(token);
    }
  }, [token]);

  async function loadAdminData(activeToken = token) {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      const [dashboard, settings, services, portfolio, pricing, team, bookingRows, messageRows] =
        await Promise.all([
          adminFetch<Record<string, number>>(activeToken, "/api/admin/dashboard"),
          adminFetch<Record<string, unknown>>(activeToken, "/api/admin/settings"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/admin/services"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/admin/portfolio"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/admin/pricing"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/admin/team"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/bookings"),
          adminFetch<Record<string, unknown>[]>(activeToken, "/api/admin/messages")
        ]);

      setStats(dashboard);
      setSettingsJson(JSON.stringify(settings, null, 2));
      setItems({ services, portfolio, pricing, team });
      setBookings(bookingRows);
      setMessages(messageRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      window.localStorage.setItem("webring-admin-token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setError("");
    setNotice("");
    try {
      const payload = JSON.parse(settingsJson);
      const updated = await adminFetch<Record<string, unknown>>(token, "/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setSettingsJson(JSON.stringify(updated, null, 2));
      setNotice("Settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settings save failed");
    }
  }

  async function saveResource() {
    setError("");
    setNotice("");
    const payload = toPayload(form, resource);
    const path = editingId ? `/api/admin/${resource}/${editingId}` : `/api/admin/${resource}`;
    const method = editingId ? "PUT" : "POST";
    try {
      await adminFetch(token, path, {
        method,
        body: JSON.stringify(payload)
      });
      setNotice(`${resource} saved`);
      setEditingId("");
      setForm(emptyForms[resource]);
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function deleteResource(id: string) {
    setError("");
    setNotice("");
    try {
      await adminFetch(token, `/api/admin/${resource}/${id}`, { method: "DELETE" });
      setNotice(`${resource} deleted`);
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function uploadAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await adminFetch<{ url: string }>(token, "/api/admin/upload", {
        method: "POST",
        body: data
      });
      setUploadedUrl(result.url);
      setNotice("Image uploaded to Cloudinary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function updateBookingStatus(id: string, status: string) {
    await adminFetch(token, `/api/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await loadAdminData();
  }

  async function updateMessageStatus(id: string, status: string) {
    await adminFetch(token, `/api/admin/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    await loadAdminData();
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-black px-4 text-white">
        <form
          className="w-full max-w-md rounded-card border border-white/15 bg-surface p-6 shadow-2xl"
          onSubmit={handleLogin}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-black">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase">Webring Admin</h1>
              <p className="text-sm text-muted">Manage the platform content and bookings.</p>
            </div>
          </div>
          <label className="mb-4 grid gap-2 text-xs font-black uppercase text-muted">
            Email
            <input
              className="admin-input"
              type="email"
              value={login.email}
              onChange={(event) => setLogin((value) => ({ ...value, email: event.target.value }))}
            />
          </label>
          <label className="mb-5 grid gap-2 text-xs font-black uppercase text-muted">
            Password
            <input
              className="admin-input"
              type="password"
              value={login.password}
              onChange={(event) => setLogin((value) => ({ ...value, password: event.target.value }))}
            />
          </label>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-black uppercase text-black"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Login
          </button>
          {error ? <p className="mt-4 rounded-card bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-accent">Webring Control Room</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-none">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-black uppercase"
              onClick={() => void loadAdminData()}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <button
              className="rounded-full border border-white/15 px-4 py-3 text-xs font-black uppercase text-muted"
              onClick={() => {
                window.localStorage.removeItem("webring-admin-token");
                setToken("");
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {error ? <p className="mb-4 rounded-card border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        {notice ? <p className="mb-4 rounded-card border border-accent/30 bg-accent/10 p-3 text-sm text-accent">{notice}</p> : null}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {Object.entries(stats).map(([key, value]) => (
            <div className="rounded-card border border-white/15 bg-surface p-4" key={key}>
              <p className="text-xs font-black uppercase text-muted">{key}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-card border border-white/15 bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase">Image Upload</h2>
              <ImageUp className="h-5 w-5 text-accent" />
            </div>
            <form className="grid gap-3" onSubmit={uploadAsset}>
              <input className="admin-input" name="folder" defaultValue="webring/admin" />
              <input className="admin-input" name="image" type="file" accept="image/*" required />
              <button className="rounded-full bg-accent px-5 py-3 text-xs font-black uppercase text-black">
                Upload to Cloudinary
              </button>
            </form>
            {uploadedUrl ? (
              <div className="mt-4 rounded-card bg-black/40 p-3">
                <img className="mb-3 aspect-video w-full rounded-card object-cover" src={uploadedUrl} alt="Uploaded asset" />
                <p className="break-all text-xs text-muted">{uploadedUrl}</p>
              </div>
            ) : null}
          </article>

          <article className="rounded-card border border-white/15 bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase">Global Settings</h2>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase text-black"
                onClick={saveSettings}
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
            <textarea
              className="admin-input min-h-[28rem] font-mono text-xs leading-5"
              value={settingsJson}
              onChange={(event) => setSettingsJson(event.target.value)}
            />
          </article>
        </section>

        <section className="mb-6 rounded-card border border-white/15 bg-surface p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(resourceFields) as ResourceName[]).map((name) => (
                <button
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase ${
                    name === resource ? "border-accent bg-accent text-black" : "border-white/15 text-muted"
                  }`}
                  key={name}
                  onClick={() => {
                    setResource(name);
                    setEditingId("");
                    setForm(emptyForms[name]);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase"
              onClick={() => {
                setEditingId("");
                setForm(emptyForms[resource]);
              }}
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="grid gap-3">
              {activeFields.map((field) => (
                <label className="grid gap-2 text-xs font-black uppercase text-muted" key={field.key}>
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      className="admin-input min-h-24"
                      placeholder={field.placeholder}
                      value={String(form[field.key] || "")}
                      onChange={(event) => setForm((value) => ({ ...value, [field.key]: event.target.value }))}
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      className="h-5 w-5 accent-[rgb(var(--color-accent))]"
                      type="checkbox"
                      checked={Boolean(form[field.key])}
                      onChange={(event) => setForm((value) => ({ ...value, [field.key]: event.target.checked }))}
                    />
                  ) : (
                    <input
                      className="admin-input"
                      type={field.type || "text"}
                      value={String(form[field.key] || "")}
                      onChange={(event) => setForm((value) => ({ ...value, [field.key]: event.target.value }))}
                    />
                  )}
                </label>
              ))}
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-xs font-black uppercase text-black"
                onClick={saveResource}
              >
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </button>
            </div>

            <div className="grid max-h-[46rem] gap-3 overflow-auto pr-2">
              {items[resource].map((item) => (
                <article className="rounded-card border border-white/15 bg-black/35 p-4" key={String(item._id)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-accent">{resource}</p>
                      <h3 className="mt-1 text-xl font-black uppercase">
                        {String(item.title || item.name || item.category)}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-full border border-white/15 px-3 py-2 text-xs font-black uppercase"
                        onClick={() => {
                          setEditingId(String(item._id));
                          setForm(toForm(item, resource));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-full border border-red-400/40 px-3 py-2 text-xs font-black uppercase text-red-200"
                        onClick={() => void deleteResource(String(item._id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-36 overflow-auto rounded-card bg-white/5 p-3 text-xs text-muted">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-card border border-white/15 bg-surface p-5">
            <h2 className="mb-4 text-xl font-black uppercase">Bookings</h2>
            <div className="grid max-h-[36rem] gap-3 overflow-auto">
              {bookings.map((booking) => (
                <div className="rounded-card border border-white/15 bg-black/35 p-4" key={String(booking._id)}>
                  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase text-accent">{String(booking.serviceTitle)}</p>
                      <h3 className="text-xl font-black uppercase">{String(booking.brandName)}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {String(booking.name)} / {String(booking.email)} / {String(booking.phone)}
                      </p>
                      <p className="text-sm text-muted">
                        {String(booking.date)} at {String(booking.timeSlot)}
                      </p>
                    </div>
                    <select
                      className="admin-input"
                      value={String(booking.status)}
                      onChange={(event) => void updateBookingStatus(String(booking._id), event.target.value)}
                    >
                      <option>pending</option>
                      <option>confirmed</option>
                      <option>in-progress</option>
                      <option>completed</option>
                      <option>cancelled</option>
                    </select>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{String(booking.projectDescription)}</p>
                  {booking.productImageUrl ? (
                    <img
                      className="mt-3 aspect-video w-full rounded-card object-cover"
                      src={String(booking.productImageUrl)}
                      alt={String(booking.brandName)}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-card border border-white/15 bg-surface p-5">
            <h2 className="mb-4 text-xl font-black uppercase">Contact Messages</h2>
            <div className="grid max-h-[36rem] gap-3 overflow-auto">
              {messages.map((message) => (
                <div className="rounded-card border border-white/15 bg-black/35 p-4" key={String(message._id)}>
                  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase text-accent">{String(message.company || "Contact")}</p>
                      <h3 className="text-xl font-black uppercase">{String(message.name)}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {String(message.email)} {message.phone ? `/ ${String(message.phone)}` : ""}
                      </p>
                    </div>
                    <select
                      className="admin-input"
                      value={String(message.status)}
                      onChange={(event) => void updateMessageStatus(String(message._id), event.target.value)}
                    >
                      <option>new</option>
                      <option>read</option>
                      <option>archived</option>
                    </select>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{String(message.message)}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {loading ? (
          <div className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-black text-black">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing
          </div>
        ) : null}
      </div>
    </main>
  );
}
