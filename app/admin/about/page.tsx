"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Wand2, Loader2 } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/components/toast";

interface AboutData {
  id: string;
  biography: string;
  careerGoals: string;
  cvLink: string | null;
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [biography, setBiography] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [aiLoading, setAiLoading] = useState<"bio" | "goals" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/admin/about").then(r => r.json()).then(data => {
      setAbout(data);
      setBiography(data.biography || "");
      setCareerGoals(data.careerGoals || "");
    });
  }, []);

  if (!about) return <div className="h-96 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />;

  async function callAi(field: "bio" | "goals", action: string) {
    setAiLoading(field);
    try {
      const content = field === "bio" ? biography : careerGoals;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content, topic: field === "bio" ? "professional biography" : "career goals" }),
      });
      const data = await res.json();
      if (data.result) {
        if (field === "bio") setBiography(data.result);
        else setCareerGoals(data.result);
      } else if (data.error) toast(data.error);
    } catch { toast("AI request failed — check your API key."); }
    setAiLoading(null);
  }

  async function handleSave(formData: FormData) {
    formData.set("biography", biography);
    formData.set("careerGoals", careerGoals);
    await fetch("/api/admin/about", { method: "PUT", body: formData });
    toast("About section saved!");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">About Section</h1>
        <p className="text-sm text-neutral-500">Edit your biography and career goals</p>
      </div>

      <form action={handleSave} className="max-w-2xl space-y-6">
        <input type="hidden" name="id" value={about.id} />

        {/* Biography */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Biography</label>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => callAi("bio", "generate")} disabled={!!aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-200 disabled:opacity-50 dark:bg-violet-900/30 dark:text-violet-300">
                {aiLoading === "bio" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}Generate
              </button>
              <button type="button" onClick={() => callAi("bio", "improve")} disabled={!!aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-300">
                <Wand2 className="h-3 w-3" />Improve
              </button>
            </div>
          </div>
          <textarea value={biography} onChange={e => setBiography(e.target.value)} rows={5}
            className="w-full resize-y min-h-[100px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

        {/* Career Goals */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Career Goals</label>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => callAi("goals", "generate")} disabled={!!aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-200 disabled:opacity-50 dark:bg-violet-900/30 dark:text-violet-300">
                {aiLoading === "goals" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}Generate
              </button>
              <button type="button" onClick={() => callAi("goals", "improve")} disabled={!!aiLoading}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-300">
                <Wand2 className="h-3 w-3" />Improve
              </button>
            </div>
          </div>
          <textarea value={careerGoals} onChange={e => setCareerGoals(e.target.value)} rows={3}
            className="w-full resize-y min-h-[100px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">CV Link (optional)</label>
          <input name="cvLink" defaultValue={about.cvLink || ""} placeholder="https://example.com/cv.pdf"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-700 dark:bg-neutral-800" />
        </div>

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
