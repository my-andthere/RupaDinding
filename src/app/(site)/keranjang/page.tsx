import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getSettings, numericSetting } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { CartTable } from "@/components/cart/CartTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Keranjang Belanja",
  description: "Keranjang belanja cat tekstur RupaDinding.",
};

export default async function CartPage() {
  const [cart, settings] = await Promise.all([getCart(), getSettings()]);
  const flatShipping = numericSetting(settings, "store.shippingFlat", 25000);
  const freeShippingMin = numericSetting(settings, "store.freeShippingMin", 750000);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingCost = subtotal >= freeShippingMin ? 0 : flatShipping;
  const total = subtotal + shippingCost;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Keranjang" }]} />

      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand-100 text-ink-400">
            <Icon name="cart" className="h-7 w-7" />
          </span>
          <p className="mt-4 text-ink-600">Keranjang Anda masih kosong.</p>
          <Link href="/produk" className="btn-primary mt-6">
            <Icon name="box" className="h-4 w-4" />
            Lihat katalog cat tekstur
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="card px-6 lg:col-span-2">
            <CartTable
              items={items.map((item) => ({
                id: item.id,
                qty: item.qty,
                variant: {
                  id: item.variant.id,
                  label: item.variant.label,
                  sizeKg: item.variant.sizeKg,
                  price: item.variant.price,
                  stock: item.variant.stock,
                  product: {
                    name: item.variant.product.name,
                    slug: item.variant.product.slug,
                    image: item.variant.product.image,
                  },
                },
              }))}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              <h2 className="text-lg font-bold text-ink-900">Ringkasan belanja</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">Subtotal ({cart?.itemCount} item)</dt>
                  <dd className="font-semibold text-ink-900">{formatRupiah(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">Ongkos kirim</dt>
                  <dd className="font-semibold text-ink-900">
                    {shippingCost === 0 ? "Gratis" : formatRupiah(shippingCost)}
                  </dd>
                </div>
                {shippingCost > 0 ? (
                  <p className="rounded-xl bg-brand-50 p-3 text-xs text-brand-700">
                    Belanja {formatRupiah(freeShippingMin - subtotal)} lagi untuk gratis ongkir.
                  </p>
                ) : null}
                <div className="flex justify-between border-t border-sand-200 pt-3 text-base">
                  <dt className="font-bold text-ink-900">Total</dt>
                  <dd className="font-extrabold text-brand-700">{formatRupiah(total)}</dd>
                </div>
              </dl>

              <Link href="/checkout" className="btn-primary mt-6 w-full">
                Lanjut ke checkout
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link href="/produk" className="btn-ghost mt-2 w-full">
                <Icon name="arrowLeft" className="h-4 w-4" />
                Lanjut belanja
              </Link>

              <p className="mt-5 rounded-xl bg-sand-100 p-3 text-xs leading-relaxed text-ink-500">
                {settings["store.cartNote"]}
              </p>
              <p className="mt-3 text-xs text-ink-400">{settings["compliance.retailNotice"]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
