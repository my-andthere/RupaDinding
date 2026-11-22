import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Artikel" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={post.title}
        description={`Slug: ${post.slug} · ${post.views} kali dibaca`}
        action={
          <div className="flex gap-2">
            <Link href={`/blog/${post.slug}`} target="_blank" className="btn-secondary">
              <Icon name="arrowRight" className="h-4 w-4" />
              Lihat
            </Link>
            <Link href="/admin/artikel" className="btn-secondary">
              <Icon name="arrowLeft" className="h-4 w-4" />
              Kembali
            </Link>
          </div>
        }
      />
      <AdminCard title="Isi artikel">
        <PostForm
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage ?? "/images/blog/default.svg",
            tags: post.tags,
            status: post.status,
            author: post.author,
          }}
        />
      </AdminCard>
    </div>
  );
}
