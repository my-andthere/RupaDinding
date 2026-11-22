import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getCart } from "@/lib/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/layanan", label: "Layanan Jasa" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kalkulator", label: "Kalkulator Cat" },
  { href: "/blog", label: "Blog" },
  { href: "/kontak", label: "Kontak" },
];

export async function SiteHeader() {
  const settings = await getSettings();
  const cart = await getCart();
  const brand = settings["company.brand"] || "RupaDinding";
  const waNumber = settings["contact.whatsapp"];
  const waLink = buildWhatsAppUrl(
    waNumber,
    "Halo RupaDinding, saya ingin menanyakan produk cat tekstur dan jasa aplikator.",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft transition group-hover:bg-brand-700">
              <Icon name="texture" className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-ink-900">{brand}</span>
              <span className="block text-[11px] font-medium text-ink-500">
                {settings["company.tagline"] || "Cat Tekstur & Jasa Aplikator"}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-sand-100 hover:text-ink-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary hidden sm:inline-flex"
            >
              <Icon name="whatsapp" className="h-4 w-4 text-brand-600" />
              Konsultasi
            </a>
            <Link
              href="/keranjang"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 bg-white text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
              aria-label="Keranjang belanja"
            >
              <Icon name="cart" className="h-5 w-5" />
              {cart && cart.itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                  {cart.itemCount}
                </span>
              ) : null}
            </Link>

            <details className="relative lg:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-sand-300 bg-white text-ink-700">
                <Icon name="layout" className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-sand-200 bg-white p-2 shadow-card">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-sand-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
