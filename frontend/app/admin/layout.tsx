"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, FolderOpen, FileText, Users, DollarSign, Calendar, BookOpen, MessageSquare, Settings, LogOut, Bell } from "lucide-react";
import { isAuthenticated, logout } from "@/lib/adminAuth";
import { getMessages } from "@/lib/adminApi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated() && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setLoading(false);
      if (pathname !== "/admin/login") {
        getMessages().then(data => setUnread(data.messages.filter((m: any) => !m.read).length)).catch(() => {});
      }
    }
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#C8A96E]">Loading...</div>;
  if (pathname === "/admin/login") return <>{children}</>;

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Image Manager", href: "/admin/images", icon: ImageIcon, highlight: true },
    { name: "Portfolio", href: "/admin/portfolio", icon: FolderOpen },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: "Booking Dates", href: "/admin/dates", icon: Calendar },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: unread },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-inter flex">
      {/* Sidebar */}
      <aside className="fixed w-[240px] h-full bg-[#111111] border-r border-[#2A2A2A] flex flex-col z-20">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h1 className="text-2xl font-cormorant font-bold text-[#C8A96E]">WEBRING</h1>
          <p className="text-xs text-[#888888] mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`flex items-center justify-between px-6 py-3 transition-colors ${pathname === l.href ? "bg-[#1A1A1A] border-r-2 border-[#C8A96E] text-[#C8A96E]" : "text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"} ${l.highlight && pathname !== l.href ? "text-blue-400" : ""}`}>
              <div className="flex items-center gap-3">
                <l.icon size={18} />
                <span className="text-sm font-medium">{l.name}</span>
              </div>
              {l.badge !== undefined && l.badge > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{l.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-[#2A2A2A]">
          <button onClick={() => { logout(); router.push("/admin/login"); }} className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors text-sm font-medium w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[240px] flex-1 flex flex-col h-screen">
        <header className="h-[60px] bg-[#111111] border-b border-[#2A2A2A] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <h2 className="text-lg font-medium">{links.find(l => l.href === pathname)?.name || "Dashboard"}</h2>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#888888] font-mono">{new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka" })} GMT+6</span>
            <div className="relative cursor-pointer text-[#888888] hover:text-white transition-colors">
              <Bell size={20} />
              {unread > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111111]"></div>}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C8A96E] flex items-center justify-center text-black font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
