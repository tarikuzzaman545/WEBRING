"use client";
import { useEffect, useState, useRef } from "react";
import { getImages, uploadImage } from "@/lib/adminApi";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ImagesPage() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState("logo");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: "success"|"error"} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUpload, setPendingUpload] = useState<{file: File, cat: string, key: string, subIdx?: number, preview: string} | null>(null);

  const fetchData = async () => {
    try { setData(await getImages()); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const triggerUpload = (cat: string, key: string, subIdx?: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) setPendingUpload({ file, cat, key, subIdx, preview: URL.createObjectURL(file) });
      };
      fileInputRef.current.click();
    }
  };

  const confirmUpload = async () => {
    if (!pendingUpload) return;
    setUploading(pendingUpload.key);
    try {
      await uploadImage(pendingUpload.file, pendingUpload.cat, pendingUpload.key, pendingUpload.subIdx);
      setToast({ msg: "✓ Image updated successfully", type: "success" });
      await fetchData();
    } catch (err: any) {
      setToast({ msg: err.message || "Upload failed", type: "error" });
    } finally {
      setUploading(null);
      setPendingUpload(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#C8A96E]" size={40} /></div>;

  const tabs = [
    { id: "logo", label: "🏷️ Logo & Brand" },
    { id: "hero", label: "🖼️ Hero Images" },
    { id: "team", label: "👥 Team Photos" },
    { id: "services", label: "🛠️ Services" },
    { id: "og", label: "🌐 OG Image" },
  ];

  const renderCard = (title: string, url: string, cat: string, key: string, subIdx?: number) => (
    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] flex flex-col">
      <div className="w-full aspect-video bg-[#0A0A0A] rounded-md mb-4 flex items-center justify-center overflow-hidden relative border border-[#2A2A2A]">
        {url ? <Image src={url} alt={title} fill className="object-cover" /> : <span className="text-[#888888] text-sm">No image</span>}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-xs text-[#888888] mb-4">Click replace to upload new</p>
      <div className="mt-auto flex gap-2">
        <button onClick={() => triggerUpload(cat, key, subIdx)} className="flex-1 bg-[#2A2A2A] hover:bg-[#333] py-2 rounded text-sm transition-colors">Replace</button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#C8A96E]">Image Manager</h1>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" />
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-md font-medium shadow-xl z-50 transition-all ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Preview Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4 text-[#C8A96E]">Confirm Upload</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-[#888888] mb-2">Current Image</p>
                <div className="aspect-video bg-[#0A0A0A] rounded border border-[#2A2A2A] flex items-center justify-center">
                  {/* Simplification: Just show "Old" text */}
                  <span className="text-[#888888]">Old Image</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#888888] mb-2">New Image</p>
                <div className="aspect-video bg-[#0A0A0A] rounded border border-[#C8A96E] relative overflow-hidden">
                  <Image src={pendingUpload.preview} alt="New" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setPendingUpload(null)} className="px-6 py-2 rounded bg-[#2A2A2A] hover:bg-[#333]">Cancel</button>
              <button onClick={confirmUpload} disabled={!!uploading} className="px-6 py-2 rounded bg-[#C8A96E] text-black font-bold flex items-center gap-2">
                {uploading ? <><Loader2 className="animate-spin" size={16}/> Uploading...</> : "Upload Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2A2A2A] mb-8 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${tab === t.id ? "text-[#C8A96E] border-b-2 border-[#C8A96E]" : "text-[#888888] hover:text-[#F5F5F5]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-10">
        {tab === "logo" && (
          <div>
            <p className="text-[#888888] text-sm mb-6">After replacing logo, refresh the website to see changes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderCard("Main Logo (Light BG)", data.logo?.main, "logo", "main")}
              {renderCard("Dark Logo (Dark BG)", data.logo?.dark, "logo", "dark")}
              {renderCard("Favicon (32x32)", data.logo?.favicon, "logo", "favicon")}
            </div>
          </div>
        )}
        {tab === "hero" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.hero?.featured.map((url: string, i: number) => renderCard(`Featured Grid Image ${i+1}`, url, "hero", "featured", i))}
          </div>
        )}
        {tab === "team" && (
          <div>
            <p className="text-[#888888] text-sm mb-6">Recommended size: 400x400px, square format.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderCard("Shiekh Mariful", data.team?.mariful, "team", "mariful")}
              {renderCard("Many", data.team?.many, "team", "many")}
              {renderCard("Sabbir", data.team?.sabbir, "team", "sabbir")}
            </div>
          </div>
        )}
        {tab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderCard("AI Photography", data.services?.aiPhotography, "services", "aiPhotography")}
            {renderCard("Lifestyle", data.services?.lifestyle, "services", "lifestyle")}
            {renderCard("E-commerce", data.services?.ecommerce, "services", "ecommerce")}
            {renderCard("Video", data.services?.video, "services", "video")}
            {renderCard("Branding", data.services?.branding, "services", "branding")}
          </div>
        )}
        {tab === "og" && (
          <div className="max-w-xl">
            <p className="text-[#888888] text-sm mb-6">This image appears when your website is shared on social media (1200x630).</p>
            {renderCard("OG Share Image", data.og, "og", "og")}
          </div>
        )}
      </div>
    </div>
  );
}
