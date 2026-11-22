import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import { deleteVariantAction, saveVariantAction } from "@/app/actions/admin";
import { ProductForm, productToFormValues } from "@/components/admin/ProductForm";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Produk" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();
  const currentProduct = product;

  async function removeVariant(formData: FormData) {
    "use server";
    await deleteVariantAction(String(formData.get("id")), currentProduct.id);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product.name}
        description={`${product.sku} · ${product.category} · ${product.variants.length} varian kemasan`}
        action={
          <Link href="/admin/produk" className="btn-secondary">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Kembali
          </Link>
        }
      />

      <AdminCard title="Detail produk">
        <ProductForm product={productToFormValues(product)} />
      </AdminCard>

      <AdminCard
        title="Varian kemasan"
        description="Harga jual dasar per kemasan, stok, dan harga coret (opsional)."
      >
        <div className="space-y-4">
          {product.variants.map((variant) => (
            <div key={variant.id} className="rounded-xl border border-sand-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900">{variant.label}</p>
                  <p className="text-xs text-ink-500">
                    {variant.sizeKg} kg &middot; {formatRupiah(variant.price)} &middot; stok {variant.stock}
                  </p>
                </div>
                <form action={removeVariant}>
                  <input type="hidden" name="id" value={variant.id} />
                  <button type="submit" className="btn px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    Hapus varian
                  </button>
                </form>
              </div>

              <ActionForm
                action={saveVariantAction}
                className="mt-4 grid gap-3 sm:grid-cols-6"
                submitLabel="Simpan varian"
              >
                <input type="hidden" name="id" value={variant.id} />
                <input type="hidden" name="productId" value={product.id} />
                <div className="sm:col-span-2">
                  <label className="label">Label kemasan</label>
                  <input name="label" className="input" defaultValue={variant.label} />
                </div>
                <div>
                  <label className="label">Berat (kg)</label>
                  <input
                    name="sizeKg"
                    type="number"
                    step="0.1"
                    className="input"
                    defaultValue={variant.sizeKg}
                  />
                </div>
                <div>
                  <label className="label">Harga (Rp)</label>
                  <input
                    name="price"
                    type="number"
                    className="input"
                    defaultValue={variant.price}
                  />
                </div>
                <div>
                  <label className="label">Harga coret</label>
                  <input
                    name="compareAtPrice"
                    type="number"
                    className="input"
                    defaultValue={variant.compareAtPrice ?? ""}
                  />
                </div>
                <div>
                  <label className="label">Stok</label>
                  <input name="stock" type="number" className="input" defaultValue={variant.stock} />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-700 sm:col-span-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={variant.isActive}
                    className="h-4 w-4 accent-[var(--color-brand-600)]"
                  />
                  Varian aktif dan bisa dibeli
                </label>
              </ActionForm>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
            <p className="font-semibold text-ink-900">Tambah varian kemasan</p>
            <ActionForm
              action={saveVariantAction}
              className="mt-3 grid gap-3 sm:grid-cols-6"
              submitLabel="Tambah varian"
            >
              <input type="hidden" name="productId" value={product.id} />
              <div className="sm:col-span-2">
                <label className="label">Label kemasan</label>
                <input name="label" required className="input" placeholder="Pail 25 kg" />
              </div>
              <div>
                <label className="label">Berat (kg)</label>
                <input name="sizeKg" type="number" step="0.1" required className="input" defaultValue={5} />
              </div>
              <div>
                <label className="label">Harga (Rp)</label>
                <input name="price" type="number" required className="input" />
              </div>
              <div>
                <label className="label">Harga coret</label>
                <input name="compareAtPrice" type="number" className="input" />
              </div>
              <div>
                <label className="label">Stok</label>
                <input name="stock" type="number" className="input" defaultValue={0} />
              </div>
            </ActionForm>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
