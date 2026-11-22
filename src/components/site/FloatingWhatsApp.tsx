import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

export async function FloatingWhatsApp() {
  const settings = await getSettings();
  const link = buildWhatsAppUrl(
    settings["contact.whatsapp"],
    "Halo RupaDinding, saya butuh informasi produk cat tekstur atau jasa aplikator.",
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105 hover:brightness-95 sm:right-6 sm:bottom-6"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
