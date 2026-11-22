import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Artikel tidak ditemukan" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, status: "published" } });
  if (!post) notFound();

  await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  const relatedProducts = post.relatedProductIds
    ? await prisma.product.findMany({ where: { id: { in: JSON.parse(post.relatedProductIds) } } })
    : [];
  const otherPosts = await prisma.blogPost.findMany({
    where: { status: "published", id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Beranda" },
          { href: "/blog", label: "Blog" },
          { label: post.title },
        ]}
      />

      <article className="mx-auto mt-6 max-w-3xl">
        <p className="text-xs text-ink-400">
          {post.tags} &middot; {formatDate(post.publishedAt ?? post.createdAt)} &middot;{" "}
          {post.views} kali dibaca
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-ink-600">{post.excerpt}</p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-sand-200 bg-sand-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage || "/images/blog/default.svg"}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className="prose-rd mt-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-ink-900">Butuh hitungan cat?</p>
            <p className="text-sm text-ink-600">
              Gunakan kalkulator untuk memastikan jumlah kemasan yang Anda beli.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/kalkulator" className="btn-primary">
              <Icon name="calculator" className="h-4 w-4" />
              Kalkulator cat
            </Link>
            <Link href="/produk" className="btn-secondary">
              Lihat produk
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink-900">Produk terkait</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produk/${product.slug}`}
                  className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-400"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>

      {otherPosts.length > 0 ? (
        <section className="mt-16">
          <h2 className="section-title">Artikel lain</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {otherPosts.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-sand-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage || "/images/blog/default.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-ink-900 group-hover:text-brand-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-500">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
