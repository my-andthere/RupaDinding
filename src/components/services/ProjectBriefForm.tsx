"use client";

import { useMemo, useState, useTransition } from "react";
import { buildProjectBriefMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { saveLead } from "@/app/actions/lead";
import { Icon } from "@/components/ui/Icon";

const packageOptions = [
  { value: "paket", label: "Paket Bahan + Tenaga (bundling)" },
  { value: "tenaga", label: "Tenaga Aplikator Saja" },
];

const surfaceOptions = [
  "Dinding baru / halus",
  "Dinding retak / lembap butuh perbaikan",
  "Pengecatan ulang",
];

export function ProjectBriefForm({
  whatsappNumber,
  textureOptions,
  initialArea,
  initialMotif,
  initialPackage,
  variantLabel,
}: {
  whatsappNumber: string;
  textureOptions: string[];
  initialArea?: string;
  initialMotif?: string;
  initialPackage?: string;
  variantLabel?: string;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    packageType: initialPackage === "tenaga" ? "tenaga" : "paket",
    textureType: initialMotif ?? textureOptions[0] ?? "",
    areaSize: initialArea ?? "",
    surfaceCondition: surfaceOptions[1],
    city: "",
    notes: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const message = useMemo(
    () =>
      buildProjectBriefMessage({
        name: form.name || "-",
        company: form.company,
        phone: form.phone || "-",
        email: form.email,
        packageType: form.packageType,
        textureType: form.textureType,
        areaSize: Number(form.areaSize) || null,
        surfaceCondition: form.surfaceCondition,
        city: form.city,
        notes: form.notes,
      }),
    [form],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("source", "project-brief");
    formData.set("variantLabel", variantLabel ?? "");

    startTransition(async () => {
      const result = await saveLead(formData);
      const link = buildWhatsAppUrl(whatsappNumber, message);
      window.open(link, "_blank");
      setStatus(
        result.ok
          ? "Project brief tersimpan. Lanjutkan konfirmasi di WhatsApp."
          : result.message,
      );
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="card p-5 lg:col-span-3 sm:p-6">
        <h3 className="text-lg font-bold text-ink-900">Data pemesan</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="label" htmlFor="brief-name">
              Nama lengkap *
            </label>
            <input
              id="brief-name"
              name="name"
              required
              className="input"
              placeholder="Contoh: Budi Santoso"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label" htmlFor="brief-company">
              Perusahaan / jenis proyek
            </label>
            <input
              id="brief-company"
              name="company"
              className="input"
              placeholder="Opsional untuk rumah tangga"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label" htmlFor="brief-phone">
              Nomor WhatsApp *
            </label>
            <input
              id="brief-phone"
              name="phone"
              required
              className="input"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label" htmlFor="brief-email">
              Email
            </label>
            <input
              id="brief-email"
              name="email"
              type="email"
              className="input"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>

        <h3 className="mt-7 text-lg font-bold text-ink-900">Spesifikasi teknis proyek</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="brief-package">
              Pilihan layanan
            </label>
            <select
              id="brief-package"
              name="packageType"
              className="input"
              value={form.packageType}
              onChange={(e) => update("packageType", e.target.value)}
            >
              {packageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="brief-texture">
              Jenis tekstur yang diminati
            </label>
            <select
              id="brief-texture"
              name="textureType"
              className="input"
              value={form.textureType}
              onChange={(e) => update("textureType", e.target.value)}
            >
              {textureOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="brief-area">
              Perkiraan luas area (m&sup2;)
            </label>
            <input
              id="brief-area"
              name="areaSize"
              type="number"
              min="0"
              step="1"
              className="input"
              placeholder="30"
              value={form.areaSize}
              onChange={(e) => update("areaSize", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="brief-surface">
              Kondisi permukaan dinding
            </label>
            <select
              id="brief-surface"
              name="surfaceCondition"
              className="input"
              value={form.surfaceCondition}
              onChange={(e) => update("surfaceCondition", e.target.value)}
            >
              {surfaceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className="mt-7 text-lg font-bold text-ink-900">Lokasi & catatan</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="brief-city">
              Kota / kecamatan lokasi proyek
            </label>
            <input
              id="brief-city"
              name="city"
              className="input"
              placeholder="Contoh: Bandung, Coblong"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="brief-notes">
              Catatan / jadwal survei
            </label>
            <input
              id="brief-notes"
              name="notes"
              className="input"
              placeholder="Contoh: survei bisa Sabtu pagi"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary mt-6 w-full sm:w-auto">
          <Icon name="whatsapp" className="h-4 w-4" />
          {pending ? "Menyimpan..." : "Kirim Project Brief via WhatsApp"}
        </button>
        {status ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-600">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            {status}
          </p>
        ) : null}
      </form>

      <div className="lg:col-span-2">
        <div className="card sticky top-24 overflow-hidden">
          <div className="border-b border-sand-200 bg-sand-100 px-5 py-3">
            <p className="text-sm font-bold text-ink-900">Live preview pesan</p>
            <p className="text-xs text-ink-500">Format yang akan diterima tim kami</p>
          </div>
          <pre className="max-h-[520px] overflow-auto px-5 py-4 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap text-ink-700">
            {message}
          </pre>
        </div>
      </div>
    </div>
  );
}
