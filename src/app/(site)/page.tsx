import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getFeaturedProducts } from "@/lib/catalog";
import { pickVariantByWeight } from "@/lib/ab";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatRupiah, parseList } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AbTracker } from "@/components/site/AbTracker";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();
  const store = await cookies();
  const visitorId = store.get("rd_vid")?.value ?? Math.random().toString(36).slice(2);

  const variants = await prisma.landingVariant.findMany({ where: { isActive: true } });
  const variant = pickVariantByWeight(visitorId, variants);
  if (variant) {
    await prisma.landingVariant
      .update({ where: { slug: variant.slug }, data: { views: { increment: 1 } } })
      .catch(() => undefined);
  }

  const featured = await getFeaturedProducts(3);
  const serviceRates = await prisma.serviceRate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  const gallery = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take: 3,
  });
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  const scopes = await prisma.serviceScope.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const servicePoints = parseList(settings["trust.servicePoints"]);
  const waLink = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    "Halo RupaDinding, saya ingin konsultasi gratis untuk kebutuhan cat tekstur / jasa aplikator.",
  );
  const heroHeadline = variant?.headline || settings["company.heroHeadline"];
  const heroSub = variant?.subheadline || settings["company.heroSubheadline"];
  const heroCta = variant?.ctaText || "Beli Cat Tekstur";
  const heroSecondary = variant?.secondaryCtaText || "Konsultasi Jasa Aplikator";
  const heroPromo = variant?.promoText || settings["store.cartNote"];

  return (
    <div>
      {variant ? <AbTracker slug={variant.slug} /> : null}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-100 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-page relative py-14 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">
                <Icon name="sparkle" className="h-3.5 w-3.5" />
                Merek cat tekstur PT Mitra Dinding Utama
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                {heroHeadline}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
                {heroSub}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/produk" className="btn-primary px-6 py-3 text-base">
                  {heroCta}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link href="/layanan" className="btn-secondary px-6 py-3 text-base">
                  {heroSecondary}
                </Link>
              </div>

              {heroPromo ? (
                <p className="mt-5 flex items-start gap-2 text-sm text-ink-500">
                  <Icon name="tag" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {heroPromo}
                </p>
              ) : null}

              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {servicePoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white/70 px-3 py-2 text-xs font-semibold text-ink-700"
                  >
                    <Icon name="check" className="h-4 w-4 shrink-0 text-brand-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-tekstur.svg"
                  alt="Contoh hasil aplikasi cat tekstur RupaDinding pada dinding"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-sand-200 bg-white p-4 shadow-card sm:block">
                <p className="text-xs text-ink-500">Kebutuhan 30 m&sup2; kamprot</p>
                <p className="text-lg font-extrabold text-ink-900">27,5 kg</p>
                <p className="text-[11px] text-ink-400">Termasuk cadangan 10%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk unggulan */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Katalog produk"
          title="Cat tekstur siap pakai, harga seragam per kemasan"
          description="Pilih motif, hitung kebutuhan lewat kalkulator, lalu pesan langsung tanpa Minimum order ritel."
          action={
            <Link href="/produk" className="btn-secondary">
              Lihat semua produk
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Kalkulator CTA */}
      <section className="border-y border-sand-200 bg-white">
        <div className="container-page grid items-center gap-8 py-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Icon name="calculator" className="h-3.5 w-3.5" />
              Kalkulator kebutuhan cat
            </span>
            <h2 className="mt-4 section-title">Berapa cat yang Anda butuhkan?</h2>
            <p className="mt-3 text-ink-600">
              Masukkan panjang dan tinggi dinding, pilih jenis tekstur, dan sistem langsung menghitung
              kebutuhan dasar plus cadangan 10%, lalu susun kombinasi kemasan 1 kg, 5 kg, dan pail 25 kg
              yang pas untuk keranjang belanja Anda.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-600">
              {[
                "Rumus sama dengan yang dipakai aplikator lapangan",
                "Rekomendasi kombinasi kemasan siap pakai",
                "Bisa diteruskan ke formulir penawaran jasa (bundling)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/kalkulator" className="btn-primary mt-7">
              <Icon name="calculator" className="h-4 w-4" />
              Buka kalkulator
            </Link>
          </div>
          <div className="card bg-sand-100 p-6">
            <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">
              Contoh perhitungan
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between rounded-xl bg-white px-4 py-3">
                <span className="text-ink-600">Luas dinding 30 m&sup2;</span>
                <span className="font-bold text-ink-900">30 m&sup2;</span>
              </div>
              <div className="flex justify-between rounded-xl bg-white px-4 py-3">
                <span className="text-ink-600">Daya sebar kamprot</span>
                <span className="font-bold text-ink-900">1,2 m&sup2;/kg</span>
              </div>
              <div className="flex justify-between rounded-xl bg-white px-4 py-3">
                <span className="text-ink-600">Kebutuhan dasar</span>
                <span className="font-bold text-ink-900">25 kg</span>
              </div>
              <div className="flex justify-between rounded-xl bg-brand-600 px-4 py-3 text-white">
                <span>Total dengan cadangan 10%</span>
                <span className="font-extrabold">27,5 kg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Layanan jasa aplikator"
          title="Harga mulai dari, penentuannya jelas"
          description={
            'Tarif di bawah adalah acuan "Harga Mulai Dari" dan bersifat negotiable. Survei gratis untuk memastikan harga final proyek Anda.'
          }
          action={
            <Link href="/layanan" className="btn-secondary">
              Detail layanan & tarif
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card overflow-hidden">
            <div className="border-b border-sand-200 bg-sand-100 px-5 py-4">
              <h3 className="font-bold text-ink-900">Borongan tenaga kerja</h3>
              <p className="text-xs text-ink-500">Di luar harga material cat</p>
            </div>
            <ul className="divide-y divide-sand-200">
              {serviceRates
                .filter((rate) => rate.category === "tenaga")
                .map((rate) => (
                  <li key={rate.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-ink-800">{rate.name}</span>
                      <span className="shrink-0 text-sm font-bold text-brand-700">
                        {formatRupiah(rate.minPrice)}&ndash;{formatRupiah(rate.maxPrice)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">{rate.description}</p>
                  </li>
                ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-sand-200 bg-brand-50 px-5 py-4">
              <h3 className="font-bold text-ink-900">Paket bahan + tenaga</h3>
              <p className="text-xs text-brand-700">Harga sudah termasuk material RupaDinding</p>
            </div>
            <ul className="divide-y divide-sand-200">
              {serviceRates
                .filter((rate) => rate.category === "paket")
                .map((rate) => (
                  <li key={rate.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-ink-800">{rate.name}</span>
                      <span className="shrink-0 text-sm font-bold text-brand-700">
                        {formatRupiah(rate.minPrice)}&ndash;{formatRupiah(rate.maxPrice)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">{rate.description}</p>
                  </li>
                ))}
            </ul>
          </div>

          <div className="card bg-ink-950 p-6 text-ink-100">
            <h3 className="text-lg font-bold text-white">Cakupan pekerjaan</h3>
            <ul className="mt-4 space-y-3">
              {scopes.map((scope) => (
                <li key={scope.id} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-brand-300">
                    <Icon name={scope.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{scope.name}</span>
                    <span className="block text-xs text-ink-300">{scope.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-ink-900 p-3 text-xs leading-relaxed text-ink-300">
              {settings["compliance.serviceScope"]}
            </p>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full">
              <Icon name="whatsapp" className="h-4 w-4" />
              Minta survei gratis
            </a>
          </div>
        </div>
      </section>

      {/* Galeri */}
      {gallery.length > 0 ? (
        <section className="border-y border-sand-200 bg-white py-16">
          <div className="container-page">
            <SectionHeading
              eyebrow="Portofolio"
              title="Hasil kerja di lapangan"
              description="Dokumentasi before-after proyek hunian dan komersial yang dikerjakan tim aplikator kami."
              action={
                <Link href="/galeri" className="btn-secondary">
                  Lihat galeri
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <Link
                  key={item.id}
                  href="/galeri"
                  className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="grid grid-cols-2 gap-px bg-sand-200">
                    <div className="bg-sand-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.beforeImage || "/images/galeri/generic-before.svg"}
                        alt={`Sebelum - ${item.title}`}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                    <div className="bg-sand-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.afterImage || "/images/galeri/generic-after.svg"}
                        alt={`Sesudah - ${item.title}`}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                      {item.motif}
                    </p>
                    <h3 className="mt-1.5 text-base font-bold text-ink-900">{item.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Blog */}
      {posts.length > 0 ? (
        <section className="container-page py-16">
          <SectionHeading
            eyebrow="Blog & panduan"
            title="Edukasi teknis untuk renovasi Anda"
            action={
              <Link href="/blog" className="btn-secondary">
                Semua artikel
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-sand-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage || "/images/blog/default.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-ink-400">{post.tags}</p>
                  <h3 className="mt-2 text-base font-bold text-ink-900 group-hover:text-brand-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container-page pb-4">
        <div className="overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
           Butuh estimasi harga untuk dinding Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-50">
            Kirim spesifikasi proyek lewat WhatsApp, tim kami akan melakukan survei gratis dan menyusun
            penawaran harga final beserta jadwal pengerjaan.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink} target="_blank" rel="noreferrer" className="btn bg-white text-brand-700">
              <Icon name="whatsapp" className="h-4 w-4" />
              Konsultasi gratis
            </a>
            <Link href="/kontak" className="btn border border-white/40 text-white hover:bg-white/10">
              <Icon name="map" className="h-4 w-4" />
              Lihat toko & kantor kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
