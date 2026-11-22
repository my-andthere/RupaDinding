"use client";

import { useActionState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type ActionFn = (formData: FormData) => Promise<{ ok: boolean; message: string } | void>;

export function ActionForm({
  action,
  children,
  className = "",
  submitLabel = "Simpan",
  showMessage = true,
  resetOnSuccess = false,
}: {
  action: ActionFn;
  children: ReactNode;
  className?: string;
  submitLabel?: string;
  showMessage?: boolean;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState<{ ok: boolean; message: string } | null, FormData>(
    async (_prev, formData) => {
      const result = await action(formData);
      return result ?? { ok: true, message: "Tersimpan." };
    },
    null,
  );

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (resetOnSuccess) {
          setTimeout(() => event.currentTarget.reset(), 0);
        }
      }}
    >
      {children}
      {showMessage && state ? (
        <p
          className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
            state.ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
          }`}
        >
          <Icon name={state.ok ? "check" : "bell"} className="h-4 w-4 shrink-0" />
          {state.message}
        </p>
      ) : null}
      {pending ? (
        <span className="mt-3 inline-flex items-center gap-2 text-xs text-ink-500">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink-300 border-t-transparent" />
          Menyimpan...
        </span>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary mt-4">
        {submitLabel}
      </button>
    </form>
  );
}
