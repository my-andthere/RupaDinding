import { prisma } from "@/lib/prisma";
import { deleteGalleryItemAction, saveGalleryItemAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader, EmptyState } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Galeri Portofolio" };

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });

  async function removeItem(formData: FormData) {
    "use server";
    await deleteGalleryItemAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Galeri Portofolio"
        description="Unggah dokumentasi before-after setiap motif untuk membangun kepercayaan calon klien."
      />

      {items.length === 0 ? (
        <EmptyState title="Belum ada item galeri" description="Tambahkan proyek pertama yang Anda dokumentasikan." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <AdminCard key={item.id}>
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-xl border border-sand-200 bg-sand-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.beforeImage || "/images/galeri/generic-before.svg"}
                    alt={item.title}
                    className="h-32 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-xl border border-sand-200 bg-sand-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.afterImage || "/images/galeri/generic-after.svg"}
                    alt={item.title}
                    className="h-32 w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink-900">{item.title}</p>
                  <p className="text-xs text-ink-500">
                    {item.motif} &middot; {item.category} &middot; {item.location ?? "-"}
                  </p>
                </div>
                <form action={removeItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              <ActionForm action={saveGalleryItemAction} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <div className="sm:col-span-2">
                  <label className="label">Judul proyek</label>
                  <input name="title" className="input" defaultValue={item.title} />
                </div>
                <div>
                  <label className="label">Motif</label>
                  <input name="motif" className="input" defaultValue={item.motif} />
                </div>
                <div>
                  <label className="label">Kategori</label>
                  <input name="category" className="input" defaultValue={item.category} />
                </div>
                <div>
                  <label className="label">Lokasi</label>
                  <input name="location" className="input" defaultValue={item.location ?? ""} />
                </div>
                <div>
                  <label className="label">Jenis proyek</label>
                  <input name="projectType" className="input" defaultValue={item.projectType ?? ""} />
                </div>
                <div>
                  <label className="label">Luas area (m&sup2;)</label>
                  <input name="areaSize" type="number" className="input" defaultValue={item.areaSize ?? 0} />
                </div>
                <div>
                  <label className="label">Gambar sebelum</label>
                  <input name="beforeImage" className="input" defaultValue={item.beforeImage ?? ""} />
                </div>
                <div>
                  <label className="label">Gambar sesudah</label>
                  <input name="afterImage" className="input" defaultValue={item.afterImage ?? ""} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Deskripsi</label>
                  <textarea name="description" rows={3} className="input" defaultValue={item.description} />
                </div>
                <div className="flex items-end gap-5 sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Unggulan
                  </label>
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isActive" defaultChecked={item.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Aktif
                  </label>
                  <div className="w-24">
                    <label className="label">Urutan</label>
                    <input name="sortOrder" type="number" className="input" defaultValue={item.sortOrder} />
                  </div>
                </div>
              </ActionForm>
            </AdminCard>
          ))}
        </div>
      )}

      <AdminCard title="Tambah item galeri">
        <ActionForm action={saveGalleryItemAction} className="grid gap-4 sm:grid-cols-3" submitLabel="Tambah galeri">
          <div className="sm:col-span-2">
            <label className="label">Judul proyek *</label>
            <input name="title" required className="input" />
          </div>
          <div>
            <label className="label">Motif</label>
            <input name="motif" className="input" />
          </div>
          <div>
            <label className="label">Kategori</label>
            <input name="category" className="input" />
          </div>
          <div>
            <label className="label">Lokasi</label>
            <input name="location" className="input" />
          </div>
          <div>
            <label className="label">Jenis proyek</label>
            <input name="projectType" className="input" />
          </div>
          <div>
            <label className="label">Luas area (m&sup2;)</label>
            <input name="areaSize" type="number" className="input" />
          </div>
          <div>
            <label className="label">Gambar sebelum</label>
            <input name="beforeImage" className="input" placeholder="/images/galeri/..." />
          </div>
          <div>
            <label className="label">Gambar sesudah</label>
            <input name="afterImage" className="input" placeholder="/images/galeri/..." />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Deskripsi</label>
            <textarea name="description" rows={3} className="input" />
          </div>
          <div className="flex items-end gap-5 sm:col-span-3">
            <label className="flex items-center gap-2 text-xs text-ink-700">
              <input type="checkbox" name="isFeatured" className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Unggulan
            </label>
            <label className="flex items-center gap-2 text-xs text-ink-700">
              <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 accent-[var(--color-brand-600)]" />
              Aktif
            </label>
            <div className="w-24">
              <label className="label">Urutan</label>
              <input name="sortOrder" type="number" className="input" defaultValue={items.length + 1} />
            </div>
          </div>
        </ActionForm>
      </AdminCard>
    </div>
  );
}
