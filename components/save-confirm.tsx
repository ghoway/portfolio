"use client";

import { useEffect, useState } from "react";
import { Save, AlertCircle, Loader2 } from "lucide-react";

interface SaveConfirmProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
}

export function SaveConfirm({
  isOpen,
  title = "Save Changes",
  description = "Are you sure you want to save these changes?",
  onConfirm,
  onCancel,
  confirmText = "Save",
}: SaveConfirmProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsSubmitting(false);
  }, [isOpen]);

  async function handleConfirm() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-2xl dark:border-neutral-800/60 dark:bg-neutral-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/30">
          <AlertCircle className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="mb-1 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-sm text-neutral-500">{description}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useSaveConfirm() {
  const [isConfirming, setIsConfirming] = useState(false);

  function confirmSave() {
    setIsConfirming(true);
  }

  function cancelSave() {
    setIsConfirming(false);
  }

  return { isConfirming, confirmSave, cancelSave };
}
