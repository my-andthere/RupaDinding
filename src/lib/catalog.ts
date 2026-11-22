import "server-only";
import { prisma } from "./prisma";

export type PromoInfo = {
  name: string;
  percent: number;
  freeShipping: boolean;
};

/** Promo aktif yang berlaku pada saat ini (filter tanggal kembar / flash sale). */
export async function getActivePromos(): Promise<PromoInfo[]> {
  const now = new Date();
  const promos = await prisma.promo.findMany({
    where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
  });
  return promos.map((p) => ({
    name: p.name,
    percent: p.type === "percent" ? p.value : 0,
    freeShipping: p.freeShipping,
  }));
}

export type CatalogVariant = {
  id: string;
  label: string;
  sizeKg: number;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  promoPercent: number;
  effectivePrice: number;
};

export function applyPromo(price: number, promos: PromoInfo[], freeShipping = false): number {
  let result = price;
  let percent = 0;
  let freeShip = freeShipping;
  for (const promo of promos) {
    percent = Math.max(percent, promo.percent);
    freeShip = freeShip || promo.freeShipping;
  }
  if (percent > 0) result = Math.floor((price * (100 - percent)) / 100);
  return result;
}

export async function getFeaturedProducts(limit = 3) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take: limit,
  });
  const promos = await getActivePromos();
  return products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      promoPercent: Math.max(0, ...promos.map((pr) => pr.percent)),
      effectivePrice: applyPromo(v.price, promos),
    })),
  }));
}

export async function getAllProducts(options?: { category?: string; search?: string }) {
  const where: Record<string, unknown> = { isActive: true };
  if (options?.category && options.category !== "all") where.category = options.category;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { tagline: { contains: options.search } },
      { category: { contains: options.search } },
      { baseMaterial: { contains: options.search } },
    ];
  }
  const products = await prisma.product.findMany({
    where,
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const promos = await getActivePromos();
  return products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      promoPercent: Math.max(0, ...promos.map((pr) => pr.percent)),
      effectivePrice: applyPromo(v.price, promos),
    })),
  }));
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!product) return null;
  const promos = await getActivePromos();
  return {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      promoPercent: Math.max(0, ...promos.map((pr) => pr.percent)),
      effectivePrice: applyPromo(v.price, promos),
    })),
  };
}

export async function getProductCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}
