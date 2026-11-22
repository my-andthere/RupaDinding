"use client";

import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { formatRupiah } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

type Variant = {
  id: string;
  label: string;
  sizeKg: number;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  effectivePrice: number;
  promoPercent: number;
};

export function AddToCartForm({ variants }: { variants: Variant[] }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = variants.find((v) => v.id === selectedId);

  function handleAdd() {
    if (!selected) return;
    startTransition(async () => {
      const result = await addToCartAction(selected.id, qty);
      setMessage({ type: result.ok ? "ok" : "error", text: result.message });
    });
  }

  if (variants.length === 0) {
    return <p className="text-sm text-ink-500">Varian produk sedang disiapkan.</p>;
  }

  return (
    <div>
      <div className="space-y-2.5">
        {variants.map((variant) => {
          const active = variant.id === selectedId;
          const outOfStock = variant.stock <= 0;
          return (
            <label
              key={variant.id}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3.5 transition ${
                active
                  ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-200"
                  : "border-sand-200 bg-white hover:border-brand-300"
              } ${outOfStock ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={active}
                  disabled={outOfStock}
                  onChange={() => {
                    setSelectedId(variant.id);
                    setMessage(null);
                  }}
                  className="h-4 w-4 accent-[var(--color-brand-600)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{variant.label}</span>
                  <span className="block text-xs text-ink-400">
                    {outOfStock ? "Stok habis" : `Stok ${variant.stock} · Daya sebar sesuai produk`}
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-bold text-ink-900">
                  {formatRupiah(variant.effectivePrice)}
                </span>
                {variant.promoPercent > 0 ? (
                  <span className="block text-[11px] font-semibold text-brand-600">
                    Hemat {variant.promoPercent}%
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center rounded-xl border border-sand-300 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-ink-600 hover:text-brand-700"
            aria-label="Kurangi jumlah"
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-ink-900">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="flex h-11 w-11 items-center justify-center text-ink-600 hover:text-brand-700"
            aria-label="Tambah jumlah"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={handleAdd} disabled={pending} className="btn-primary flex-1">
          <Icon name="cart" className="h-4 w-4" />
          {pending ? "Menambahkan..." : `Tambah ke Keranjang${
            selected ? ` - ${formatRupiah(selected.effectivePrice * qty)}` : ""
          }`}
        </button>
      </div>

      {message ? (
        <p
          className={`mt-3 flex items-center gap-2 text-sm ${
            message.type === "ok" ? "text-brand-700" : "text-red-600"
          }`}
        >
          <Icon name={message.type === "ok" ? "check" : "bell"} className="h-4 w-4" />
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
