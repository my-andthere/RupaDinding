import "server-only";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const CART_COOKIE = "rd_cart";

export type CartItemRow = {
  id: string;
  qty: number;
  variant: {
    id: string;
    label: string;
    sizeKg: number;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    isActive: boolean;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
      coverageRate: number;
    };
  };
};

export type CartSummary = {
  cartId: string;
  items: CartItemRow[];
  subtotal: number;
  itemCount: number;
};

export async function getOrCreateCartId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) {
    const cart = await prisma.cart.findUnique({ where: { token: existing } });
    if (cart) return cart.id;
  }
  const token = crypto.randomUUID();
  const cart = await prisma.cart.create({ data: { token } });
  store.set(CART_COOKIE, cart.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart.id;
}

export async function getCart(): Promise<CartSummary | null> {
  const store = await cookies();
  const token = store.get(CART_COOKIE)?.value;
  if (!token) return null;
  const cart = await prisma.cart.findUnique({
    where: { token },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });
  if (!cart) return null;

  const items: CartItemRow[] = cart.items
    .filter((item) => item.variant.isActive && item.variant.product.isActive)
    .map((item) => ({
      id: item.id,
      qty: item.qty,
      variant: {
        id: item.variant.id,
        label: item.variant.label,
        sizeKg: item.variant.sizeKg,
        price: item.variant.price,
        compareAtPrice: item.variant.compareAtPrice,
        stock: item.variant.stock,
        isActive: item.variant.isActive,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          image: item.variant.product.image,
          coverageRate: item.variant.product.coverageRate,
        },
      },
    }));

  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.qty, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return { cartId: cart.id, items, subtotal, itemCount };
}

export async function addCartItem(variantId: string, qty: number) {
  const cartId = await getOrCreateCartId();
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant || !variant.isActive || !variant.product.isActive) {
    throw new Error("Varian produk tidak tersedia.");
  }
  const amount = Math.max(1, Math.min(qty, 99));
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId, variantId } },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: Math.min(existing.qty + amount, 99) },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId, variantId, qty: amount } });
  }
  return prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });
}

export async function updateCartItem(itemId: string, qty: number) {
  if (qty <= 0) {
    await prisma.cartItem.deleteMany({ where: { id: itemId } });
    return;
  }
  await prisma.cartItem.update({ where: { id: itemId }, data: { qty: Math.min(qty, 99) } });
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.deleteMany({ where: { id: itemId } });
}

export async function clearCart() {
  const cart = await getCart();
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });
}
