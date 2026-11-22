"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/checkout";
import { Icon } from "@/components/ui/Icon";

export function CheckoutForm({
  total,
  subtotal,
  shippingCost,
  paymentMethods,
  bankInfo,
}: {
  total: number;
  subtotal: number;
  shippingCost: number;
  paymentMethods: string[];
  bankInfo: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await createOrder(formData);
      if (result.ok && result.orderNo) {
        router.push(`/checkout/selesai?order=${result.orderNo}`);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-lg font-bold text-ink-900">Data pengiriman</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="co-name">
            Nama penerima *
          </label>
          <input id="co-name" name="name" required className="input" />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="co-phone">
            Nomor WhatsApp *
          </label>
          <input id="co-phone" name="phone" required className="input" placeholder="08xxxxxxxxxx" />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="co-email">
            Email
          </label>
          <input id="co-email" name="email" type="email" className="input" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="co-address">
            Alamat lengkap pengiriman *
          </label>
          <textarea id="co-address" name="address" required rows={3} className="input" />
          {errors.address ? <p className="mt-1 text-xs text-red-600">{errors.address}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="co-city">
            Kota / Kabupaten *
          </label>
          <input id="co-city" name="city" required className="input" />
          {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="co-payment">
            Metode pembayaran
          </label>
          <select id="co-payment" name="paymentMethod" className="input" defaultValue={paymentMethods[0]}>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="co-note">
            Catatan untuk penjual
          </label>
          <textarea id="co-note" name="note" rows={2} className="input" />
        </div>
      </div>

      {bankInfo ? (
        <p className="mt-5 rounded-xl bg-sand-100 p-4 text-sm text-ink-600">
          <strong className="text-ink-900">Informasi pembayaran:</strong> {bankInfo}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
        <Icon name="receipt" className="h-4 w-4" />
        {pending ? "Memproses..." : `Buat Pesanan - ${formatIDR(total)}`}
      </button>

      {message ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
          <Icon name="bell" className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      ) : null}
    </form>
  );
}

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
