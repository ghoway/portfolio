"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/projects";
import { DeleteConfirm, useDeleteConfirm } from "@/components/delete-confirm";
import { useToast } from "@/components/toast";

export function DeleteProjectButton({ id, onDelete }: { id: string; onDelete?: () => void }) {
  const { pending, confirmDelete, cancelDelete } = useDeleteConfirm();
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteProject(id);
      toast("Project deleted successfully");
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    } catch {
      toast("Failed to delete project");
    } finally {
      cancelDelete();
    }
  }

  return (
    <>
      <button 
        onClick={() => confirmDelete("delete")}
        className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>

      <DeleteConfirm
        isOpen={pending !== null}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </>
  );
}
