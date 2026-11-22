"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Icon } from "@/components/ui/Icon";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="card w-full max-w-md p-7">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Icon name="texture" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-extrabold text-ink-900">RupaDinding CMS</p>
          <p className="text-xs text-ink-500">Portal administrasi PT Mitra Dinding Utama</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email admin
          </label>
          <input id="email" name="email" type="email" required className="input" placeholder="admin@rupadinding.co.id" />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
        </div>
      </div>

      {state && !state.ok ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <Icon name="bell" className="h-4 w-4 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
        {pending ? "Memproses..." : "Masuk ke CMS"}
      </button>

      <p className="mt-4 text-xs text-ink-400">
        Akun awal dibuat oleh seed: admin@rupadinding.co.id / RupaDinding2026! (segera ganti password).
      </p>
    </form>
  );
}
