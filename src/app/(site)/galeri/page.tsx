import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { buildGalleryInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatNumber } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri Portofolio & Studi Kasus Proyek",
  description:
    "Dokumentasi before-after hasil aplikasi cat tekstur RupaDinding untuk proyek hunian dan komersial, lengkap dengan studi kasus proyek.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ motif?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();
  const items = await prisma.galleryItem.findMany({
    where: { isActive: true, ...(params.motif ? { motif: params.motif } : {}) },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });
  const motifs = await prisma.galleryItem.findMany({
    where: { isActive: true },
    select: { motif: true },
    distinct: ["motif"],
    orderBy: { motif: "asc" },
  });

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Galeri" }]} />

      <div className="mt-5 max-w-3xl">
        <span className="eyebrow">
          <Icon name="image" className="h-3.5 w-3.5" />
          Portofolio
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Galeri Hasil Kerja
        </h1>
        <p className="mt-3 text-ink-600">
          Setiap proyek punya cerita sendiri. Pilih motif yang mirip dengan kebutuhan Anda, lalu minta
          penawaran untuk penerapan motif serupa.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/galeri"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !params.motif
              ? "bg-ink-900 text-white"
              : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
          }`}
        >
          Semua motif
        </Link>
        {motifs.map((motif) => (
          <Link
            key={motif.motif}
            href={`/galeri?motif=${encodeURIComponent(motif.motif)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              params.motif === motif.motif
                ? "bg-ink-900 text-white"
                : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {motif.motif}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {items.map((item) => {
          const waLink = buildWhatsAppUrl(
            settings["contact.whatsapp"],
            buildGalleryInquiryMessage(item.motif, item.title),
          );
          return (
            <article key={item.id} className="card overflow-hidden">
              <div className="grid gap-px bg-sand-200 md:grid-cols-2">
                <figure className="relative bg-sand-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.beforeImage || "/images/galeri/generic-before.svg"}
                    alt={`Sebelum - ${item.title}`}
                    className="h-64 w-full object-cover md:h-80"
                  />
                  <figcaption className="absolute top-3 left-3 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-semibold text-white">
                    Sebelum
                  </figcaption>
                </figure>
                <figure className="relative bg-sand-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.afterImage || "/images/galeri/generic-after.svg"}
                    alt={`Sesudah - ${item.title}`}
                    className="h-64 w-full object-cover md:h-80"
                  />
                  <figcaption className="absolute top-3 left-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Sesudah
                  </figcaption>
                </figure>
              </div>

              <div className="grid gap-4 p-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      {item.motif}
                    </span>
                    {item.category ? (
                      <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-600">
                        {item.category}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-ink-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </div>
                <div className="space-y-3">
                  <dl className="space-y-2 text-sm">
                    {item.projectType ? (
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-500">Jenis proyek</dt>
                        <dd className="font-semibold text-ink-900">{item.projectType}</dd>
                      </div>
                    ) : null}
                    {item.location ? (
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-500">Lokasi</dt>
                        <dd className="font-semibold text-ink-900">{item.location}</dd>
                      </div>
                    ) : null}
                    {item.areaSize ? (
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-500">Luas area</dt>
                        <dd className="font-semibold text-ink-900">{formatNumber(item.areaSize)} m&sup2;</dd>
                      </div>
                    ) : null}
                  </dl>
                  <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary w-full">
                    <Icon name="whatsapp" className="h-4 w-4" />
                    Minta penawaran motif serupa
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-ink-600">Belum ada galeri untuk motif ini.</div>
      ) : null}
    </div>
  );
}
