"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

export type AdminActionState = { ok: boolean; message: string };

function str(formData: FormData, key: string, fallback = ""): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function num(formData: FormData, key: string, fallback = 0): number {
  const parsed = Number(str(formData, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------- Produk ---

export async function saveProductAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  const slug = slugify(str(formData, "slug") || name);

  if (!name) return { ok: false, message: "Nama produk wajib diisi." };

  const data = {
    sku: str(formData, "sku"),
    name,
    slug,
    category: str(formData, "category", "Umum"),
    textureLevel: str(formData, "textureLevel", "Medium"),
    tagline: str(formData, "tagline"),
    description: str(formData, "description"),
    baseMaterial: str(formData, "baseMaterial"),
    features: JSON.stringify(linesToArray(str(formData, "features"))),
    applicationAreas: JSON.stringify(linesToArray(str(formData, "applicationAreas"))),
    coverageRate: num(formData, "coverageRate", 1),
    image: str(formData, "image") || null,
    isActive: bool(formData, "isActive"),
    isFeatured: bool(formData, "isFeatured"),
    sortOrder: num(formData, "sortOrder", 0),
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan produk. Periksa SKU dan slug yang unik." };
  }

  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  return { ok: true, message: "Produk tersimpan." };
}

export async function deleteProductAction(id: string): Promise<AdminActionState> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Produk gagal dihapus." };
  }
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  return { ok: true, message: "Produk dihapus." };
}

export async function toggleProductAction(id: string): Promise<AdminActionState> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { ok: false, message: "Produk tidak ditemukan." };
  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  return { ok: true, message: product.isActive ? "Produk dinonaktifkan." : "Produk diaktifkan." };
}

export async function saveVariantAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const productId = str(formData, "productId");
  const sizeKg = num(formData, "sizeKg", 1);
  const label = str(formData, "label") || `${sizeKg} kg`;
  const price = num(formData, "price", 0);
  const compareAtPriceRaw = num(formData, "compareAtPrice", 0);
  const stock = num(formData, "stock", 0);

  try {
    if (id) {
      await prisma.productVariant.update({
        where: { id },
        data: {
          label,
          sizeKg,
          price,
          compareAtPrice: compareAtPriceRaw > 0 ? compareAtPriceRaw : null,
          stock,
          isActive: bool(formData, "isActive"),
        },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId,
          label,
          sizeKg,
          price,
          compareAtPrice: compareAtPriceRaw > 0 ? compareAtPriceRaw : null,
          stock,
          isActive: true,
        },
      });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan varian. Periksa ukuran kemasan yang unik per produk." };
  }

  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  return { ok: true, message: "Varian tersimpan." };
}

export async function deleteVariantAction(id: string, productId: string): Promise<AdminActionState> {
  try {
    await prisma.productVariant.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Varian gagal dihapus (mungkin sudah dipakai pesanan)." };
  }
  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath("/admin/produk");
  return { ok: true, message: "Varian dihapus." };
}

// ---------------------------------------------------------------- Promosi ---

export async function savePromoAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { ok: false, message: "Nama promo wajib diisi." };

  const startDate = new Date(str(formData, "startDate"));
  const endDate = new Date(str(formData, "endDate"));

  const data = {
    name,
    type: str(formData, "type", "percent"),
    value: num(formData, "value", 0),
    startDate: Number.isNaN(startDate.getTime()) ? new Date() : startDate,
    endDate: Number.isNaN(endDate.getTime()) ? new Date() : endDate,
    freeShipping: bool(formData, "freeShipping"),
    isActive: bool(formData, "isActive"),
  };

  try {
    if (id) {
      await prisma.promo.update({ where: { id }, data });
    } else {
      await prisma.promo.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan promo." };
  }

  revalidatePath("/admin/promosi");
  revalidatePath("/produk");
  return { ok: true, message: "Promo tersimpan." };
}

export async function deletePromoAction(id: string): Promise<AdminActionState> {
  await prisma.promo.deleteMany({ where: { id } });
  revalidatePath("/admin/promosi");
  revalidatePath("/produk");
  return { ok: true, message: "Promo dihapus." };
}

// ------------------------------------------------------- Tarif & layanan ---

export async function saveServiceRateAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { ok: false, message: "Nama layanan wajib diisi." };

  const data = {
    category: str(formData, "category", "tenaga"),
    name,
    motif: str(formData, "motif"),
    minPrice: num(formData, "minPrice", 0),
    maxPrice: num(formData, "maxPrice", 0),
    description: str(formData, "description"),
    negotiable: bool(formData, "negotiable"),
    isActive: bool(formData, "isActive"),
    sortOrder: num(formData, "sortOrder", 0),
  };

  try {
    if (id) {
      await prisma.serviceRate.update({ where: { id }, data });
    } else {
      await prisma.serviceRate.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan tarif layanan." };
  }

  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Tarif tersimpan." };
}

export async function deleteServiceRateAction(id: string): Promise<AdminActionState> {
  await prisma.serviceRate.deleteMany({ where: { id } });
  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Tarif dihapus." };
}

export async function saveServiceFactorAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return { ok: false, message: "Judul faktor wajib diisi." };

  const data = {
    title,
    description: str(formData, "description"),
    icon: str(formData, "icon", "info"),
    sortOrder: num(formData, "sortOrder", 0),
    isActive: bool(formData, "isActive"),
  };

  if (id) {
    await prisma.serviceFactor.update({ where: { id }, data });
  } else {
    await prisma.serviceFactor.create({ data });
  }

  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Faktor penentu harga tersimpan." };
}

export async function deleteServiceFactorAction(id: string): Promise<AdminActionState> {
  await prisma.serviceFactor.deleteMany({ where: { id } });
  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Faktor dihapus." };
}

export async function saveServiceScopeAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { ok: false, message: "Nama cakupan wajib diisi." };

  const data = {
    name,
    description: str(formData, "description"),
    icon: str(formData, "icon", "paint"),
    sortOrder: num(formData, "sortOrder", 0),
    isActive: bool(formData, "isActive"),
  };

  if (id) {
    await prisma.serviceScope.update({ where: { id }, data });
  } else {
    await prisma.serviceScope.create({ data });
  }

  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Cakupan area tersimpan." };
}

export async function deleteServiceScopeAction(id: string): Promise<AdminActionState> {
  await prisma.serviceScope.deleteMany({ where: { id } });
  revalidatePath("/admin/tarif-jasa");
  revalidatePath("/layanan");
  return { ok: true, message: "Cakupan area dihapus." };
}

// ------------------------------------------------------------------ HPP ---

export async function saveHppRecordAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const data = {
    variantId: str(formData, "variantId") || null,
    productName: str(formData, "productName", "Tanpa nama"),
    supplierCost: num(formData, "supplierCost", 0),
    shippingCost: num(formData, "shippingCost", 0),
    packagingCost: num(formData, "packagingCost", 0),
    laborCost: num(formData, "laborCost", 0),
    overhead: num(formData, "overhead", 0),
    unitsPerBatch: Math.max(1, num(formData, "unitsPerBatch", 1)),
    marginTarget: num(formData, "marginTarget", 25),
    marketplaceCommission: num(formData, "marketplaceCommission", 0),
    adAllocation: num(formData, "adAllocation", 0),
    shippingSubsidy: num(formData, "shippingSubsidy", 0),
    notes: str(formData, "notes") || null,
  };

  if (id) {
    await prisma.hppRecord.update({ where: { id }, data });
  } else {
    await prisma.hppRecord.create({ data });
  }

  revalidatePath("/admin/harga-hpp");
  return { ok: true, message: "Catatan HPP tersimpan." };
}

export async function deleteHppRecordAction(id: string): Promise<AdminActionState> {
  await prisma.hppRecord.deleteMany({ where: { id } });
  revalidatePath("/admin/harga-hpp");
  return { ok: true, message: "Catatan HPP dihapus." };
}

// ---------------------------------------------------------------- Galeri ---

export async function saveGalleryItemAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return { ok: false, message: "Judul proyek wajib diisi." };

  const data = {
    title,
    motif: str(formData, "motif", "Umum"),
    category: str(formData, "category", "Umum"),
    location: str(formData, "location") || null,
    projectType: str(formData, "projectType") || null,
    areaSize: num(formData, "areaSize", 0),
    description: str(formData, "description"),
    beforeImage: str(formData, "beforeImage") || null,
    afterImage: str(formData, "afterImage") || null,
    isFeatured: bool(formData, "isFeatured"),
    isActive: bool(formData, "isActive"),
    sortOrder: num(formData, "sortOrder", 0),
  };

  try {
    if (id) {
      await prisma.galleryItem.update({ where: { id }, data });
    } else {
      await prisma.galleryItem.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan item galeri." };
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { ok: true, message: "Item galeri tersimpan." };
}

export async function deleteGalleryItemAction(id: string): Promise<AdminActionState> {
  await prisma.galleryItem.deleteMany({ where: { id } });
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  return { ok: true, message: "Item galeri dihapus." };
}

// --------------------------------------------------------------- Artikel ---

export async function savePostAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) return { ok: false, message: "Judul artikel wajib diisi." };

  const slug = slugify(str(formData, "slug") || title);
  const status = str(formData, "status", "draft");

  const data = {
    title,
    slug,
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    coverImage: str(formData, "coverImage") || null,
    tags: str(formData, "tags"),
    status,
    author: str(formData, "author", "Tim RupaDinding"),
    publishedAt:
      status === "published" ? new Date() : str(formData, "publishedAt")
        ? new Date(str(formData, "publishedAt"))
        : null,
  };

  try {
    if (id) {
      await prisma.blogPost.update({ where: { id }, data });
    } else {
      await prisma.blogPost.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan artikel. Periksa slug yang unik." };
  }

  revalidatePath("/admin/artikel");
  revalidatePath("/blog");
  return { ok: true, message: "Artikel tersimpan." };
}

export async function deletePostAction(id: string): Promise<AdminActionState> {
  await prisma.blogPost.deleteMany({ where: { id } });
  revalidatePath("/admin/artikel");
  revalidatePath("/blog");
  return { ok: true, message: "Artikel dihapus." };
}

export async function togglePostAction(id: string): Promise<AdminActionState> {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return { ok: false, message: "Artikel tidak ditemukan." };
  await prisma.blogPost.update({
    where: { id },
    data: {
      status: post.status === "published" ? "draft" : "published",
      publishedAt: post.status === "published" ? post.publishedAt : new Date(),
    },
  });
  revalidatePath("/admin/artikel");
  revalidatePath("/blog");
  return { ok: true, message: "Status artikel diperbarui." };
}

// -------------------------------------------------------------- Pesanan ---

export async function updateOrderStatusAction(
  id: string,
  status: string,
): Promise<AdminActionState> {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${id}`);
  return { ok: true, message: "Status pesanan diperbarui." };
}

export async function updatePaymentStatusAction(
  id: string,
  paymentStatus: string,
): Promise<AdminActionState> {
  await prisma.order.update({ where: { id }, data: { paymentStatus } });
  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${id}`);
  return { ok: true, message: "Status pembayaran diperbarui." };
}

// --------------------------------------------------------------- Prospek ---

export async function updateLeadStatusAction(id: string, status: string): Promise<AdminActionState> {
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/prospek");
  return { ok: true, message: "Status prospek diperbarui." };
}

export async function deleteLeadAction(id: string): Promise<AdminActionState> {
  await prisma.lead.deleteMany({ where: { id } });
  revalidatePath("/admin/prospek");
  return { ok: true, message: "Prospek dihapus." };
}

// ---------------------------------------------------------------- Pesan ---

export async function markContactReadAction(id: string): Promise<AdminActionState> {
  await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/pesan");
  return { ok: true, message: "Pesan ditandai sudah dibaca." };
}

export async function deleteContactMessageAction(id: string): Promise<AdminActionState> {
  await prisma.contactMessage.deleteMany({ where: { id } });
  revalidatePath("/admin/pesan");
  return { ok: true, message: "Pesan dihapus." };
}

// ------------------------------------------------------------ Pengaturan ---

export async function saveSettingsAction(formData: FormData): Promise<AdminActionState> {
  const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith("setting:"));
  if (entries.length === 0) return { ok: false, message: "Tidak ada perubahan untuk disimpan." };

  for (const [key, value] of entries) {
    const settingKey = key.replace("setting:", "");
    const raw = typeof value === "string" ? value : "";
    await prisma.setting.upsert({
      where: { key: settingKey },
      update: { value: raw },
      create: { key: settingKey, value: raw, group: "Umum", label: settingKey },
    });
  }

  revalidatePath("/admin/pengaturan");
  revalidatePath("/", "layout");
  return { ok: true, message: `${entries.length} pengaturan tersimpan.` };
}

// --------------------------------------------------------- Landing A/B ---

export async function saveLandingVariantAction(formData: FormData): Promise<AdminActionState> {
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { ok: false, message: "Nama varian wajib diisi." };

  const data = {
    name,
    slug: slugify(str(formData, "slug") || name),
    headline: str(formData, "headline"),
    subheadline: str(formData, "subheadline"),
    ctaText: str(formData, "ctaText", "Beli Cat Tekstur"),
    secondaryCtaText: str(formData, "secondaryCtaText", "Konsultasi Jasa Aplikator"),
    bundlePrice: str(formData, "bundlePrice"),
    promoText: str(formData, "promoText"),
    trafficWeight: num(formData, "trafficWeight", 50),
    isActive: bool(formData, "isActive"),
  };

  try {
    if (id) {
      await prisma.landingVariant.update({ where: { id }, data });
    } else {
      await prisma.landingVariant.create({ data });
    }
  } catch {
    return { ok: false, message: "Gagal menyimpan varian landing page." };
  }

  revalidatePath("/admin/landing-ab");
  revalidatePath("/");
  return { ok: true, message: "Varian landing page tersimpan." };
}

export async function toggleLandingVariantAction(id: string): Promise<AdminActionState> {
  const variant = await prisma.landingVariant.findUnique({ where: { id } });
  if (!variant) return { ok: false, message: "Varian tidak ditemukan." };
  await prisma.landingVariant.update({
    where: { id },
    data: { isActive: !variant.isActive },
  });
  revalidatePath("/admin/landing-ab");
  revalidatePath("/");
  return { ok: true, message: "Status varian diperbarui." };
}

export async function resetAbStatsAction(id: string): Promise<AdminActionState> {
  await prisma.landingVariant.update({
    where: { id },
    data: { views: 0, clicks: 0, conversions: 0 },
  });
  revalidatePath("/admin/landing-ab");
  return { ok: true, message: "Statistik varian direset." };
}

export async function redirectToAdmin(path: string) {
  redirect(path);
}
