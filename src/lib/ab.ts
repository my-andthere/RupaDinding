/**
 * Helper A/B testing landing page (Bagian 5.3 spesifikasi).
 * Assignment dihitung secara deterministik dari visitor id agar varian
 * konsisten untuk pengunjung yang sama.
 */

export type WeightedVariant = {
  slug: string;
  trafficWeight: number;
};

export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickVariantByWeight<T extends WeightedVariant>(
  visitorId: string,
  variants: T[],
): T | null {
  const active = variants.filter((v) => v.trafficWeight > 0);
  const pool = active.length > 0 ? active : variants;
  if (pool.length === 0) return null;

  const total = pool.reduce((sum, v) => sum + Math.max(0, v.trafficWeight), 0);
  if (total <= 0) return pool[0];

  let point = hashString(visitorId) % total;
  for (const variant of pool) {
    point -= Math.max(0, variant.trafficWeight);
    if (point < 0) return variant;
  }
  return pool[pool.length - 1];
}
