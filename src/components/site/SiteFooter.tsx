import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

const socials = [
  { key: "social.instagram", icon: "instagram", label: "Instagram" },
  { key: "social.tiktok", icon: "tiktok", label: "TikTok" },
  { key: "social.youtube", icon: "youtube", label: "YouTube" },
  { key: "social.facebook", icon: "facebook", label: "Facebook" },
  { key: "social.pinterest", icon: "pinterest", label: "Pinterest" },
  { key: "social.linkedin", icon: "linkedin", label: "LinkedIn" },
];

export async function SiteFooter() {
  const settings = await getSettings();
  const waLink = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    "Halo RupaDinding, saya ingin berkonsultasi tentang cat tekstur dan jasa aplikator.",
  );

  return (
    <footer className="mt-20 bg-ink-950 text-ink-100">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon name="texture" className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                {settings["company.brand"] || "RupaDinding"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">
              {settings["footer.about"] ||
                "Merek cat tekstur PT Mitra Dinding Utama dengan jasa aplikator cat dinding, plafon, dan fasad."}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              {settings["company.legalNote"]}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
              {[
                { href: "/produk", label: "Katalog Cat Tekstur" },
                { href: "/layanan", label: "Layanan Jasa Aplikator" },
                { href: "/kalkulator", label: "Kalkulator Kebutuhan Cat" },
                { href: "/galeri", label: "Galeri Portofolio" },
                { href: "/blog", label: "Blog & Panduan" },
                { href: "/kontak", label: "Kontak & Toko" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-brand-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Toko & Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-300">
              <li className="flex gap-2">
                <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  {settings["contact.address"]}, {settings["contact.city"]},{" "}
                  {settings["contact.province"]} {settings["contact.postalCode"]}
                </span>
              </li>
              <li className="flex gap-2">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${settings["contact.phone"]}`} className="hover:text-brand-300">
                  {settings["contact.phone"]}
                </a>
              </li>
              <li className="flex gap-2">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${settings["contact.email"]}`} className="hover:text-brand-300">
                  {settings["contact.email"]}
                </a>
              </li>
              <li className="flex gap-2">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="whitespace-pre-line">{settings["contact.hours"]}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Ikuti Kami</h3>
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-ink-300 transition hover:border-brand-500 hover:text-brand-300"
                  >
                    <Icon name={social.icon} className="h-4.5 w-4.5" />
                  </a>
                ))}
            </div>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full">
              <Icon name="whatsapp" className="h-4 w-4" />
              Chat WhatsApp
            </a>
            <p className="mt-4 text-xs text-ink-400">{settings["company.kbli"]}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings["footer.copyright"]}</p>
          <p>{settings["company.name"]}</p>
        </div>
      </div>
    </footer>
  );
}
