import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { Icon } from "@/components/ui/Icon";

export function AdminTopbar({ user }: { user: { name: string; email: string } }) {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Icon name="texture" className="h-4 w-4" />
            </span>
            <span className="text-sm font-extrabold text-ink-900">RupaDinding CMS</span>
          </Link>
        </div>

        <div className="hidden text-sm text-ink-500 lg:block">
          Panel administrasi website & katalog
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="btn-ghost hidden sm:inline-flex">
            <Icon name="arrowRight" className="h-4 w-4" />
            Website
          </Link>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink-900">{user.name}</p>
            <p className="text-xs text-ink-500">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn-secondary px-3" title="Keluar">
              <Icon name="logout" className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
