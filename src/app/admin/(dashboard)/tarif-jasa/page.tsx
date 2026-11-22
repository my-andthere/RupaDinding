import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import {
  deleteServiceFactorAction,
  deleteServiceRateAction,
  deleteServiceScopeAction,
  saveServiceFactorAction,
  saveServiceRateAction,
  saveServiceScopeAction,
} from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tarif & Layanan Jasa" };

export default async function AdminServiceRatesPage() {
  const [rates, factors, scopes] = await Promise.all([
    prisma.serviceRate.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.serviceFactor.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.serviceScope.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  async function removeRate(formData: FormData) {
    "use server";
    await deleteServiceRateAction(String(formData.get("id")));
  }

  async function removeFactor(formData: FormData) {
    "use server";
    await deleteServiceFactorAction(String(formData.get("id")));
  }

  async function removeScope(formData: FormData) {
    "use server";
    await deleteServiceScopeAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tarif & Layanan Jasa Aplikator"
        description="Tarif borongan tenaga dan paket bahan + tenaga (KBLI 43303 / PB007), harga dit tampilkan sebagai “Harga Mulai Dari” dan negotiable."
      />

      <AdminCard title="Tarif layanan" description="Tampil di tabel tarif pada halaman layanan.">
        <div className="space-y-4">
          {rates.map((rate) => (
            <div key={rate.id} className="rounded-xl border border-sand-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900">
                    {rate.name}{" "}
                    <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                      {rate.category === "tenaga" ? "Borongan tenaga" : "Paket bahan + tenaga"}
                    </span>
                  </p>
                  <p className="text-xs text-ink-500">
                    {formatRupiah(rate.minPrice)} - {formatRupiah(rate.maxPrice)} / m&sup2; &middot;{" "}
                    {rate.motif}
                  </p>
                </div>
                <form action={removeRate}>
                  <input type="hidden" name="id" value={rate.id} />
                  <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
              <ActionForm action={saveServiceRateAction} className="mt-3 grid gap-3 sm:grid-cols-4">
                <input type="hidden" name="id" value={rate.id} />
                <div className="sm:col-span-2">
                  <label className="label">Nama</label>
                  <input name="name" className="input" defaultValue={rate.name} />
                </div>
                <div>
                  <label className="label">Kategori</label>
                  <select name="category" className="input" defaultValue={rate.category}>
                    <option value="tenaga">Borongan tenaga</option>
                    <option value="paket">Paket bahan + tenaga</option>
                  </select>
                </div>
                <div>
                  <label className="label">Motif</label>
                  <input name="motif" className="input" defaultValue={rate.motif} />
                </div>
                <div>
                  <label className="label">Min / m&sup2;</label>
                  <input name="minPrice" type="number" className="input" defaultValue={rate.minPrice} />
                </div>
                <div>
                  <label className="label">Maks / m&sup2;</label>
                  <input name="maxPrice" type="number" className="input" defaultValue={rate.maxPrice} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Deskripsi</label>
                  <input name="description" className="input" defaultValue={rate.description} />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="negotiable" defaultChecked={rate.negotiable} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Negotiable
                  </label>
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isActive" defaultChecked={rate.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Aktif
                  </label>
                  <div className="w-24">
                    <label className="label">Urutan</label>
                    <input name="sortOrder" type="number" className="input" defaultValue={rate.sortOrder} />
                  </div>
                </div>
              </ActionForm>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
            <p className="font-semibold text-ink-900">Tambah tarif</p>
            <ActionForm action={saveServiceRateAction} className="mt-3 grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="label">Nama layanan *</label>
                <input name="name" required className="input" placeholder="Jasa Cat Tekstur Batu" />
              </div>
              <div>
                <label className="label">Kategori</label>
                <select name="category" className="input" defaultValue="paket">
                  <option value="tenaga">Borongan tenaga</option>
                  <option value="paket">Paket bahan + tenaga</option>
                </select>
              </div>
              <div>
                <label className="label">Motif</label>
                <input name="motif" className="input" />
              </div>
              <div>
                <label className="label">Min / m&sup2;</label>
                <input name="minPrice" type="number" className="input" />
              </div>
              <div>
                <label className="label">Maks / m&sup2;</label>
                <input name="maxPrice" type="number" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Deskripsi</label>
                <input name="description" className="input" />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-xs text-ink-700">
                  <input type="checkbox" name="negotiable" defaultChecked className="h-4 w-4 accent-[var(--color-brand-600)]" />
                  Negotiable
                </label>
                <label className="flex items-center gap-2 text-xs text-ink-700">
                  <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 accent-[var(--color-brand-600)]" />
                  Aktif
                </label>
                <div className="w-24">
                  <label className="label">Urutan</label>
                  <input name="sortOrder" type="number" className="input" defaultValue={rates.length + 1} />
                </div>
              </div>
            </ActionForm>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Faktor penentu harga" description="Enam variabel yang menjelaskan mengapa harga final berbeda.">
        <div className="space-y-3">
          {factors.map((factor) => (
            <div key={factor.id} className="rounded-xl border border-sand-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{factor.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{factor.description}</p>
                </div>
                <form action={removeFactor}>
                  <input type="hidden" name="id" value={factor.id} />
                  <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
              <ActionForm action={saveServiceFactorAction} className="mt-3 grid gap-3 sm:grid-cols-4">
                <input type="hidden" name="id" value={factor.id} />
                <div className="sm:col-span-2">
                  <label className="label">Judul</label>
                  <input name="title" className="input" defaultValue={factor.title} />
                </div>
                <div>
                  <label className="label">Ikon</label>
                  <input name="icon" className="input" defaultValue={factor.icon} />
                </div>
                <div>
                  <label className="label">Urutan</label>
                  <input name="sortOrder" type="number" className="input" defaultValue={factor.sortOrder} />
                </div>
                <div className="sm:col-span-3">
                  <label className="label">Deskripsi</label>
                  <input name="description" className="input" defaultValue={factor.description} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isActive" defaultChecked={factor.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Aktif
                  </label>
                </div>
              </ActionForm>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
            <p className="font-semibold text-ink-900">Tambah faktor</p>
            <ActionForm action={saveServiceFactorAction} className="mt-3 grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="label">Judul *</label>
                <input name="title" required className="input" />
              </div>
              <div>
                <label className="label">Ikon</label>
                <input name="icon" className="input" defaultValue="info" />
              </div>
              <div>
                <label className="label">Urutan</label>
                <input name="sortOrder" type="number" className="input" defaultValue={factors.length + 1} />
              </div>
              <div className="sm:col-span-4">
                <label className="label">Deskripsi</label>
                <input name="description" className="input" />
              </div>
            </ActionForm>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Cakupan area" description="Bidang pekerjaan yang dilayani (dinding, plafon, fasad - di luar atap).">
        <div className="space-y-3">
          {scopes.map((scope) => (
            <div key={scope.id} className="rounded-xl border border-sand-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{scope.name}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{scope.description}</p>
                </div>
                <form action={removeScope}>
                  <input type="hidden" name="id" value={scope.id} />
                  <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
              <ActionForm action={saveServiceScopeAction} className="mt-3 grid gap-3 sm:grid-cols-4">
                <input type="hidden" name="id" value={scope.id} />
                <div className="sm:col-span-2">
                  <label className="label">Nama</label>
                  <input name="name" className="input" defaultValue={scope.name} />
                </div>
                <div>
                  <label className="label">Ikon</label>
                  <input name="icon" className="input" defaultValue={scope.icon} />
                </div>
                <div>
                  <label className="label">Urutan</label>
                  <input name="sortOrder" type="number" className="input" defaultValue={scope.sortOrder} />
                </div>
                <div className="sm:col-span-3">
                  <label className="label">Deskripsi</label>
                  <input name="description" className="input" defaultValue={scope.description} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isActive" defaultChecked={scope.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Aktif
                  </label>
                </div>
              </ActionForm>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4">
            <p className="font-semibold text-ink-900">Tambah cakupan area</p>
            <ActionForm action={saveServiceScopeAction} className="mt-3 grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="label">Nama *</label>
                <input name="name" required className="input" />
              </div>
              <div>
                <label className="label">Ikon</label>
                <input name="icon" className="input" defaultValue="paint" />
              </div>
              <div>
                <label className="label">Urutan</label>
                <input name="sortOrder" type="number" className="input" defaultValue={scopes.length + 1} />
              </div>
              <div className="sm:col-span-4">
                <label className="label">Deskripsi</label>
                <input name="description" className="input" />
              </div>
            </ActionForm>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
