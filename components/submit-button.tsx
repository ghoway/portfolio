"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingContent?: ReactNode;
}

export function SubmitButton({
  children,
  pendingContent,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn("disabled:cursor-not-allowed disabled:opacity-70", className)}
      {...props}
    >
      {pending ? (
        pendingContent ?? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        )
      ) : (
        children
      )}
    </button>
  );
}
