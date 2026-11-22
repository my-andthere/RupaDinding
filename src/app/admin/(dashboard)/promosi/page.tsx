import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deletePromoAction, savePromoAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Promo & Harga Coret" };

export default async function AdminPromoPage() {
  const promos = await prisma.promo.findMany({ orderBy: { createdAt: "desc" } });

  async function removePromo(formData: FormData) {
    "use server";
    await deletePromoAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promo & Harga Coret"
        description="Atur diskon persentase, harga coret, dan subsidi ongkos kirim tanpa mengubah HPP produk."
      />

      <AdminCard title="Promo aktif" description="Promo otomatis berlaku pada rentang tanggal yang ditentukan.">
        {promos.length === 0 ? (
          <EmptyState title="Belum ada promo" description="Tambahkan promo untuk kebutuhan kampanye seperti 11.11 atau 12.12." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="pb-2 font-semibold">Nama</th>
                  <th className="pb-2 font-semibold">Diskon</th>
                  <th className="pb-2 font-semibold">Periode</th>
                  <th className="pb-2 font-semibold">Ongkir</th>
                  <th className="pb-2 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {promos.map((promo) => (
                  <tr key={promo.id}>
                    <td className="py-3">
                      <p className="font-semibold text-ink-900">{promo.name}</p>
                      <StatusBadge value={promo.isActive ? "published" : "draft"} />
                    </td>
                    <td className="py-3 text-ink-700">
                      {promo.type === "percent" ? `${promo.value}%` : `Rp ${promo.value}`}
                    </td>
                    <td className="py-3 text-xs text-ink-500">
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </td>
                    <td className="py-3 text-xs text-ink-500">
                      {promo.freeShipping ? "Gratis ongkir" : "-"}
                    </td>
                    <td className="py-3 text-right">
                      <form action={removePromo}>
                        <input type="hidden" name="id" value={promo.id} />
                        <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                          <Icon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard title="Tambah promo" description="Diskon diterapkan otomatis ke harga produk pada katalog.">
        <ActionForm action={savePromoAction} className="grid gap-4 sm:grid-cols-3" submitLabel="Simpan promo">
          <div className="sm:col-span-2">
            <label className="label">Nama promo *</label>
            <input name="name" required className="input" placeholder="Flash Sale 11.11 - 12.12" />
          </div>
          <div>
            <label className="label">Jenis</label>
            <select name="type" className="input" defaultValue="percent">
              <option value="percent">Persentase (%)</option>
              <option value="fixed">Nominal (Rp)</option>
            </select>
          </div>
          <div>
            <label className="label">Nilai diskon</label>
            <input name="value" type="number" className="input" defaultValue={10} />
          </div>
          <div>
            <label className="label">Mulai</label>
            <input name="startDate" type="date" className="input" />
          </div>
          <div>
            <label className="label">Berakhir</label>
            <input name="endDate" type="date" className="input" />
          </div>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" name="freeShipping" className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Subsid ongkir
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Aktif
            </label>
          </div>
        </ActionForm>
      </AdminCard>
    </div>
  );
}
