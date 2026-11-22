"use client";

import Link from "next/link";
import { useTransition } from "react";
import { removeCartItemAction, updateCartItemAction } from "@/app/actions/cart";
import { formatRupiah } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export type CartItemView = {
  id: string;
  qty: number;
  variant: {
    id: string;
    label: string;
    sizeKg: number;
    price: number;
    stock: number;
    product: { name: string; slug: string; image: string | null };
  };
};

export function CartTable({ items }: { items: CartItemView[] }) {
  const [pending, startTransition] = useTransition();

  function changeQty(itemId: string, qty: number) {
    startTransition(async () => {
      await updateCartItemAction(itemId, qty);
    });
  }

  function remove(itemId: string) {
    startTransition(async () => {
      await removeCartItemAction(itemId);
    });
  }

  return (
    <div className="divide-y divide-sand-200">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sand-200 bg-sand-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.variant.product.image || "/images/produk/default.svg"}
              alt={item.variant.product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/produk/${item.variant.product.slug}`}
              className="font-semibold text-ink-900 hover:text-brand-700"
            >
              {item.variant.product.name}
            </Link>
            <p className="text-xs text-ink-500">
              {item.variant.label} &middot; {formatRupiah(item.variant.price)} / kemasan
            </p>
            {item.variant.stock <= 5 ? (
              <p className="mt-1 text-xs font-semibold text-brand-600">
                Stok tersisa {item.variant.stock} kemasan
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-sand-300 bg-white">
              <button
                type="button"
                disabled={pending}
                onClick={() => changeQty(item.id, item.qty - 1)}
                className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-brand-700 disabled:opacity-40"
                aria-label="Kurangi jumlah"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-ink-900">{item.qty}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => changeQty(item.id, item.qty + 1)}
                className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-brand-700 disabled:opacity-40"
                aria-label="Tambah jumlah"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>

            <p className="w-28 text-right text-sm font-bold text-ink-900">
              {formatRupiah(item.variant.price * item.qty)}
            </p>

            <button
              type="button"
              disabled={pending}
              onClick={() => remove(item.id)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
              aria-label="Hapus produk"
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
