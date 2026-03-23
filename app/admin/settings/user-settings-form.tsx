"use client";

import { useRef, useState } from "react";
import { changeAdminPassword } from "@/actions/settings";
import { useToast } from "@/components/toast";
import { KeyRound } from "lucide-react";
import { SaveConfirm, useSaveConfirm } from "@/components/save-confirm";

const inputCls =
  "w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30";

export function UserSettingsForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const { isConfirming, confirmSave, cancelSave } = useSaveConfirm();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
    confirmSave();
  }

  async function handleConfirmChange() {
    if (!pendingFormData) return;
    try {
      await changeAdminPassword(pendingFormData);
      toast("Password changed successfully.");
      formRef.current?.reset();
      setPendingFormData(null);
      cancelSave();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password.";
      toast(message);
      cancelSave();
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900"
      >
        <div className="mb-4 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-violet-600" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        <p className="mb-4 text-xs text-neutral-500">
          Change your admin password. You will use this password on your next sign in.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputCls}
              />
              <p className="mt-1 text-xs text-neutral-400">Minimum 8 characters.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
        >
          <KeyRound className="h-4 w-4" />
          Update Password
        </button>
      </form>

      <SaveConfirm
        isOpen={isConfirming}
        onCancel={() => {
          cancelSave();
          setPendingFormData(null);
        }}
        onConfirm={handleConfirmChange}
        title="Confirm Password Change"
        description="Are you sure you want to update your password? You will need to use the new password next time you sign in."
        confirmText="Update Password"
      />
    </>
  );
}
