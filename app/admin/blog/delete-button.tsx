"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/actions/blog";
import { DeleteConfirm, useDeleteConfirm } from "@/components/delete-confirm";
import { useToast } from "@/components/toast";

export function DeleteBlogButton({ id }: { id: string }) {
  const { pending, confirmDelete, cancelDelete } = useDeleteConfirm();
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteBlogPost(id);
      toast("Blog post deleted successfully");
      router.refresh();
    } catch {
      toast("Failed to delete blog post");
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
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </>
  );
}
