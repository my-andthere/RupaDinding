"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { calculateNeeds } from "@/lib/calculator";
import { formatNumber, formatRupiah } from "@/lib/format";
import { addToCartAction } from "@/app/actions/cart";
import { Icon } from "@/components/ui/Icon";

export type CalcProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  coverageRate: number;
  variants: { id: string; sizeKg: number; label: string; price: number }[];
};

export function Calculator({
  products,
  initialArea,
  initialProductId,
  compact = false,
}: {
  products: CalcProduct[];
  initialArea?: number;
  initialProductId?: string;
  compact?: boolean;
}) {
  const [productId, setProductId] = useState(initialProductId ?? products[0]?.id ?? "");
  const [panjang, setPanjang] = useState(initialArea ? String(Math.sqrt(initialArea / 2.5)) : "5");
  const [tinggi, setTinggi] = useState(initialArea ? String(Math.sqrt(initialArea / 2.5)) : "2.5");
  const [jumlah, setJumlah] = useState("1");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const product = products.find((p) => p.id === productId) ?? products[0];

  const result = useMemo(
    () =>
      calculateNeeds({
        panjang: Number(panjang) || 0,
        tinggi: Number(tinggi) || 0,
        dayaSebar: product?.coverageRate ?? 1,
        jumlahWalls: Number(jumlah) || 1,
      }),
    [panjang, tinggi, jumlah, product],
  );

  const totalPrice = result.paket.reduce((sum, line) => {
    const variant = product?.variants.find((v) => v.sizeKg === line.sizeKg);
    return sum + (variant ? variant.price * line.qty : 0);
  }, 0);

  function addPackageToCart() {
    if (!product) return;
    startTransition(async () => {
      let added = 0;
      for (const line of result.paket) {
        const variant = product.variants.find((v) => v.sizeKg === line.sizeKg);
        if (!variant) continue;
        const res = await addToCartAction(variant.id, line.qty);
        if (res.ok) added += line.qty;
      }
      setStatus(
        added > 0
          ? `${added} kemasan ditambahkan ke keranjang.`
          : "Varian kemasan untuk motif ini belum tersedia.",
      );
    });
  }

  if (!product) {
    return <p className="text-sm text-ink-500">Belum ada produk untuk dihitung.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="card p-5 lg:col-span-3 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-ink-900">Data dinding & material</h3>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Cadangan 10% otomatis
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="calc-product">
              Jenis cat tekstur (daya sebar)
            </label>
            <select
              id="calc-product"
              className="input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.coverageRate} m&sup2;/kg
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="calc-panjang">
                Panjang dinding (meter)
              </label>
              <input
                id="calc-panjang"
                type="number"
                min="0"
                step="0.1"
                className="input"
                value={panjang}
                onChange={(e) => setPanjang(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="calc-tinggi">
                Tinggi dinding (meter)
              </label>
              <input
                id="calc-tinggi"
                type="number"
                min="0"
                step="0.1"
                className="input"
                value={tinggi}
                onChange={(e) => setTinggi(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="calc-jumlah">
                Jumlah bidang
              </label>
              <input
                id="calc-jumlah"
                type="number"
                min="1"
                step="1"
                className="input"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl bg-sand-100 p-4 text-sm text-ink-600">
            <p className="font-semibold text-ink-800">Rumus yang dipakai</p>
            <p className="mt-1.5">
              Luas dinding = P &times; T &times; jumlah bidang &middot; Kebutuhan dasar = Luas &divide;
              daya sebar ({product.coverageRate} m&sup2;/kg) &middot; Total = kebutuhan dasar &times; 1,10
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-ink-950 p-5 text-ink-100 lg:col-span-2 sm:p-6">
        <h3 className="text-lg font-bold text-white">Estimasi kebutuhan</h3>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-ink-800 pb-2">
            <dt className="text-ink-300">Luas dinding</dt>
            <dd className="font-bold text-white">{formatNumber(result.luas)} m&sup2;</dd>
          </div>
          <div className="flex items-center justify-between border-b border-ink-800 pb-2">
            <dt className="text-ink-300">Kebutuhan dasar</dt>
            <dd className="font-bold text-white">{formatNumber(result.kebutuhanDasar)} kg</dd>
          </div>
          <div className="flex items-center justify-between border-b border-ink-800 pb-2">
            <dt className="text-ink-300">Cadangan 10%</dt>
            <dd className="font-bold text-white">{formatNumber(result.cadangan)} kg</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-300">Total rekomendasi</dt>
            <dd className="text-lg font-extrabold text-brand-300">
              {formatNumber(result.totalRekomendasi)} kg
            </dd>
          </div>
        </dl>

        {result.paket.length > 0 ? (
          <div className="mt-5 rounded-xl bg-ink-900 p-4">
            <p className="text-xs font-semibold tracking-wide text-ink-300 uppercase">
              Kombinasi kemasan
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {result.paket.map((line) => (
                <li key={line.sizeKg} className="flex items-center justify-between">
                  <span className="text-ink-200">
                    {line.qty} &times; {line.label}
                  </span>
                  <span className="font-semibold text-white">{formatNumber(line.sizeKg * line.qty)} kg</span>
                </li>
              ))}
            </ul>
            {totalPrice > 0 ? (
              <p className="mt-3 flex items-center justify-between border-t border-ink-800 pt-3 text-sm">
                <span className="text-ink-300">Estimasi belanja</span>
                <span className="font-bold text-brand-300">{formatRupiah(totalPrice)}</span>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={addPackageToCart}
            disabled={pending || result.paket.length === 0}
            className="btn-primary w-full"
          >
            <Icon name="cart" className="h-4 w-4" />
            {pending ? "Menambahkan..." : "Beli kombinasi kemasan"}
          </button>
          <Link
            href={`/layanan?area=${Math.round(result.luas)}&motif=${encodeURIComponent(
              product.category,
            )}&produk=${encodeURIComponent(product.name)}&bundling=1`}
            className="btn w-full border border-ink-700 bg-ink-900 text-ink-100 hover:border-brand-500 hover:text-brand-200"
          >
            <Icon name="scale" className="h-4 w-4" />
            Paket bundling cat + jasa
          </Link>
        </div>

        {status ? (
          <p className="mt-3 flex items-start gap-2 text-xs text-ink-300">
            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
            {status}
          </p>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-ink-400">
            {result.remarks.join(" ")} {compact ? "" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
