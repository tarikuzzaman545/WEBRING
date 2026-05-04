import type { Metadata } from "next";
import "./globals.css";
import { getPublicContent } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getPublicContent();
    return {
      title: content.settings?.seo?.title || content.settings?.brandName || "Webring",
      description: content.settings?.seo?.description || content.settings?.hero?.subheadline || ""
    };
  } catch {
    return {
      title: "Webring",
      description: "AI product visual production platform"
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
