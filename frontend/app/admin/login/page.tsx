"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/adminApi";
import { saveToken } from "@/lib/adminAuth";

export default function Login() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(password);
      saveToken(res.token);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 text-[#F5F5F5] font-inter">
      <div className={`w-full max-w-[400px] bg-[#1A1A1A] p-8 rounded-xl border ${error ? "border-red-500 animate-shake" : "border-[#2A2A2A]"}`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cormorant font-bold text-[#C8A96E] mb-2">WEBRING</h1>
          <p className="text-[#888888] text-sm">Admin Panel</p>
        </div>
        <hr className="border-[#2A2A2A] mb-8" />
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <input type={show ? "text" : "password"} placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#2A2A2A] p-3 rounded-md text-white focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-[#888888] hover:text-white">
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#C8A96E] text-black font-bold py-3 rounded-md hover:bg-[#b0935d] transition-colors disabled:opacity-50">
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
