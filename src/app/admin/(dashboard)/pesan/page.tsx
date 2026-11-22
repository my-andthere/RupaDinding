import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { deleteContactMessageAction, markContactReadAction } from "@/app/actions/admin";
import { AdminCard, AdminPageHeader, EmptyState } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pesan Masuk" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  async function markRead(formData: FormData) {
    "use server";
    await markContactReadAction(String(formData.get("id")));
  }

  async function removeMessage(formData: FormData) {
    "use server";
    await deleteContactMessageAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pesan Masuk"
        description="Pesan dari formulir kontak pada halaman website."
      />

      {messages.length === 0 ? (
        <EmptyState title="Belum ada pesan" description="Pesan pengunjung akan tampil di sini." />
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <AdminCard key={message.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink-900">{message.name}</p>
                    {message.subject ? (
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                        {message.subject}
                      </span>
                    ) : null}
                    {!message.isRead ? (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                        Baru
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    {message.email}
                    {message.phone ? ` · ${message.phone}` : ""} · {formatDateTime(message.createdAt)}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm text-ink-700">{message.message}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!message.isRead ? (
                    <form action={markRead}>
                      <input type="hidden" name="id" value={message.id} />
                      <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                        Tandai dibaca
                      </button>
                    </form>
                  ) : null}
                  <form action={removeMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
