import Link from "next/link";
import { getAllProducts, getProductCategories } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Katalog Cat Tekstur RupaDinding",
  description:
    "Katalog cat tekstur RupaDinding: kamprot, pasir, silica, kulit jeruk, popcorn, stucco, dan batu alam dalam kemasan 1 kg, 5 kg, dan pail 25 kg.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const query = params.q ?? "";
  const [products, categories, settings] = await Promise.all([
    getAllProducts({ category, search: query || undefined }),
    getProductCategories(),
    getSettings(),
  ]);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Produk" }]} />

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <Icon name="box" className="h-3.5 w-3.5" />
            E-commerce ritel (KBLI 47521)
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Katalog Cat Tekstur
          </h1>
          <p className="mt-3 text-ink-600">
            Harga seragam per kemasan, siap pakai tanpa pengenceran. Gunakan kalkulator untuk memastikan
            jumlah kemasan yang Anda beli sudah cukup.
          </p>
        </div>
        <form action="/produk" method="get" className="flex w-full max-w-sm gap-2">
          {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Cari motif atau bahan dasar..."
            className="input"
            aria-label="Cari produk"
          />
          <button type="submit" className="btn-dark shrink-0">
            <Icon name="search" className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href={query ? `/produk?q=${encodeURIComponent(query)}` : "/produk"}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            category === "all"
              ? "bg-ink-900 text-white"
              : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
          }`}
        >
          Semua motif
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            href={`/produk?category=${encodeURIComponent(item)}${
              query ? `&q=${encodeURIComponent(query)}` : ""
            }`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === item
                ? "bg-ink-900 text-white"
                : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-500">
        Menampilkan {products.length} produk
        {category !== "all" ? ` untuk kategori ${category}` : ""}
        {query ? ` dengan kata kunci "${query}"` : ""}.
      </p>

      {products.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-ink-600">Produk tidak ditemukan.</p>
          <Link href="/produk" className="btn-secondary mt-5">
            Reset filter
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="card mt-10 border-l-4 border-l-brand-500 bg-sand-100 p-5 text-sm text-ink-600">
        {settings["compliance.retailNotice"]}
      </div>
    </div>
  );
}
