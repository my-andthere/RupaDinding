import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductBySlug } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { buildProductInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { parseJsonArray, formatNumber } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { AddToCartForm } from "@/components/catalog/AddToCartForm";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Calculator } from "@/components/calculator/Calculator";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: `${product.tagline}. Daya sebar ${product.coverageRate} m2/kg. Beli cat tekstur RupaDinding online.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const settings = await getSettings();
  const features = parseJsonArray(product.features);
  const areas = parseJsonArray(product.applicationAreas);
  const related = await prisma.product.findMany({
    where: { isActive: true, id: { not: product.id } },
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  const waLink = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    buildProductInquiryMessage(product.name, product.variants[0]?.label),
  );

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Beranda" },
          { href: "/produk", label: "Produk" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border border-sand-200 bg-sand-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image || "/images/produk/default.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Daya sebar", value: `${product.coverageRate} m²/kg` },
              { label: "Tingkat tekstur", value: product.textureLevel },
              { label: "Bahan dasar", value: product.baseMaterial },
            ].map((item) => (
              <div key={item.label} className="card p-4">
                <p className="text-xs text-ink-400">{item.label}</p>
                <p className="mt-1 text-sm font-bold text-ink-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{product.category}</span>
            {product.isFeatured ? (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
                Unggulan
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">{product.name}</h1>
          <p className="mt-2 text-ink-600">{product.tagline}</p>
          <div className="prose-rd mt-4 text-sm">
            <p>{product.description}</p>
          </div>

          {features.length > 0 ? (
            <div className="mt-5">
              <h2 className="text-sm font-bold text-ink-900">Keunggulan produk</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink-600">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {areas.length > 0 ? (
            <div className="mt-5">
              <h2 className="text-sm font-bold text-ink-900">Bidang aplikasi</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-sand-300 bg-white px-3 py-1 text-xs text-ink-600"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-7">
            <h2 className="text-sm font-bold text-ink-900">Pilih kemasan</h2>
            <div className="mt-3">
              <AddToCartForm
                variants={product.variants.map((variant) => ({
                  id: variant.id,
                  label: variant.label,
                  sizeKg: variant.sizeKg,
                  price: variant.price,
                  compareAtPrice: variant.compareAtPrice,
                  stock: variant.stock,
                  effectivePrice: variant.effectivePrice,
                  promoPercent: variant.promoPercent,
                }))}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-secondary">
              <Icon name="whatsapp" className="h-4 w-4 text-brand-600" />
              Tanya produk ini
            </a>
            <Link href="/kontak" className="btn-ghost">
              <Icon name="map" className="h-4 w-4" />
              Kunjungi toko
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">
              <Icon name="calculator" className="h-3.5 w-3.5" />
              Kalkulator
            </span>
            <h2 className="mt-3 section-title">Hitung kebutuhan {product.category}</h2>
            <p className="mt-2 text-ink-600">
              Daya sebar {formatNumber(product.coverageRate)} m&sup2;/kg untuk produk ini.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Calculator
            products={[
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                coverageRate: product.coverageRate,
                variants: product.variants.map((variant) => ({
                  id: variant.id,
                  sizeKg: variant.sizeKg,
                  label: variant.label,
                  price: variant.price,
                })),
              },
            ]}
            initialProductId={product.id}
          />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="section-title">Produk terkait</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  slug: item.slug,
                  name: item.name,
                  category: item.category,
                  textureLevel: item.textureLevel,
                  tagline: item.tagline,
                  coverageRate: item.coverageRate,
                  image: item.image,
                  isFeatured: item.isFeatured,
                  features: item.features,
                  variants: item.variants.map((variant) => ({
                    id: variant.id,
                    label: variant.label,
                    sizeKg: variant.sizeKg,
                    price: variant.price,
                    compareAtPrice: variant.compareAtPrice,
                    stock: variant.stock,
                    effectivePrice: variant.price,
                    promoPercent: 0,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
