"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCart, clearCart } from "@/lib/cart";
import { getSettings, numericSetting } from "@/lib/settings";

function generateOrderNo(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RPD-${stamp}-${rand}`;
}

export type CheckoutState = {
  ok: boolean;
  message: string;
  orderNo?: string;
  fieldErrors?: Record<string, string>;
};

export async function createOrder(formData: FormData): Promise<CheckoutState> {
  const data = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    paymentMethod: String(formData.get("paymentMethod") || "transfer"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!data.name) fieldErrors.name = "Nama wajib diisi.";
  if (!data.phone) fieldErrors.phone = "Nomor WhatsApp wajib diisi.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    fieldErrors.email = "Format email tidak valid.";
  if (!data.address) fieldErrors.address = "Alamat pengiriman wajib diisi.";
  if (!data.city) fieldErrors.city = "Kota wajib diisi.";

  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    return { ok: false, message: "Keranjang masih kosong." };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data pesanan Anda.", fieldErrors };
  }

  const settings = await getSettings();
  const flatShipping = numericSetting(settings, "store.shippingFlat", 25000);
  const freeShippingMin = numericSetting(settings, "store.freeShippingMin", 750000);

  const subtotal = cart.items.reduce((sum, item) => sum + item.variant.price * item.qty, 0);
  const shippingCost = subtotal >= freeShippingMin ? 0 : flatShipping;
  const total = subtotal + shippingCost;

  const order = await prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      customerName: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      note: data.note || null,
      subtotal,
      shippingCost,
      discount: 0,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: "belum_bayar",
      status: "baru",
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variant.id,
          productName: item.variant.product.name,
          variantLabel: item.variant.label,
          price: item.variant.price,
          qty: item.qty,
          total: item.variant.price * item.qty,
        })),
      },
    },
  });

  await clearCart();
  revalidatePath("/keranjang");
  revalidatePath("/admin/pesanan");

  return {
    ok: true,
    message: "Pesanan berhasil dibuat.",
    orderNo: order.orderNo,
  };
}
