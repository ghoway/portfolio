"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical, Sparkles, Wand2, Loader2 } from "lucide-react";
import type { ExperienceData } from "@/types";
import { useToast } from "@/components/toast";
import { DeleteConfirm, useDeleteConfirm } from "@/components/delete-confirm";
import { SubmitButton } from "@/components/submit-button";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceData[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { pending, confirmDelete, cancelDelete } = useDeleteConfirm();

  useEffect(() => {
    fetch("/api/admin/experience").then((r) => r.json()).then(setItems);
  }, []);

  async function handleSave(form: FormData) {
    const id = form.get("id") as string;
    const method = id ? "PUT" : "POST";
    await fetch("/api/admin/experience", { method, body: form });
    const data = await fetch("/api/admin/experience").then((r) => r.json());
    setItems(data);
    setEditing(null);
    setShowForm(false);
    toast(id ? "Experience updated" : "Experience created");
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/experience", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setItems(items.filter((i) => i.id !== id));
    cancelDelete();
    toast("Experience deleted");
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => { dragNodeRef.current?.classList.add("opacity-40"); }, 0);
  }

  function handleDragEnter(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setOverIndex(index);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setItems(reordered);
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current?.classList.remove("opacity-40");
    await fetch("/api/admin/experience/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((i) => i.id) }),
    });
    toast("Order updated");
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current?.classList.remove("opacity-40");
  }

  function startEdit(id: string) {
    setShowForm(false);
    setEditing(id);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Experience</h1>
          <p className="text-sm text-neutral-500">Manage your work experience — drag to reorder</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />Add Experience
        </button>
      </div>

      {(showForm || editing) && (
        <ExperienceForm
          key={editing ?? "new"}
          data={editing ? items.find((i) => i.id === editing) : undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 rounded-xl border bg-white p-3 sm:p-4 transition-all dark:bg-neutral-900 ${overIndex === index && dragIndex !== null ? "border-violet-400 shadow-md shadow-violet-500/10 scale-[1.01]" : "border-neutral-200/60 dark:border-neutral-800/60"}`}
            style={{ cursor: "grab" }}>
            <div className="flex-shrink-0 cursor-grab text-neutral-300 hover:text-neutral-500 active:cursor-grabbing dark:text-neutral-600 dark:hover:text-neutral-400">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-medium truncate text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-500 truncate">{item.company} • {item.startDate} — {item.endDate || "Present"}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={(e) => { e.stopPropagation(); startEdit(item.id); }} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Pencil className="h-4 w-4 text-neutral-500" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); confirmDelete(item.id); }} className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950/30">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-8 text-center text-neutral-500">No experience entries yet. Add your first one!</p>}
      </div>

      <DeleteConfirm
        isOpen={!!pending}
        title="Delete Experience"
        description="This work experience entry will be permanently removed."
        onConfirm={() => {
          if (!pending) return;
          return handleDelete(pending);
        }}
        onCancel={cancelDelete}
      />
    </div>
  );
}

function ExperienceForm({ data, onSave, onCancel }: { data?: ExperienceData; onSave: (f: FormData) => void; onCancel: () => void }) {
  const [description, setDescription] = useState(data?.description ?? "");
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  async function callAi(action: string) {
    setAiLoading(true);
    try {
      const titleEl = document.querySelector<HTMLInputElement>('input[name="title"]');
      const companyEl = document.querySelector<HTMLInputElement>('input[name="company"]');
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          content: description,
          topic: `${titleEl?.value || data?.title || ""} at ${companyEl?.value || data?.company || ""}`,
        }),
      });
      const result = await res.json();
      if (result.result) setDescription(result.result);
      else if (result.error) toast(result.error);
    } catch { toast("AI request failed — check your API key."); }
    setAiLoading(false);
  }

  return (
    <form action={(fd) => { fd.set("description", description); onSave(fd); }}
      className="mb-6 rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
      {data && <input type="hidden" name="id" value={data.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" defaultValue={data?.title} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Company</label>
          <input name="company" defaultValue={data?.company} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Start Date</label>
          <input name="startDate" defaultValue={data?.startDate} placeholder="2023-01" required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">End Date</label>
          <input name="endDate" defaultValue={data?.endDate || ""} placeholder="Leave empty for Present" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div className="sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
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
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required
            className="w-full resize-y min-h-[100px] rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <SubmitButton
          pendingContent={
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          }
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          <Save className="h-4 w-4" />{data ? "Update" : "Create"}
        </SubmitButton>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <X className="h-4 w-4" />Cancel
        </button>
      </div>
    </form>
  );
}
