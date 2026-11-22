import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { updateOrderStatusAction, updatePaymentStatusAction } from "@/app/actions/admin";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Pesanan" };

const orderStatuses = ["baru", "diproses", "dikirim", "selesai", "dibatalkan"];
const paymentStatuses = ["belum_bayar", "dp", "lunas", "gagal"];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();
  const currentOrder = order;

  async function changeStatus(formData: FormData) {
    "use server";
    await updateOrderStatusAction(currentOrder.id, String(formData.get("status")));
  }

  async function changePayment(formData: FormData) {
    "use server";
    await updatePaymentStatusAction(currentOrder.id, String(formData.get("paymentStatus")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Pesanan ${order.orderNo}`}
        description={`Dibuat ${formatDateTime(order.createdAt)} · metode ${order.paymentMethod}`}
        action={
          <Link href="/admin/pesanan" className="btn-secondary">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Kembali
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Item pesanan">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                  <tr>
                    <th className="pb-2 font-semibold">Produk</th>
                    <th className="pb-2 font-semibold">Kemasan</th>
                    <th className="pb-2 text-right font-semibold">Harga</th>
                    <th className="pb-2 text-right font-semibold">Qty</th>
                    <th className="pb-2 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-ink-800">{item.productName}</td>
                      <td className="py-3 text-xs text-ink-500">{item.variantLabel}</td>
                      <td className="py-3 text-right text-ink-700">{formatRupiah(item.price)}</td>
                      <td className="py-3 text-right text-ink-700">{item.qty}</td>
                      <td className="py-3 text-right font-semibold text-ink-900">
                        {formatRupiah(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="mt-2">
                  <tr>
                    <td colSpan={4} className="py-2 text-right text-ink-500">
                      Subtotal
                    </td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {formatRupiah(order.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-2 text-right text-ink-500">
                      Ongkos kirim
                    </td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {order.shippingCost === 0 ? "Gratis" : formatRupiah(order.shippingCost)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-2 text-right font-bold text-ink-900">
                      Total
                    </td>
                    <td className="py-2 text-right text-base font-extrabold text-brand-700">
                      {formatRupiah(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </AdminCard>

          <AdminCard title="Data pelanggan">
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-xs text-ink-500">Nama</dt>
                <dd className="font-semibold text-ink-900">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">WhatsApp</dt>
                <dd className="font-semibold text-ink-900">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Email</dt>
                <dd className="font-semibold text-ink-900">{order.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Kota</dt>
                <dd className="font-semibold text-ink-900">{order.city}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-ink-500">Alamat</dt>
                <dd className="text-ink-700">{order.address}</dd>
              </div>
              {order.note ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-ink-500">Catatan</dt>
                  <dd className="text-ink-700">{order.note}</dd>
                </div>
              ) : null}
            </dl>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Status pesanan">
            <form action={changeStatus}>
              <label className="label">Ubah status</label>
              <select name="status" className="input" defaultValue={order.status}>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary mt-4 w-full">
                Simpan status
              </button>
            </form>
            <p className="mt-4 text-sm text-ink-600">
              Status saat ini: <StatusBadge value={order.status} />
            </p>
          </AdminCard>

          <AdminCard title="Status pembayaran">
            <form action={changePayment}>
              <label className="label">Ubah pembayaran</label>
              <select name="paymentStatus" className="input" defaultValue={order.paymentStatus}>
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary mt-4 w-full">
                Simpan pembayaran
              </button>
            </form>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
