"use server";

import { revalidatePath } from "next/cache";
import {
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/lib/cart";

export type ActionState = { ok: boolean; message: string };

export async function addToCartAction(
  variantId: string,
  qty: number = 1,
): Promise<ActionState> {
  try {
    await addCartItem(variantId, qty);
    revalidatePath("/keranjang");
    revalidatePath("/", "layout");
    return { ok: true, message: "Produk ditambahkan ke keranjang." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan produk.",
    };
  }
}

export async function updateCartItemAction(itemId: string, qty: number): Promise<ActionState> {
  try {
    await updateCartItem(itemId, qty);
    revalidatePath("/keranjang");
    revalidatePath("/", "layout");
    return { ok: true, message: "Jumlah diperbarui." };
  } catch {
    return { ok: false, message: "Gagal memperbarui keranjang." };
  }
}

export async function removeCartItemAction(itemId: string): Promise<ActionState> {
  try {
    await removeCartItem(itemId);
    revalidatePath("/keranjang");
    revalidatePath("/", "layout");
    return { ok: true, message: "Produk dihapus dari keranjang." };
  } catch {
    return { ok: false, message: "Gagal menghapus produk." };
  }
}

export async function clearCartAction(): Promise<ActionState> {
  await clearCart();
  revalidatePath("/keranjang");
  revalidatePath("/", "layout");
  return { ok: true, message: "Keranjang dikosongkan." };
}
