"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type LeadState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

/** Simpan prospek Project Brief ke database admin (opsional sesuai kebijakan privasi). */
export async function saveLead(formData: FormData): Promise<LeadState> {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nama lengkap wajib diisi.";
  if (!phone) fieldErrors.phone = "Nomor WhatsApp wajib diisi.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Format email tidak valid.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali isian Anda.", fieldErrors };
  }

  const areaRaw = String(formData.get("areaSize") || "").replace(",", ".");
  const areaSize = areaRaw ? Number(areaRaw) : null;

  await prisma.lead.create({
    data: {
      name,
      company: String(formData.get("company") || "").trim() || null,
      phone,
      email: email || null,
      packageType: String(formData.get("packageType") || "paket"),
      textureType: String(formData.get("textureType") || "") || null,
      areaSize: Number.isFinite(areaSize) ? areaSize : null,
      surfaceCondition: String(formData.get("surfaceCondition") || "") || null,
      city: String(formData.get("city") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
      source: String(formData.get("source") || "website"),
      variantLabel: String(formData.get("variantLabel") || "") || null,
    },
  });

  revalidatePath("/admin/prospek");
  return { ok: true, message: "Project brief tersimpan. Lanjutkan ke WhatsApp." };
}

export type ContactState = { ok: boolean; message: string };

export async function submitContactMessage(formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Nama, email, dan pesan wajib diisi." };
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: String(formData.get("phone") || "").trim() || null,
      subject: String(formData.get("subject") || "").trim() || null,
      message,
    },
  });

  revalidatePath("/admin/pesan");
  return { ok: true, message: "Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda." };
}
