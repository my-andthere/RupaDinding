import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import { deleteProductAction, toggleProductAction } from "@/app/actions/admin";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Kelola Produk" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  async function removeProduct(formData: FormData) {
    "use server";
    await deleteProductAction(String(formData.get("id")));
  }

  async function toggleProduct(formData: FormData) {
    "use server";
    await toggleProductAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Produk & Varian"
        description="Kelola katalog cat tekstur beserta varian kemasan (1 kg, 5 kg, pail 25 kg) dan harga jualnya."
        action={
          <Link href="/admin/produk/baru" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            Produk baru
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk memulai katalog."
          action={
            <Link href="/admin/produk/baru" className="btn-primary">
              Tambah produk
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <AdminCard key={product.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sand-200 bg-sand-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || "/images/produk/default.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/produk/${product.id}`}
                        className="font-bold text-ink-900 hover:text-brand-700"
                      >
                        {product.name}
                      </Link>
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                        {product.category}
                      </span>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                          Unggulan
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      SKU {product.sku} &middot; {product.textureLevel} &middot; Daya sebar{" "}
                      {product.coverageRate} m&sup2;/kg
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <li
                          key={variant.id}
                          className="flex items-center gap-2 rounded-lg bg-sand-50 px-2.5 py-1 text-xs text-ink-600"
                        >
                          <span className="font-semibold text-ink-800">{variant.label}</span>
                          <span>{formatRupiah(variant.price)}</span>
                          <span className={variant.stock <= 5 ? "text-red-600" : "text-ink-400"}>
                            stok {variant.stock}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={product.isActive ? "published" : "draft"} />
                  <Link href={`/admin/produk/${product.id}`} className="btn-secondary px-3 py-2 text-xs">
                    <Icon name="edit" className="h-3.5 w-3.5" />
                    Ubah
                  </Link>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" className="btn-secondary px-3 py-2 text-xs">
                      {product.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </form>
                  <form action={removeProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="btn px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
