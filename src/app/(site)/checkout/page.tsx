import Link from "next/link";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart";
import { getSettings, numericSetting } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  description: "Checkout pembelian cat tekstur RupaDinding.",
};

export default async function CheckoutPage() {
  const [cart, settings] = await Promise.all([getCart(), getSettings()]);
  if (!cart || cart.items.length === 0) redirect("/keranjang");

  const flatShipping = numericSetting(settings, "store.shippingFlat", 25000);
  const freeShippingMin = numericSetting(settings, "store.freeShippingMin", 750000);
  const subtotal = cart.subtotal;
  const shippingCost = subtotal >= freeShippingMin ? 0 : flatShipping;
  const total = subtotal + shippingCost;
  const paymentMethods = (settings["store.paymentMethods"] || "Transfer Bank")
    .split("|")
    .map((method) => method.trim())
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Beranda" },
          { href: "/keranjang", label: "Keranjang" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900">Checkout</h1>
      <p className="mt-2 text-ink-600">
        Isi data pengiriman. Tim kami akan menghubungi Anda untuk konfirmasi pembayaran dan jadwal
        pengiriman.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            total={total}
            subtotal={subtotal}
            shippingCost={shippingCost}
            paymentMethods={paymentMethods}
            bankInfo={settings["store.bankInfo"]}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <h2 className="text-lg font-bold text-ink-900">Pesanan Anda</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-ink-600">
                    {item.qty} &times; {item.variant.product.name}
                    <span className="block text-xs text-ink-400">{item.variant.label}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-ink-900">
                    {formatRupiah(item.variant.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-semibold text-ink-900">{formatRupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Ongkos kirim</dt>
                <dd className="font-semibold text-ink-900">
                  {shippingCost === 0 ? "Gratis" : formatRupiah(shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-sand-200 pt-3 text-base">
                <dt className="font-bold text-ink-900">Total</dt>
                <dd className="font-extrabold text-brand-700">{formatRupiah(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-sand-100 p-3 text-xs text-ink-500">
              <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {settings["compliance.retailNotice"]}
            </p>
            <Link href="/keranjang" className="btn-ghost mt-3 w-full">
              <Icon name="arrowLeft" className="h-4 w-4" />
              Kembali ke keranjang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
