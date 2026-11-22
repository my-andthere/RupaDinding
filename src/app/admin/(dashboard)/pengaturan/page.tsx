import { getSettingGroups } from "@/lib/settings";
import { saveSettingsAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pengaturan Situs" };

export default async function AdminSettingsPage() {
  const groups = await getSettingGroups();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan Situs"
        description="Identitas perusahaan, alamat toko-kantor, kanal media sosial, aturan checkout, dan catatan kepatuhan."
      />

      {groups.map(([group, settings]) => (
        <AdminCard key={group} title={group} description={`${settings.length} pengaturan pada grup ini`}>
          <ActionForm
            action={saveSettingsAction}
            className="grid gap-4 sm:grid-cols-2"
            submitLabel={`Simpan ${group}`}
          >
            {settings.map((setting) => (
              <div key={setting.key} className={setting.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="label">
                  {setting.label ?? setting.key}
                  <span className="ml-2 text-[11px] font-normal text-ink-400">{setting.key}</span>
                </label>
                {setting.type === "textarea" ? (
                  <textarea
                    name={`setting:${setting.key}`}
                    rows={3}
                    className="input"
                    defaultValue={setting.value}
                  />
                ) : (
                  <input
                    name={`setting:${setting.key}`}
                    className="input"
                    defaultValue={setting.value}
                    type={setting.type === "number" ? "number" : setting.type === "url" ? "url" : "text"}
                  />
                )}
                {setting.hint ? <p className="mt-1 text-[11px] text-ink-400">{setting.hint}</p> : null}
              </div>
            ))}
          </ActionForm>
        </AdminCard>
      ))}

      <div className="card border-l-4 border-l-brand-500 bg-sand-50 p-5 text-sm text-ink-600">
        <p className="flex items-center gap-2 font-semibold text-ink-900">
          <Icon name="shield" className="h-4 w-4 text-brand-600" />
          Catatan kepatuhan
        </p>
        <p className="mt-2">
          Pengaturan ini dipakai pada halaman publik: identitas dan alamat toko, kanal WhatsApp, catatan
          eceran (KBLI 47521), batas lingkup jasa (KBLI 43303), serta catatan pemisahan pembukuan produk
          dan jasa untuk PPh Final UMKM 0,5% maupun persiapan status PKP.
        </p>
      </div>
    </div>
  );
}
