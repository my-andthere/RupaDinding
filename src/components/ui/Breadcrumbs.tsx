import Link from "next/link";
import { Icon } from "./Icon";

export function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 ? <Icon name="chevronDown" className="h-3.5 w-3.5 -rotate-90" /> : null}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
