"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface DeleteConfirmProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirm({
  isOpen,
  title = "Delete Item",
  description = "Are you sure? This action cannot be undone.",
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsDeleting(false);
  }, [isOpen]);

  async function handleConfirm() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-2xl dark:border-neutral-800/60 dark:bg-neutral-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/30">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mb-1 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-sm text-neutral-500">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook that manages delete confirmation state */
export function useDeleteConfirm() {
  const [pending, setPending] = useState<string | null>(null);

  function confirmDelete(id: string) {
    setPending(id);
  }

  function cancelDelete() {
    setPending(null);
  }

  return { pending, confirmDelete, cancelDelete };
}
