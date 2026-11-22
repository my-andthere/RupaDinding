/**
 * Pembantu integrasi WhatsApp.
 * Semua pesan dibangun dari template terstruktur agar mudah dibaca tim operasional.
 */

export function normalizeNumber(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
}

export function buildWhatsAppUrl(
  number: string | null | undefined,
  message: string,
): string {
  const clean = normalizeNumber(number) || "6281234567890";
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildProjectBriefMessage(data: {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  packageType: string;
  textureType?: string;
  areaSize?: number | null;
  surfaceCondition?: string;
  city?: string;
  notes?: string;
}): string {
  const lines = [
    "*PROJECT BRIEF - JASA APLIKATOR RupaDinding*",
    "-------------------------------------",
    `Nama: ${data.name}`,
  ];
  if (data.company) lines.push(`Perusahaan / Jenis Proyek: ${data.company}`);
  lines.push(`No. WhatsApp: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  lines.push("");
  lines.push("*SPESIFIKASI PROYEK*");
  lines.push(
    `Paket: ${data.packageType === "tenaga" ? "Tenaga Aplikator Saja" : "Paket Bahan + Tenaga (Bundling)"}`,
  );
  if (data.textureType) lines.push(`Jenis Tekstur yang diminati: ${data.textureType}`);
  if (data.areaSize) lines.push(`Perkiraan Luas Area: ${data.areaSize} m2`);
  if (data.surfaceCondition) lines.push(`Kondisi Permukaan: ${data.surfaceCondition}`);
  lines.push("");
  lines.push("*LOKASI & CATATAN*");
  if (data.city) lines.push(`Kota/Kecamatan: ${data.city}`);
  if (data.notes) lines.push(`Catatan: ${data.notes}`);
  lines.push("");
  lines.push("_Dikirim melalui Generator Project Brief di website RupaDinding._");
  return lines.join("\n");
}

export function buildGalleryInquiryMessage(motif: string, title?: string): string {
  return [
    "*PEMINTAAN PENAWARAN MOTIF*",
    "-------------------------------------",
    `Motif: ${motif}`,
    title ? `Referensi proyek: ${title}` : "",
    "",
    "Mohon informasi harga dan estimasi pengerjaan untuk motif serupa.",
    "_Dikirim melalui Galeri Portofolio RupaDinding._",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildProductInquiryMessage(productName: string, variantLabel?: string): string {
  return [
    "*PEMINTAAN PRODUK CAT TEKSTUR*",
    "-------------------------------------",
    `Produk: ${productName}`,
    variantLabel ? `Kemasan: ${variantLabel}` : "",
    "",
    "Mohon info ketersediaan stok, ongkos kirim, dan estimasi pengiriman.",
    "_Dikirim melalui katalog RupaDinding._",
  ]
    .filter(Boolean)
    .join("\n");
}
