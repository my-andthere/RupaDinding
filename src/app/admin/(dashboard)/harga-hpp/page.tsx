import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { calculateHpp, calculateSellingPrice } from "@/lib/calculator";
import { deleteHppRecordAction } from "@/app/actions/admin";
import { HppCalculator } from "@/components/admin/HppCalculator";
import { AdminCard, AdminPageHeader, EmptyState } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "HPP & Margin" };

export default async function AdminHppPage() {
  const [records, variants] = await Promise.all([
    prisma.hppRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.productVariant.findMany({
      include: { product: true },
      orderBy: [{ product: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
  ]);

  async function removeRecord(formData: FormData) {
    "use server";
    await deleteHppRecordAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kalkulator HPP & Margin"
        description="Hitung HPP private label, tetapkan harga jual agar margin bersih riil tercapai, dan simulasikan beban kanal digital (marketplace, iklan, subsidi ongkir)."
      />

      <HppCalculator
        variants={variants.map((variant) => ({
          id: variant.id,
          label: variant.label,
          productName: variant.product.name,
        }))}
      />

      <AdminCard
        title="Riwayat HPP"
        description="Evaluasi berkala setiap ada perubahan harga material, ongkir, atau tarif komisi platform."
      >
        {records.length === 0 ? (
          <EmptyState title="Belum ada catatan HPP" description="Hitung dan simpan HPP dari kalkulator di atas." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="pb-2 font-semibold">Produk</th>
                  <th className="pb-2 text-right font-semibold">Modal</th>
                  <th className="pb-2 text-right font-semibold">Biaya lain</th>
                  <th className="pb-2 text-right font-semibold">HPP/unit</th>
                  <th className="pb-2 text-right font-semibold">Saran harga</th>
                  <th className="pb-2 text-right font-semibold">Target margin</th>
                  <th className="pb-2 text-right font-semibold">Dicatat</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {records.map((record) => {
                  const hpp = calculateHpp({
                    modalCatPemasok: record.supplierCost,
                    ongkirPemasok: record.shippingCost,
                    kemasanLabel: record.packagingCost,
                    tenagaKerja: record.laborCost,
                    overhead: record.overhead,
                    jumlahUnitKemasan: record.unitsPerBatch,
                  });
                  const suggestion = calculateSellingPrice(hpp, record.marginTarget / 100);
                  const biayaLain =
                    record.shippingCost + record.packagingCost + record.laborCost + record.overhead;
                  return (
                    <tr key={record.id}>
                      <td className="py-3">
                        <p className="font-semibold text-ink-900">{record.productName}</p>
                        {record.notes ? (
                          <p className="text-xs text-ink-500">{record.notes}</p>
                        ) : null}
                      </td>
                      <td className="py-3 text-right text-ink-700">
                        {formatRupiah(record.supplierCost)}
                      </td>
                      <td className="py-3 text-right text-ink-700">{formatRupiah(biayaLain)}</td>
                      <td className="py-3 text-right font-semibold text-ink-900">{formatRupiah(hpp)}</td>
                      <td className="py-3 text-right font-semibold text-brand-700">
                        {formatRupiah(suggestion)}
                      </td>
                      <td className="py-3 text-right text-ink-600">{record.marginTarget}%</td>
                      <td className="py-3 text-right text-xs text-ink-500">
                        {formatDateTime(record.createdAt)}
                      </td>
                      <td className="py-3 text-right">
                        <form action={removeRecord}>
                          <input type="hidden" name="id" value={record.id} />
                          <button
                            type="submit"
                            className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard title="Catatan perhitungan" description="Rumus yang dipakai di panel ini">
        <ul className="space-y-2 text-sm text-ink-600">
          <li className="rounded-xl bg-sand-50 p-3">
            HPP per unit = (modal cat + ongkir + kemasan & label + tenaga kerja + overhead) / jumlah unit
            kemasan
          </li>
          <li className="rounded-xl bg-sand-50 p-3">
            Harga jual dasar = HPP per unit / (1 - target margin bersih), bukan HPP + markup
          </li>
          <li className="rounded-xl bg-sand-50 p-3">
            Simulasi kanal: komisi marketplace 1-5%, alokasi iklan 5-15%, dan subsidi ongkir pennies
          </li>
        </ul>
      </AdminCard>
    </div>
  );
}
