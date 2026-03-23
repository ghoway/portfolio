"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Pencil, Eye, Star, GripVertical } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";
import { useToast } from "@/components/toast";

interface ProjectData {
  id: string; title: string; category: string; status: string; slug: string; featured: boolean; order: number;
}

export function ProjectList({ initialProjects }: { initialProjects: ProjectData[] }) {
  const [items, setItems] = useState<ProjectData[]>(initialProjects);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

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
    
    await fetch("/api/admin/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((i) => i.id) }),
    });
    
    toast("Project order updated");
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current?.classList.remove("opacity-40");
  }

  return (
    <div className="space-y-3">
      {items.map((p, index) => (
        <div 
          key={p.id} 
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          style={{ cursor: "grab" }}
          className={`flex items-center justify-between rounded-xl border bg-white p-4 transition-all dark:bg-neutral-900 ${overIndex === index && dragIndex !== null ? "border-violet-400 shadow-md shadow-violet-500/10 scale-[1.01]" : "border-neutral-200/60 dark:border-neutral-800/60"}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 cursor-grab text-neutral-300 hover:text-neutral-500 active:cursor-grabbing dark:text-neutral-600 dark:hover:text-neutral-400">
              <GripVertical className="h-5 w-5" />
            </div>
            {p.featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
            <div>
              <h3 className="font-medium">{p.title}</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">{p.category}</span>
                <span className={`rounded px-1.5 py-0.5 text-xs ${p.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                  {p.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/projects/${p.slug}`} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Eye className="h-4 w-4 text-neutral-500" />
            </Link>
            <Link href={`/admin/projects/${p.id}/edit`} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Pencil className="h-4 w-4 text-neutral-500" />
            </Link>
            <DeleteProjectButton id={p.id} onDelete={() => setItems(items.filter(i => i.id !== p.id))} />
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-center text-neutral-500 py-8">No projects yet. Create your first project!</p>}
    </div>
  );
}
