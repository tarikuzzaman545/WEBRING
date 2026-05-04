import { HomeExperience } from "@/components/HomeExperience";
import { getPublicContent } from "@/lib/api";

export default async function HomePage() {
  const content = await getPublicContent();

  if (!content.settings) {
    return (
      <main className="grid min-h-screen place-items-center bg-black p-8 text-center text-white">
        <div>
          <h1 className="text-3xl font-black uppercase">Content is not configured yet.</h1>
          <p className="mt-4 text-white/60">Run the backend seed command or add settings from admin.</p>
        </div>
      </main>
    );
  }

  return <HomeExperience content={content} />;
}
