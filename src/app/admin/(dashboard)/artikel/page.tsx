import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deletePostAction, togglePostAction } from "@/app/actions/admin";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Artikel & Blog" };

export default async function AdminPostsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  async function removePost(formData: FormData) {
    "use server";
    await deletePostAction(String(formData.get("id")));
  }

  async function togglePost(formData: FormData) {
    "use server";
    await togglePostAction(String(formData.get("id")));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artikel & Blog"
        description="Kelola konten edukasi SEO, tautan internal ke produk, dan kalkulator cat."
        action={
          <Link href="/admin/artikel/baru" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            Artikel baru
          </Link>
        }
      />

      {posts.length === 0 ? (
        <EmptyState title="Belum ada artikel" description="Mulai menulis panduan untuk attracting trafik organik." />
      ) : (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs tracking-wide text-ink-500 uppercase">
                <tr>
                  <th className="pb-2 font-semibold">Judul</th>
                  <th className="pb-2 font-semibold">Tag</th>
                  <th className="pb-2 font-semibold">Views</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="py-3">
                      <Link href={`/admin/artikel/${post.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                        {post.title}
                      </Link>
                      <span className="block text-xs text-ink-400">
                        /blog/{post.slug} &middot; {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-ink-500">{post.tags}</td>
                    <td className="py-3 text-ink-700">{post.views}</td>
                    <td className="py-3">
                      <StatusBadge value={post.status} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={togglePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                            {post.status === "published" ? "Draft" : "Terbitkan"}
                          </button>
                        </form>
                        <form action={removePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <button type="submit" className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
