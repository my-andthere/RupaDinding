import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { AdminCard, AdminPageHeader, StatCard, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard CMS" };

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    productCount,
    variantCount,
    orderCount,
    monthOrders,
    monthRevenue,
    leadCount,
    newLeadCount,
    pendingOrders,
    lowStock,
    recentOrders,
    recentLeads,
    hppRecords,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.productVariant.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "baru" } }),
    prisma.order.count({ where: { status: { in: ["baru", "diproses"] } } }),
    prisma.productVariant.findMany({
      where: { isActive: true, stock: { lte: 10 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 6,
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.hppRecord.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const revenue = monthRevenue._sum.total ?? 0;
  const omzetProduk = revenue; // pencatatan produk (ritel) - KBLI 47521
  // Pendapatan jasa (KBLI 43303) dicatat terpisah melalui invoice manual di luar sistem ini.
  const openLeads = await prisma.lead.findMany({
    where: { status: { in: ["baru", "menunggu", "survei", "closing"] } },
    select: { areaSize: true, packageType: true },
  });
  const minRate = await prisma.serviceRate.findFirst({
    where: { category: "paket", isActive: true },
    orderBy: { minPrice: "asc" },
    select: { minPrice: true },
  });
  const potensiJasa = openLeads.reduce((sum, lead) => {
    if (!lead.areaSize) return sum;
    const rate = lead.packageType === "tenaga" ? 75000 : (minRate?.minPrice ?? 180000);
    return sum + lead.areaSize * rate;
  }, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan katalog, transaksi ritel, prospek jasa aplikator, dan kondisi stok."
        action={
          <Link href="/admin/produk/baru" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            Tambah produk
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Omzet produk bulan ini"
          value={formatRupiah(omzetProduk)}
          hint={`${monthOrders} pesanan masuk`}
          icon="receipt"
          tone="brand"
        />
        <StatCard
          label="Potensi pendapatan jasa"
          value={formatRupiah(potensiJasa)}
          hint={`${openLeads.length} prospek terbuka · estimasi dari tarif minimum`}
          icon="scale"
          tone="dark"
        />
        <StatCard
          label="Prospek baru"
          value={String(newLeadCount)}
          hint={`${leadCount} total prospek project brief`}
          icon="users"
        />
        <StatCard
          label="Pesanan diproses"
          value={String(pendingOrders)}
          hint={`${orderCount} pesanan sepanjang waktu`}
          icon="box"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard
          title="Pesanan terbaru"
          action={
            <Link href="/admin/pesanan" className="text-xs font-semibold text-brand-700 hover:underline">
              Kelola
            </Link>
          }
          className="lg:col-span-2"
        >
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Belum ada pesanan masuk.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                  <tr>
                    <th className="pb-2 font-semibold">No. Pesanan</th>
                    <th className="pb-2 font-semibold">Pelanggan</th>
                    <th className="pb-2 text-right font-semibold">Total</th>
                    <th className="pb-2 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2.5">
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
                      <td className="py-2.5 text-ink-700">{order.customerName}</td>
                      <td className="py-2.5 text-right font-semibold text-ink-900">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-2.5 text-right">
                        <StatusBadge value={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <div className="space-y-6">
          <AdminCard
            title="Prospek terbaru"
            action={
              <Link href="/admin/prospek" className="text-xs font-semibold text-brand-700 hover:underline">
                Kelola
              </Link>
            }
          >
            {recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-500">Belum ada prospek masuk.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {recentLeads.map((lead) => (
                  <li key={lead.id} className="rounded-xl bg-sand-50 p-3">
                    <p className="font-semibold text-ink-900">{lead.name}</p>
                    <p className="text-xs text-ink-500">
                      {lead.packageType === "tenaga" ? "Tenaga saja" : "Bundling"} &middot;{" "}
                      {lead.textureType ?? "-"}
                    </p>
                    <p className="mt-1 text-xs text-ink-400">
                      {lead.areaSize ? `${lead.areaSize} m² · ` : ""}
                      {lead.city ?? "-"} &middot; {formatDateTime(lead.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard title="Katalog" description={`${productCount} produk aktif, ${variantCount} varian`}>
            <div className="space-y-2 text-sm">
              <Link href="/admin/produk" className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-sand-50">
                <span className="text-ink-700">Kelola produk & varian</span>
                <Icon name="arrowRight" className="h-4 w-4 text-ink-400" />
              </Link>
              <Link href="/admin/harga-hpp" className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-sand-50">
                <span className="text-ink-700">Kalkulator HPP & margin</span>
                <Icon name="arrowRight" className="h-4 w-4 text-ink-400" />
              </Link>
              <Link href="/admin/tarif-jasa" className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-sand-50">
                <span className="text-ink-700">Tarif jasa aplikator</span>
                <Icon name="arrowRight" className="h-4 w-4 text-ink-400" />
              </Link>
              <Link href="/admin/landing-ab" className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-sand-50">
                <span className="text-ink-700">Uji A/B landing page</span>
                <Icon name="arrowRight" className="h-4 w-4 text-ink-400" />
              </Link>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Stok menipis" description="Varian dengan stok 10 atau kurang">
          {lowStock.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Semua stok aman.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStock.map((variant) => (
                <li
                  key={variant.id}
                  className="flex items-center justify-between rounded-xl bg-sand-50 px-3 py-2"
                >
                  <span className="text-ink-700">
                    {variant.product.name}
                    <span className="block text-xs text-ink-400">{variant.label}</span>
                  </span>
                  <span
                    className={`font-bold ${
                      variant.stock <= 5 ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {variant.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard
          title="Evaluasi HPP terakhir"
          description="Riwayat perubahan modal, kemasan, dan margin"
          action={
            <Link href="/admin/harga-hpp" className="text-xs font-semibold text-brand-700 hover:underline">
              Kelola
            </Link>
          }
        >
          {hppRecords.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Belum ada catatan HPP.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {hppRecords.map((record) => (
                <li key={record.id} className="rounded-xl bg-sand-50 px-3 py-2">
                  <p className="font-semibold text-ink-900">{record.productName}</p>
                  <p className="text-xs text-ink-500">
                    Modal {formatRupiah(record.supplierCost)} + biaya lain &rarr; target margin{" "}
                    {record.marginTarget}% &middot; {formatDateTime(record.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
