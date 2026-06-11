import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import { mapPost } from "@/lib/api-mappers";
import { fetchPublic } from "@/lib/server-api";
import { sanitizeHtml } from "@/lib/sanitize-html";

const categoryLabel: Record<string, string> = {
  terrain: "Terrain",
  "project-update": "Mise a jour projet",
  association: "Association",
};

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await fetchPublic<Record<string, unknown>>(`/posts/slug/${slug}`);
  if (!post) notFound();

  const listRes = await fetchPublic<{ data?: Record<string, unknown>[] }>("/posts?per_page=4&published=1");
  const relatedPosts = (listRes?.data || []).filter((item) => item.slug !== slug).slice(0, 3);

  const mapped = mapPost(post);
  const title = mapped.title.fr;
  const excerpt = mapped.excerpt.fr;
  const content = mapped.content.fr;
  const location = mapped.location.fr;
  const image = mapped.image;

  return (
    <div className="bg-white">
      <section className="bg-page-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="rounded-full bg-primary px-4 py-2 text-white">
                  {categoryLabel[mapped.category] || mapped.category}
                </span>
                {location ? <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">{location}</span> : null}
                <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">
                  {mapped.readTime}
                </span>
              </div>
              <h1 className="text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">{title}</h1>
              {excerpt ? <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{excerpt}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/journal" className="btn-outline btn-md">&larr; Retour au journal</Link>
                <Link href="/projects" className="btn-primary btn-md">Voir les projets</Link>
              </div>
            </div>

            {image ? (
            <div className="relative overflow-hidden rounded-[36px] shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <img src={image} alt={title} className="h-[540px] w-full object-cover" />
              <div className="overlay-image" />
            </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>Article</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{formatDate(mapped.createdAt)}</span>
              {location ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{location}</span>
                </>
              ) : null}
            </div>
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content || "") }} />
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
      <section className="bg-page-section py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-950">A lire aussi</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedPosts.map((rp) => {
              const related = mapPost(rp);
              return (
                <Link
                  key={related.id}
                  href={`/journal/${related.slug}`}
                  className="overflow-hidden rounded-[30px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
                >
                  {related.image ? <img src={related.image} alt={related.title.fr} className="h-56 w-full object-cover" /> : null}
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      <span>{categoryLabel[related.category] || related.category}</span>
                      <span>{formatDate(related.createdAt)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950">{related.title.fr}</h3>
                    {related.excerpt.fr ? <p className="mt-3 text-sm leading-7 text-gray-600">{related.excerpt.fr}</p> : null}
                    <div className="mt-5 text-sm font-semibold text-primary">Lire l&apos;article</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
