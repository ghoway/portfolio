"use client";

import { useEffect, useState } from "react";
import { Save, Sparkles, Wand2, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/components/toast";

interface HeroData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  showHireMe: boolean;
  profileImageUrl: string | null;
}

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [showHireMe, setShowHireMe] = useState(true);
  const [profileImage, setProfileImage] = useState<string>("");
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/admin/hero").then(r => r.json()).then(data => {
      setHero(data);
      setShowHireMe(data.showHireMe);
      setProfileImage(data.profileImageUrl || "");
      setDescription(data.description || "");
    });
  }, []);

  if (!hero) return <div className="h-96 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />;

  async function callAi(action: string) {
    setAiLoading(true);
    try {
      const nameEl = document.querySelector<HTMLInputElement>('input[name="name"]');
      const subEl = document.querySelector<HTMLInputElement>('input[name="subtitle"]');
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          content: description,
          topic: `${nameEl?.value || hero!.name}, ${subEl?.value || hero!.subtitle}`,
        }),
      });
      const data = await res.json();
      if (data.result) setDescription(data.result);
      else if (data.error) toast(data.error);
    } catch { toast("AI request failed — check your API key."); }
    setAiLoading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hero Section</h1>
        <p className="text-sm text-neutral-500">Edit the landing page hero section</p>
      </div>

      <form
        action={async (formData: FormData) => {
          formData.set("showHireMe", showHireMe ? "true" : "false");
          formData.set("profileImageUrl", profileImage);
          formData.set("description", description);
          const res = await fetch("/api/admin/hero", { method: "PUT", body: formData });
          if (res.ok) toast("Hero section saved!");
        }}
        className="max-w-2xl space-y-6"
      >
        <input type="hidden" name="id" value={hero.id} />

        <ImageUpload
          currentImage={hero.profileImageUrl}
          onUpload={setProfileImage}
          folder="profile"
          label="Profile Photo"
          aspectRatio="square"
          name="profileImageUrl"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium">Name</label>
          <input name="name" defaultValue={hero.name}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Subtitle</label>
          <input name="subtitle" defaultValue={hero.subtitle}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Description</label>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => callAi("generate")} disabled={aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-200 disabled:opacity-50 dark:bg-violet-900/30 dark:text-violet-300">
                {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}Generate
              </button>
              <button type="button" onClick={() => callAi("improve")} disabled={aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-300">
                <Wand2 className="h-3 w-3" />Improve
              </button>
            </div>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full resize-y min-h-[100px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={showHireMe} onChange={(e) => setShowHireMe(e.target.checked)} className="rounded border-neutral-300" />
          Show Hire Me button
        </label>

        <SubmitButton
          pendingContent={
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl">
          <Save className="h-4 w-4" />Save Changes
        </SubmitButton>
      </form>
    </div>
  );
}
