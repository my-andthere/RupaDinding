import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & Panduan Cat Tekstur",
  description:
    "Panduan praktis menghitung kebutuhan cat tekstur, memilih jenis tekstur, dan tips hemat pengecatan dinding dari tim RupaDinding.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const posts = await prisma.blogPost.findMany({
    where: { status: "published", ...(params.tag ? { tags: { contains: params.tag } } : {}) },
    orderBy: { publishedAt: "desc" },
  });
  const tags = Array.from(
    new Set(
      posts.flatMap((post) =>
        post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ),
  );

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Beranda" }, { label: "Blog" }]} />

      <div className="mt-5 max-w-2xl">
        <span className="eyebrow">
          <Icon name="fileText" className="h-3.5 w-3.5" />
          Edukasi & SEO
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Blog & Panduan
        </h1>
        <p className="mt-3 text-ink-600">
          Artikel teknis untuk membantu Anda menghitung kebutuhan cat, memilih motif, dan menyiapkan
          permukaan dinding dengan benar.
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !params.tag
                ? "bg-ink-900 text-white"
                : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            Semua topik
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                params.tag === tag
                  ? "bg-ink-900 text-white"
                  : "border border-sand-300 bg-white text-ink-600 hover:border-brand-300"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-sand-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage || "/images/blog/default.svg"}
                alt={post.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs text-ink-400">
                {post.tags} &middot; {formatDate(post.publishedAt ?? post.createdAt)}
              </p>
              <h2 className="mt-2 text-lg font-bold text-ink-900 group-hover:text-brand-700">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-ink-500">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Baca artikel
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-ink-600">Belum ada artikel untuk topik ini.</div>
      ) : null}
    </div>
  );
}
