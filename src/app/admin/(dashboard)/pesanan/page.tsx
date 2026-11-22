import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pesanan" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const orders = await prisma.order.findMany({
    where: params.status ? { status: params.status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalOmzet = orders
    .filter((order) => order.status !== "dibatalkan")
    .reduce((sum, order) => sum + order.total, 0);

  const filters = [
    { value: "", label: "Semua" },
    { value: "baru", label: "Baru" },
    { value: "diproses", label: "Diproses" },
    { value: "dikirim", label: "Dikirim" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pesanan Produk"
        description="Pencatatan penjualan produk (ritel) terpisah dari pendapatan jasa aplikator."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Link
              key={filter.value || "all"}
              href={filter.value ? `/admin/pesanan?status=${filter.value}` : "/admin/pesanan"}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                (params.status ?? "") === filter.value
                  ? "bg-ink-900 text-white"
                  : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-ink-500">
          Total nilai {orders.length} pesanan:{" "}
          <strong className="text-ink-900">{formatRupiah(totalOmzet)}</strong>
        </p>
      </div>

      <AdminCard>
        {orders.length === 0 ? (
          <EmptyState title="Belum ada pesanan" description="Pesanan dari checkout website akan muncul di sini." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="pb-2 font-semibold">No. Pesanan</th>
                  <th className="pb-2 font-semibold">Pelanggan</th>
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                  <th className="pb-2 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3">
                      <Link
                        href={`/admin/pesanan/${order.id}`}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        {order.orderNo}
                      </Link>
                      <span className="block text-xs text-ink-400">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-ink-800">{order.customerName}</p>
                      <p className="text-xs text-ink-500">{order.phone}</p>
                    </td>
                    <td className="py-3 text-xs text-ink-500">
                      {order.items.length} item &middot; {order.city}
                    </td>
                    <td className="py-3 text-right font-semibold text-ink-900">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge value={order.status} />
                      <span className="mt-1 block">
                        <StatusBadge value={order.paymentStatus} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
