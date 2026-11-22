import { prisma } from "@/lib/prisma";
import {
  resetAbStatsAction,
  saveLandingVariantAction,
  toggleLandingVariantAction,
} from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Landing Page A/B Testing" };

export default async function AdminLandingPage() {
  const variants = await prisma.landingVariant.findMany({ orderBy: { createdAt: "asc" } });

  async function toggleVariant(formData: FormData) {
    "use server";
    await toggleLandingVariantAction(String(formData.get("id")));
  }

  async function resetStats(formData: FormData) {
    "use server";
    await resetAbStatsAction(String(formData.get("id")));
  }

  const totalViews = variants.reduce((sum, variant) => sum + variant.views, 0);
  const totalClicks = variants.reduce((sum, variant) => sum + variant.clicks, 0);
  const totalConversions = variants.reduce((sum, variant) => sum + variant.conversions, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Landing Page A/B Testing"
        description="Uji variasi headline, ajakan bertindak, dan promo bundling untuk mengukur batas kesediaan bayar pelanggan."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Total views</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-900">{totalViews}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Total klik CTA</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-900">{totalClicks}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Konversi</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-700">{totalConversions}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {variants.map((variant) => {
          const ctr = variant.views > 0 ? (variant.clicks / variant.views) * 100 : 0;
          const cvr = variant.clicks > 0 ? (variant.conversions / variant.clicks) * 100 : 0;
          return (
            <AdminCard key={variant.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink-900">{variant.name}</p>
                    <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                      Bobot {variant.trafficWeight}%
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        variant.isActive
                          ? "bg-brand-50 text-brand-700"
                          : "bg-sand-100 text-ink-500"
                      }`}
                    >
                      {variant.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{variant.headline}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-500">{variant.subheadline}</p>
                  <p className="mt-2 text-xs text-ink-500">
                    CTA: <strong className="text-ink-700">{variant.ctaText}</strong> &middot;{" "}
                    {variant.secondaryCtaText}
                  </p>
                </div>

                <div className="grid shrink-0 grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-sand-50 px-4 py-3">
                    <p className="text-xs text-ink-500">Views</p>
                    <p className="text-lg font-extrabold text-ink-900">{variant.views}</p>
                  </div>
                  <div className="rounded-xl bg-sand-50 px-4 py-3">
                    <p className="text-xs text-ink-500">CTR</p>
                    <p className="text-lg font-extrabold text-ink-900">{ctr.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-xl bg-sand-50 px-4 py-3">
                    <p className="text-xs text-ink-500">CVR</p>
                    <p className="text-lg font-extrabold text-brand-700">{cvr.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={toggleVariant}>
                  <input type="hidden" name="id" value={variant.id} />
                  <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                    {variant.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </form>
                <form action={resetStats}>
                  <input type="hidden" name="id" value={variant.id} />
                  <button type="submit" className="btn px-3 py-1.5 text-xs text-ink-600">
                    <Icon name="trend" className="h-3.5 w-3.5" />
                    Reset statistik
                  </button>
                </form>
              </div>

              <ActionForm action={saveLandingVariantAction} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={variant.id} />
                <div>
                  <label className="label">Nama varian</label>
                  <input name="name" className="input" defaultValue={variant.name} />
                </div>
                <div>
                  <label className="label">Bobot trafik (%)</label>
                  <input
                    name="trafficWeight"
                    type="number"
                    className="input"
                    defaultValue={variant.trafficWeight}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Headline</label>
                  <input name="headline" className="input" defaultValue={variant.headline} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Subheadline</label>
                  <textarea name="subheadline" rows={2} className="input" defaultValue={variant.subheadline} />
                </div>
                <div>
                  <label className="label">Teks CTA utama</label>
                  <input name="ctaText" className="input" defaultValue={variant.ctaText} />
                </div>
                <div>
                  <label className="label">Teks CTA kedua</label>
                  <input name="secondaryCtaText" className="input" defaultValue={variant.secondaryCtaText} />
                </div>
                <div>
                  <label className="label">Harga bundling</label>
                  <input name="bundlePrice" className="input" defaultValue={variant.bundlePrice} />
                </div>
                <div>
                  <label className="label">Teks promo</label>
                  <input name="promoText" className="input" defaultValue={variant.promoText} />
                </div>
                <div className="flex items-end sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" name="isActive" defaultChecked={variant.isActive} className="h-4 w-4 accent-[var(--color-brand-600)]" />
                    Varian aktif
                  </label>
                </div>
              </ActionForm>
            </AdminCard>
          );
        })}
      </div>

      <AdminCard title="Tambah varian">
        <ActionForm action={saveLandingVariantAction} className="grid gap-3 sm:grid-cols-2" submitLabel="Tambah varian">
          <div>
            <label className="label">Nama varian *</label>
            <input name="name" required className="input" placeholder="Varian C - Fokus Promo" />
          </div>
          <div>
            <label className="label">Bobot trafik (%)</label>
            <input name="trafficWeight" type="number" className="input" defaultValue={0} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Headline</label>
            <input name="headline" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Subheadline</label>
            <textarea name="subheadline" rows={2} className="input" />
          </div>
          <div>
            <label className="label">Teks CTA utama</label>
            <input name="ctaText" className="input" defaultValue="Beli Cat Tekstur" />
          </div>
          <div>
            <label className="label">Teks CTA kedua</label>
            <input name="secondaryCtaText" className="input" defaultValue="Konsultasi Jasa Aplikator" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Teks promo</label>
            <input name="promoText" className="input" />
          </div>
        </ActionForm>
      </AdminCard>
    </div>
  );
}
