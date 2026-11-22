"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const navGroups = [
  {
    title: "Ringkasan",
    items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }],
  },
  {
    title: "Katalog & Transaksi",
    items: [
      { href: "/admin/produk", label: "Produk & Varian", icon: "box" },
      { href: "/admin/promosi", label: "Promo & Harga Coret", icon: "tag" },
      { href: "/admin/pesanan", label: "Pesanan", icon: "receipt" },
    ],
  },
  {
    title: "Jasa Aplikator",
    items: [
      { href: "/admin/tarif-jasa", label: "Tarif & Layanan", icon: "scale" },
      { href: "/admin/prospek", label: "Prospek Project Brief", icon: "users" },
    ],
  },
  {
    title: "Keuangan",
    items: [{ href: "/admin/harga-hpp", label: "HPP & Margin", icon: "trend" }],
  },
  {
    title: "Konten & GROW",
    items: [
      { href: "/admin/artikel", label: "Artikel & Blog", icon: "fileText" },
      { href: "/admin/galeri", label: "Galeri Portofolio", icon: "image" },
      { href: "/admin/landing-ab", label: "Landing Page A/B", icon: "layout" },
      { href: "/admin/pesan", label: "Pesan Masuk", icon: "mail" },
    ],
  },
  {
    title: "Sistem",
    items: [{ href: "/admin/pengaturan", label: "Pengaturan Situs", icon: "settings" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-950 text-ink-200 lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Icon name="texture" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-white">RupaDinding CMS</p>
          <p className="text-[11px] text-ink-400">PT Mitra Dinding Utama</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-bold tracking-widest text-ink-500 uppercase">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-brand-600 text-white"
                          : "text-ink-300 hover:bg-ink-900 hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} className="h-4.5 w-4.5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-800 px-5 py-4">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-ink-400 hover:text-white">
          <Icon name="arrowRight" className="h-3.5 w-3.5" />
          Lihat website publik
        </Link>
      </div>
    </aside>
  );
}
