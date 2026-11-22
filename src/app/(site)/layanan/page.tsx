import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { ProjectBriefForm } from "@/components/services/ProjectBriefForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Layanan Jasa Aplikator Cat Tekstur",
  description:
    "Jasa aplikator cat tekstur untuk interior, eksterior, plafon, dan permukaan khusus. Tarif borongan tenaga kerja dan paket bahan + tenaga, harga mulai dari dan negotiable.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; motif?: string; produk?: string; bundling?: string }>;
}) {
  const params = await searchParams;
  const [settings, rates, factors, scopes, products] = await Promise.all([
    getSettings(),
    prisma.serviceRate.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.serviceFactor.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.serviceScope.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, category: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const servicePoints = (settings["trust.servicePoints"] || "").split("|").filter(Boolean);
  const textureOptions = Array.from(
    new Set([...products.map((p) => p.category), ...rates.map((r) => r.motif)]),
  );

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Layanan Jasa" }]} />

      <div className="mt-5 max-w-3xl">
        <span className="eyebrow">
          <Icon name="scale" className="h-3.5 w-3.5" />
          Jasa aplikator (KBLI 43303 - PB007)
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Jasa Aplikator Cat Tekstur
        </h1>
        <p className="mt-3 text-ink-600">
          Harga proyek bergantung kondisi lapangan, sehingga kami menampilkan tarif{" "}
          <strong className="text-ink-800">&quot;Harga Mulai Dari&quot;</strong> yang bersifat negotiable.
          Survei gratis untuk memastikan harga final dan jadwal pengerjaan.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {servicePoints.map((point) => (
            <li
              key={point}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-sand-200"
            >
              <Icon name="check" className="h-3.5 w-3.5 text-brand-600" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Tabel tarif */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-sand-200 bg-sand-100 px-6 py-4">
            <h2 className="text-lg font-bold text-ink-900">Borongan tenaga kerja</h2>
            <p className="text-xs text-ink-500">Tarif tenaga aplikator saja, material cat terpisah</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sand-50 text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Jenis pekerjaan</th>
                  <th className="px-6 py-3 text-right font-semibold">Tarif / m&sup2;</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {rates
                  .filter((rate) => rate.category === "tenaga")
                  .map((rate) => (
                    <tr key={rate.id}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-ink-900">{rate.name}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{rate.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-brand-700">
                          {formatRupiah(rate.minPrice)}&ndash;{formatRupiah(rate.maxPrice)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-400">Mulai dari</p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-sand-200 bg-brand-50 px-6 py-4">
            <h2 className="text-lg font-bold text-ink-900">Paket bahan + tenaga</h2>
            <p className="text-xs text-brand-700">Material RupaDinding sudah termasuk dalam tarif</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sand-50 text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Motif</th>
                  <th className="px-6 py-3 text-right font-semibold">Tarif / m&sup2;</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {rates
                  .filter((rate) => rate.category === "paket")
                  .map((rate) => (
                    <tr key={rate.id}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-ink-900">{rate.name}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{rate.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-brand-700">
                          {formatRupiah(rate.minPrice)}&ndash;{formatRupiah(rate.maxPrice)}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-ink-500">Negotiable</p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Penentu harga */}
      <section className="mt-12">
        <h2 className="section-title">Enam variabel penentu harga final</h2>
        <p className="mt-2 max-w-3xl text-ink-600">
          Hal ini kami sampaikan sebelum survei agar ekspektasi biaya sudah selaras sejak awal.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {factors.map((factor) => (
            <div key={factor.id} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={factor.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-bold text-ink-900">{factor.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{factor.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cakupan */}
      <section className="mt-12">
        <h2 className="section-title">Cakupan area pengerjaan</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scopes.map((scope) => (
            <div key={scope.id} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-brand-300">
                <Icon name={scope.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-bold text-ink-900">{scope.name}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{scope.description}</p>
            </div>
          ))}
        </div>
        <p className="card mt-4 border-l-4 border-l-brand-500 bg-sand-100 p-4 text-sm text-ink-600">
          {settings["compliance.serviceScope"]}
        </p>
      </section>

      {/* Project brief */}
      <section className="mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <Icon name="fileText" className="h-3.5 w-3.5" />
              Project Brief Generator
            </span>
            <h2 className="mt-3 section-title">Kirim spesifikasi proyek Anda</h2>
            <p className="mt-2 text-ink-600">
              Isi formulir singkat, cek live preview pesan, lalu kirim langsung ke WhatsApp tim kami.
              Tidak perlu membuat akun.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <ProjectBriefForm
            whatsappNumber={settings["contact.whatsapp"]}
            textureOptions={textureOptions}
            initialArea={params.area}
            initialMotif={params.motif ?? params.produk}
            initialPackage={params.bundling === "1" ? "paket" : "tenaga"}
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="card bg-ink-950 p-6 text-ink-100 sm:p-8">
          <h2 className="text-xl font-bold text-white">Sertifikasi & garansi</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">{settings["trust.skk"]}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{settings["trust.warranty"]}</p>
          <Link href="/galeri" className="btn mt-5 border border-ink-700 bg-ink-900 text-ink-100 hover:border-brand-500">
            <Icon name="image" className="h-4 w-4" />
            Lihat portofolio hasil kerja
          </Link>
        </div>
      </section>
    </div>
  );
}
