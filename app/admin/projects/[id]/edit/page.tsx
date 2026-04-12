"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronDown, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/components/toast";
import { useSaveConfirm, SaveConfirm } from "@/components/save-confirm";
import Link from "next/link";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<Record<string, string | boolean | number> | null>(null);
  const { isConfirming, confirmSave, cancelSave } = useSaveConfirm();
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`).then(r => r.json()).then(data => {
      setProject(data);
    });
  }, [id]);

  function handleSubmitWrapper(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
    confirmSave();
  }

  async function handleUpdate() {
    if (!pendingFormData) return;
    try {
      pendingFormData.set("id", id);
      const res = await fetch("/api/admin/projects", { method: "PUT", body: pendingFormData });
      if (res.ok) {
        toast("Project updated successfully!");
        router.push("/admin/projects");
      } else {
        toast("Failed to update project.");
      }
    } catch {
      toast("Failed to update project.");
    }
  }

  if (!project) return <div className="h-96 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />;

  return (
    <div>
      <Link href="/admin/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-sm text-neutral-500">Make changes to your project</p>
      </div>

      <form onSubmit={handleSubmitWrapper} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">Title</label><input name="title" defaultValue={project.title as string} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <input name="category" defaultValue={project.category as string} required placeholder="e.g. Web Apps, AI, Creatives" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
          </div>
        </div>
        <div><label className="mb-1 block text-sm font-medium">Description</label><textarea name="description" rows={3} defaultValue={project.description as string} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Tech Stack (comma-separated)</label><input name="techStack" defaultValue={project.techStack as string} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">GitHub URL</label><input name="githubUrl" defaultValue={(project.githubUrl as string) || ""} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div><label className="mb-1 block text-sm font-medium">Live URL</label><input name="liveUrl" defaultValue={(project.liveUrl as string) || ""} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <div className="relative">
              <select name="status" defaultValue={project.status as string} className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
          <div className="flex items-end"><label className="flex items-center gap-2 text-sm font-medium py-3"><input type="checkbox" name="featured" value="true" defaultChecked={project.featured as boolean} className="rounded" />Featured</label></div>
          <div><label className="mb-1 block text-sm font-medium">Order</label><input name="order" type="number" defaultValue={project.order as number} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-6 py-2.5 text-sm font-medium hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-900/40">
            <X className="h-4 w-4" />Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
            <Save className="h-4 w-4" />Save Changes
          </button>
        </div>
      </form>

      <SaveConfirm 
        isOpen={isConfirming}
        onCancel={() => { cancelSave(); setPendingFormData(null); }}
        onConfirm={async () => {
          cancelSave();
          await handleUpdate();
        }}
        title="Save Changes"
        description="Are you sure you want to update this project?"
        confirmText="Save Changes"
      />
    </div>
  );
}
