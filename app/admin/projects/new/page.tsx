"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/projects";
import { Save, ChevronDown, ArrowLeft, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/toast";
import { useSaveConfirm, SaveConfirm } from "@/components/save-confirm";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");
  const { isConfirming, confirmSave, cancelSave } = useSaveConfirm();
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  function handleSubmitWrapper(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
    confirmSave();
  }

  async function handleSubmit() {
    if (!pendingFormData) return;
    try {
      pendingFormData.set("imageUrl", imageUrl);
      await createProject(pendingFormData);
      toast("Project created successfully!");
      router.push("/admin/projects");
    } catch {
      toast("Failed to create project.");
    }
  }

  return (
    <div>
      <Link href="/admin/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Project</h1>
        <p className="text-sm text-neutral-500">Create a new project</p>
      </div>

      <form onSubmit={handleSubmitWrapper} className="space-y-4">
        <ImageUpload
          onUpload={setImageUrl}
          folder="projects"
          label="Project Cover Image"
          aspectRatio="video"
          name="imageUrl"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">Title</label><input name="title" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <input name="category" required placeholder="e.g. Web Apps, AI, Creatives" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
          </div>
        </div>
        <div><label className="mb-1 block text-sm font-medium">Description</label><textarea name="description" rows={3} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Tech Stack (comma-separated)</label><input name="techStack" required placeholder="React,Node.js,TypeScript" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">GitHub URL</label><input name="githubUrl" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div><label className="mb-1 block text-sm font-medium">Live URL</label><input name="liveUrl" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <div className="relative">
              <select name="status" className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
          <div className="flex items-end"><label className="flex items-center gap-2 text-sm font-medium py-3"><input type="checkbox" name="featured" value="true" className="rounded" />Featured</label></div>
          <div><label className="mb-1 block text-sm font-medium">Order</label><input name="order" type="number" defaultValue={0} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-6 py-2.5 text-sm font-medium hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-900/40">
            <X className="h-4 w-4" />Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
            <Save className="h-4 w-4" />Create Project
          </button>
        </div>
      </form>

      <SaveConfirm 
        isOpen={isConfirming}
        onCancel={() => { cancelSave(); setPendingFormData(null); }}
        onConfirm={async () => {
          cancelSave();
          await handleSubmit();
        }}
        title="Create Project"
        description="Are you sure you want to create and publish this project?"
        confirmText="Create Project"
      />
    </div>
  );
}
