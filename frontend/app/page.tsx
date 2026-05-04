import { HomeExperience } from "@/components/HomeExperience";
import { getPublicContent } from "@/lib/api";

export default async function HomePage() {
  let content = null;
  try {
    content = await getPublicContent();
  } catch (error) {
    console.error("Backend connection failed:", error);
    return (
      <main className="grid min-h-screen place-items-center bg-black p-8 text-center text-white">
        <div>
          <h1 className="text-3xl font-black uppercase text-red-500 mb-4">Backend Connection Error</h1>
          <p className="mt-4 text-white/80 max-w-lg mx-auto">
            The frontend is live, but it cannot connect to the backend server.
            <br/><br/>
            <strong>Fix:</strong> Deploy your backend to Render, then add the Render URL to Vercel Environment Variables as <code>NEXT_PUBLIC_API_URL</code>.
          </p>
        </div>
      </main>
    );
  }

  if (!content || !content.settings) {
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
