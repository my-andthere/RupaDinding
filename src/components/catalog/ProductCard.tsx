import Link from "next/link";
import { formatRupiah, parseJsonArray } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  textureLevel: string;
  tagline: string;
  coverageRate: number;
  image: string | null;
  isFeatured: boolean;
  features?: string;
  variants: {
    id: string;
    label: string;
    sizeKg: number;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    effectivePrice: number;
    promoPercent: number;
  }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const cheapest = product.variants.reduce(
    (min, v) => (v.effectivePrice < min.effectivePrice ? v : min),
    product.variants[0],
  );
  const features = parseJsonArray(
    (product as unknown as { features?: string }).features ?? "[]",
  ).slice(0, 2);

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-card">
      <Link href={`/produk/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sand-200">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-400">
            <Icon name="texture" className="h-10 w-10" />
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700 backdrop-blur">
          {product.category}
        </span>
        {cheapest && cheapest.promoPercent > 0 ? (
          <span className="absolute top-3 right-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
            -{cheapest.promoPercent}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-ink-400 uppercase">
          <span>{product.textureLevel}</span>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <span>{product.coverageRate} m&sup2;/kg</span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-ink-900">
          <Link href={`/produk/${product.slug}`} className="transition hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{product.tagline}</p>

        {features.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-ink-500">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {cheapest ? (
            <div>
              <p className="text-xs text-ink-400">Mulai dari</p>
              <p className="text-lg font-extrabold text-brand-700">
                {formatRupiah(cheapest.effectivePrice)}
              </p>
              <p className="text-[11px] text-ink-400">{cheapest.label}</p>
            </div>
          ) : null}
          <Link href={`/produk/${product.slug}`} className="btn-secondary px-4 py-2">
            Detail
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
