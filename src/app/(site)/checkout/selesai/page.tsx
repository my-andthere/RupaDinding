import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pesanan Berhasil",
  description: "Konfirmasi pesanan cat tekstur RupaDinding.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const order = params.order
    ? await prisma.order.findUnique({ where: { orderNo: params.order }, include: { items: true } })
    : null;
  const settings = await getSettings();

  if (!order) {
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-lg p-10 text-center">
          <h1 className="text-2xl font-extrabold text-ink-900">Pesanan tidak ditemukan</h1>
          <p className="mt-3 text-ink-600">
            Nomor pesanan tidak ditemukan. Silakan hubungi tim kami bila Anda melakukan pemesanan.
          </p>
          <Link href="/produk" className="btn-primary mt-6">
            Kembali ke katalog
          </Link>
        </div>
      </div>
    );
  }

  const waLink = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    `Halo RupaDinding, saya ingin konfirmasi pesanan saya dengan nomor ${order.orderNo}.`,
  );

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <div className="card p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Icon name="check" className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Pesanan berhasil dibuat</h1>
          <p className="mt-2 text-ink-600">
            Nomor pesanan <strong className="text-ink-900">{order.orderNo}</strong> &middot;{" "}
            {formatDateTime(order.createdAt)}
          </p>

          <div className="mt-6 rounded-2xl bg-sand-100 p-5 text-left text-sm">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-ink-600">
                    {item.qty} &times; {item.productName}
                    <span className="block text-xs text-ink-400">{item.variantLabel}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-ink-900">{formatRupiah(item.total)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-sand-300 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-semibold text-ink-900">{formatRupiah(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Ongkos kirim</dt>
                <dd className="font-semibold text-ink-900">
                  {order.shippingCost === 0 ? "Gratis" : formatRupiah(order.shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between text-base">
                <dt className="font-bold text-ink-900">Total</dt>
                <dd className="font-extrabold text-brand-700">{formatRupiah(order.total)}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
            {settings["store.bankInfo"]}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary">
              <Icon name="whatsapp" className="h-4 w-4" />
              Konfirmasi via WhatsApp
            </a>
            <Link href="/produk" className="btn-secondary">
              Lihat katalog lagi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
