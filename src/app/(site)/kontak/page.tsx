import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kontak & Toko-Kantor",
  description:
    "Alamat toko cat sekaligus kantor operasional PT Mitra Dinding Utama, jam operasional, peta lokasi, dan kontak WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const waLink = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    "Halo RupaDinding, saya ingin bertanya mengenai produk dan layanan.",
  );

  const socials = [
    { key: "social.instagram", icon: "instagram", label: "Instagram" },
    { key: "social.tiktok", icon: "tiktok", label: "TikTok" },
    { key: "social.youtube", icon: "youtube", label: "YouTube" },
    { key: "social.facebook", icon: "facebook", label: "Facebook" },
    { key: "social.pinterest", icon: "pinterest", label: "Pinterest" },
    { key: "social.linkedin", icon: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Kontak" }]} />

      <div className="mt-5 max-w-3xl">
        <span className="eyebrow">
          <Icon name="map" className="h-3.5 w-3.5" />
          Toko sekaligus kantor operasional
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Kontak & Lokasi
        </h1>
        <p className="mt-3 text-ink-600">
          Kunjungi toko display kami untuk melihat sampel warna dan tekstur secara langsung, atau
          konsultasikan kebutuhan proyek Anda lewat WhatsApp.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name="map" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-bold text-ink-900">Alamat</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            {settings["contact.address"]}
            <br />
            {settings["contact.city"]}, {settings["contact.province"]}{" "}
            {settings["contact.postalCode"]}
          </p>
          {settings["contact.mapsUrl"] ? (
            <a
              href={settings["contact.mapsUrl"]}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-4 w-full"
            >
              <Icon name="location" className="h-4 w-4" />
              Buka di peta
            </a>
          ) : null}
          {settings["contact.mapsNote"] ? (
            <p className="mt-3 text-xs text-ink-400">{settings["contact.mapsNote"]}</p>
          ) : null}
        </div>

        <div className="card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name="clock" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-bold text-ink-900">Jam operasional</h2>
          <p className="mt-2 text-sm whitespace-pre-line text-ink-600">{settings["contact.hours"]}</p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
            >
              <Icon name="whatsapp" className="h-4 w-4 text-brand-600" />
              {settings["contact.phone"]}
            </a>
            <a
              href={`mailto:${settings["contact.email"]}`}
              className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
            >
              <Icon name="mail" className="h-4 w-4 text-brand-600" />
              {settings["contact.email"]}
            </a>
          </div>
        </div>

        <div className="card p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name="megaphone" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-bold text-ink-900">Media sosial</h2>
          <p className="mt-2 text-sm text-ink-600">
            Ikuti kami untuk update warna baru, promo, dan dokumentasi proyek.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials
              .filter((social) => settings[social.key])
              .map((social) => (
                <a
                  key={social.key}
                  href={settings[social.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
                >
                  <Icon name={social.icon} className="h-4.5 w-4.5" />
                </a>
              ))}
          </div>
          <Link href="/galeri" className="btn-secondary mt-5 w-full">
            <Icon name="image" className="h-4 w-4" />
            Lihat portofolio
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="aspect-[4/3] bg-sand-200">
              {settings["contact.mapsEmbed"] ? (
                <iframe
                  src={settings["contact.mapsEmbed"]}
                  title="Peta lokasi RupaDinding"
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-sand-100 text-center">
                  <Icon name="location" className="h-8 w-8 text-ink-300" />
                  <p className="px-6 text-sm text-ink-500">
                    Peta lokasi belum disematkan. Admin dapat menambahkan URL embed Google Maps pada
                    pengaturan situs.
                  </p>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-ink-900">{settings["company.name"]}</p>
              <p className="mt-1 text-xs text-ink-500">{settings["company.kbli"]}</p>
              <p className="mt-2 text-xs text-ink-500">{settings["compliance.wholesaleNotice"]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
