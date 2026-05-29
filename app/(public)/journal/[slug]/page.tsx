import Link from "next/link";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

const categoryLabel: Record<string, string> = {
  terrain: "Terrain",
  "project-update": "Mise a jour projet",
  association: "Association"
};

function toLocalized(val: any): { fr: string } {
  if (!val) return { fr: "" };
  if (typeof val === "string") return { fr: val };
  return { fr: val.fr || "" };

}

function resolveImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: any = null;
  let allPosts: any[] = [];
  try {
    const res = await fetch(`${API}/posts?per_page=50`, { cache: "no-store" });
    const body = await res.json();
    allPosts = body.data || [];
    post = allPosts.find((item: any) => item.slug === slug);
  } catch {}

  if (!post) notFound();

  const title = toLocalized(post.title);
  const excerpt = toLocalized(post.excerpt);
  const content = toLocalized(post.content);
  const location = toLocalized(post.location);
  const image = resolveImageUrl(post.image ?? post.cover_image ?? "");
  const relatedPosts = allPosts.filter((item: any) => item.slug !== slug).slice(0, 3);
  const body = [content.fr];

  const supportingImages = [
    image,
    resolveImageUrl("/assets/about.jpeg"),
    resolveImageUrl("/assets/whats.jpeg"),
  ];

  return (
    <div className="bg-white">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.14),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_56%,_#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="rounded-full bg-primary px-4 py-2 text-white">{categoryLabel[post.category] || post.category}</span>
                <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">{location.fr}</span>
                <span className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-secondary">{post.read_time || post.readTime || "5 min"}</span>
              </div>
              <h1 className="text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">{title.fr}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{excerpt.fr}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/journal"
                  className="rounded-button border border-secondary/18 bg-white px-6 py-3.5 text-center font-semibold text-secondary transition hover:bg-secondary/6"
                >
                  &larr; Retour au journal
                </Link>
                <Link
                  href="/projects"
                  className="rounded-button bg-primary px-6 py-3.5 text-center font-semibold text-white shadow-[0_16px_36px_rgba(239,146,33,0.24)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  Voir les projets
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <img src={image} alt={title.fr} className="h-[540px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/82 via-secondary/12 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="rounded-[28px] border border-white/40 bg-white/88 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{post.created_at || post.createdAt || ""}</div>
                  <div className="mt-2 text-2xl font-bold text-gray-950">Suivez nos actions et l&apos;avancement de nos projets sur le terrain.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8">
          <div className="space-y-4">
            {supportingImages.map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`${title.fr} visuel ${index + 1}`}
                className={`w-full rounded-[30px] object-cover shadow-[0_14px_36px_rgba(15,23,42,0.08)] ${index === 0 ? "h-64" : "h-52"}`}
              />
            ))}
          </div>

          <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>Article</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{post.created_at || post.createdAt || ""}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{location.fr}</span>
            </div>

            <div className="space-y-5 text-base leading-8 text-gray-700">
              {body.map((paragraph: string) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[#f7fbf4] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Point cle</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{content.fr}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Continuer la lecture</p>
            <h2 className="text-4xl font-bold text-gray-950">Continuez a suivre nos actions et reportages.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {relatedPosts.map((rp: any) => {
              const rpTitle = toLocalized(rp.title);
              const rpExcerpt = toLocalized(rp.excerpt);
              const rpImage = resolveImageUrl(rp.image ?? rp.cover_image ?? "");
              return (
                <Link
                  key={rp.id}
                  href={`/journal/${rp.slug}`}
                  className="overflow-hidden rounded-[30px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
                >
                  <img src={rpImage} alt={rpTitle.fr} className="h-56 w-full object-cover" />
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      <span>{categoryLabel[rp.category] || rp.category}</span>
                      <span>{rp.created_at || rp.createdAt || ""}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950">{rpTitle.fr}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{rpExcerpt.fr}</p>
                    <div className="mt-5 text-sm font-semibold text-primary">Lire l&apos;article</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
