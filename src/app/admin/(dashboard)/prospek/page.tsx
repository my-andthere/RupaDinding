import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { buildProjectBriefMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import { deleteLeadAction, updateLeadStatusAction } from "@/app/actions/admin";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Prospek Project Brief" };

const leadStatuses = ["baru", "menunggu", "survei", "closing", "batal"];

export default async function AdminLeadsPage() {
  const [leads, settings] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    getSettings(),
  ]);

  async function changeStatus(formData: FormData) {
    "use server";
    await updateLeadStatusAction(String(formData.get("id")), String(formData.get("status")));
  }

  async function removeLead(formData: FormData) {
    "use server";
    await deleteLeadAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Prospek Project Brief"
        description="Permintaan jasa dari formulir Project Brief Generator. Status Conversion dihitung terpisah dari pesanan produk."
      />

      {leads.length === 0 ? (
        <EmptyState
          title="Belum ada prospek"
          description="Prospek akan muncul ketika pengunjung mengirim Project Brief melalui halaman layanan."
        />
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => {
            const waLink = buildWhatsAppUrl(
              settings["contact.whatsapp"],
              buildProjectBriefMessage({
                name: lead.name,
                company: lead.company ?? undefined,
                phone: lead.phone,
                email: lead.email ?? undefined,
                packageType: lead.packageType,
                textureType: lead.textureType ?? undefined,
                areaSize: lead.areaSize,
                surfaceCondition: lead.surfaceCondition ?? undefined,
                city: lead.city ?? undefined,
                notes: lead.notes ?? undefined,
              }),
            );

            return (
              <AdminCard key={lead.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink-900">{lead.name}</p>
                      <StatusBadge value={lead.status} />
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                        {lead.packageType === "tenaga" ? "Tenaga saja" : "Bundling"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      {lead.company ? `${lead.company} · ` : ""}
                      {lead.phone}
                      {lead.email ? ` · ${lead.email}` : ""}
                    </p>

                    <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs text-ink-400">Motif</dt>
                        <dd className="font-semibold text-ink-800">{lead.textureType ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-400">Luas area</dt>
                        <dd className="font-semibold text-ink-800">
                          {lead.areaSize ? `${lead.areaSize} m²` : "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-400">Kondisi dinding</dt>
                        <dd className="font-semibold text-ink-800">{lead.surfaceCondition ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-400">Lokasi</dt>
                        <dd className="font-semibold text-ink-800">{lead.city ?? "-"}</dd>
                      </div>
                    </dl>

                    {lead.notes ? (
                      <p className="mt-3 rounded-xl bg-sand-50 p-3 text-sm text-ink-600">{lead.notes}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-ink-400">
                      Sumber: {lead.source} &middot; {formatDateTime(lead.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary px-4 py-2 text-xs">
                      <Icon name="whatsapp" className="h-3.5 w-3.5" />
                      Balas di WhatsApp
                    </a>
                    <form action={changeStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <select name="status" className="input py-1.5 text-xs" defaultValue={lead.status}>
                        {leadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn-secondary px-3 py-2 text-xs">
                        Ubah
                      </button>
                    </form>
                    <form action={removeLead}>
                      <input type="hidden" name="id" value={lead.id} />
                      <button type="submit" className="btn px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
