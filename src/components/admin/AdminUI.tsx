import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
        {description ? <p className="mt-1.5 max-w-3xl text-sm text-ink-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title ? (
        <div className="flex flex-col gap-2 border-b border-sand-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-ink-900">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-ink-500">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  tone?: "default" | "brand" | "dark";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-brand-50 text-brand-700"
      : tone === "dark"
        ? "bg-ink-950 text-white"
        : "bg-sand-100 text-ink-700";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    baru: "bg-sky-50 text-sky-700 ring-sky-200",
    diproses: "bg-amber-50 text-amber-700 ring-amber-200",
    dikirim: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    selesai: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dibatalkan: "bg-red-50 text-red-700 ring-red-200",
    belum_bayar: "bg-amber-50 text-amber-700 ring-amber-200",
    dp: "bg-violet-50 text-violet-700 ring-violet-200",
    lunas: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    gagal: "bg-red-50 text-red-700 ring-red-200",
    draft: "bg-sand-100 text-ink-600 ring-sand-300",
    published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closing: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    batal: "bg-red-50 text-red-700 ring-red-200",
   menunggu: "bg-amber-50 text-amber-700 ring-amber-200",
    survei: "bg-sky-50 text-sky-700 ring-sky-200",
  };
  const label = value.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
        map[value] ?? "bg-sand-100 text-ink-600 ring-sand-300"
      }`}
    >
      {label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-10 text-center">
      <p className="font-semibold text-ink-800">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
