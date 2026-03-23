"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical, Loader2 } from "lucide-react";
import { useToast } from "@/components/toast";
import { DeleteConfirm, useDeleteConfirm } from "@/components/delete-confirm";
import { SubmitButton } from "@/components/submit-button";

interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillData[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { pending, confirmDelete, cancelDelete } = useDeleteConfirm();

  useEffect(() => {
    fetch("/api/admin/skills").then((r) => r.json()).then(setItems);
  }, []);

  async function handleSave(form: FormData) {
    const id = form.get("id") as string;
    const method = id ? "PUT" : "POST";
    await fetch("/api/admin/skills", { method, body: form });
    const data = await fetch("/api/admin/skills").then((r) => r.json());
    setItems(data);
    setEditing(null);
    setShowForm(false);
    toast(id ? "Skill updated" : "Skill created");
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/skills", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setItems(items.filter((i) => i.id !== id));
    cancelDelete();
    toast("Skill deleted");
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => dragNodeRef.current?.classList.add("opacity-40"), 0);
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
    await fetch("/api/admin/skills/reorder", {
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

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-sm text-neutral-500">Manage your skills — drag to reorder</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />Add Skill
        </button>
      </div>

      {(showForm || editing) && (
        <SkillForm
          key={editing ?? "new"}
          data={editing ? items.find((i) => i.id === editing) : undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{cat}</h2>
          <div className="space-y-2">
            {items.filter((i) => i.category === cat).map((item) => {
              const globalIndex = items.indexOf(item);
              return (
                <div key={item.id} draggable
                  onDragStart={(e) => handleDragStart(e, globalIndex)}
                  onDragEnter={() => handleDragEnter(globalIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, globalIndex)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-xl border bg-white p-3 transition-all dark:bg-neutral-900 ${overIndex === globalIndex && dragIndex !== null ? "border-violet-400 shadow-md" : "border-neutral-200/60 dark:border-neutral-800/60"}`}
                  style={{ cursor: "grab" }}>
                  <GripVertical className="h-5 w-5 flex-shrink-0 text-neutral-300 dark:text-neutral-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-xs text-violet-600 dark:text-violet-400">{item.level}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full max-w-[200px] rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" style={{ width: `${item.level}%` }} />
                    </div>
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
              );
            })}
          </div>
        </div>
      ))}

      <DeleteConfirm
        isOpen={!!pending}
        title="Delete Skill"
        description="This skill will be permanently removed."
        onConfirm={() => {
          if (!pending) return;
          return handleDelete(pending);
        }}
        onCancel={cancelDelete}
      />
    </div>
  );
}

function SkillForm({ data, onSave, onCancel }: { data?: SkillData; onSave: (f: FormData) => void; onCancel: () => void }) {
  return (
    <form action={onSave} className="mb-6 rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
      {data && <input type="hidden" name="id" value={data.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="mb-1 block text-sm font-medium">Name</label>
          <input name="name" defaultValue={data?.name} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Category</label>
          <input name="category" defaultValue={data?.category || "General"} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Level (%)</label>
          <input name="level" type="number" min={0} max={100} defaultValue={data?.level || 50} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
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
