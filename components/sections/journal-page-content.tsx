"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { posts } from "@/lib/mock-data/posts";

const categoryFilters = [
  { id: "all", label: "Tout" },
  { id: "terrain", label: "Terrain" },
  { id: "project-update", label: "Mises a jour projet" },
  { id: "association", label: "Association" }
] as const;

const categoryLabel: Record<(typeof categoryFilters)[number]["id"], string> = {
  all: "Tout",
  terrain: "Terrain",
  "project-update": "Mise a jour projet",
  association: "Association"
};

const PAGE_SIZE = 6;

export function JournalPageContent() {
  const featuredPosts = posts.slice(0, 3);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<(typeof categoryFilters)[number]["id"]>("all");
  const [selectedPostId, setSelectedPostId] = useState(posts[0]?.id ?? "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (featuredPosts.length <= 1) return;
    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % featuredPosts.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [featuredPosts.length]);

  const visiblePosts = useMemo(() => {
    return posts.filter((post) => activeCategory === "all" || post.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / PAGE_SIZE));

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visiblePosts.slice(start, start + PAGE_SIZE);
  }, [page, visiblePosts]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (!visiblePosts.length) return;
    const selectedStillVisible = visiblePosts.some((post) => post.id === selectedPostId);
    if (!selectedStillVisible) {
      setSelectedPostId(visiblePosts[0].id);
      return;
    }

    const selectedOnCurrentPage = paginatedPosts.some((post) => post.id === selectedPostId);
    if (!selectedOnCurrentPage && paginatedPosts[0]) {
      setSelectedPostId(paginatedPosts[0].id);
    }
  }, [paginatedPosts, selectedPostId, visiblePosts]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const heroPost = featuredPosts[heroIndex] ?? posts[0];
  const selectedPost =
    paginatedPosts.find((post) => post.id === selectedPostId) ??
    visiblePosts.find((post) => post.id === selectedPostId) ??
    paginatedPosts[0] ??
    visiblePosts[0] ??
    posts[0];

  const imageStrip = [...posts, ...posts];

  return (
    <div className="bg-white">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.16),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_58%,_#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-primary">Journal</p>
              <h1 className="text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">
                Images, actions, suivis: un journal qui donne envie d&apos;ouvrir les articles.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Ici on ne veut pas une simple liste d&apos;actualites. On veut un espace vivant, editorial et tres visuel pour raconter le terrain, les projets et la mission.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-primary/16 bg-primary/6 px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="text-3xl font-bold text-gray-950">{posts.length}</div>
                <div className="mt-1 text-sm text-gray-600">Articles visibles</div>
              </div>
              <div className="rounded-[24px] border border-secondary/14 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="text-3xl font-bold text-gray-950">{posts.filter((post) => post.category === "terrain").length}</div>
                <div className="mt-1 text-sm text-gray-600">Recits terrain</div>
              </div>
              <div className="rounded-[24px] border border-secondary/14 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="text-3xl font-bold text-gray-950">{posts.filter((post) => post.category === "project-update").length}</div>
                <div className="mt-1 text-sm text-gray-600">Suivis projet</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[36px] shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <img src={heroPost.image} alt={heroPost.title.fr} className="journal-hero-slide h-[560px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/88 via-secondary/18 to-transparent" />

              <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                <div className="rounded-full bg-white/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary backdrop-blur">
                  {categoryLabel[heroPost.category]}
                </div>
                <div className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                  {heroPost.readTime}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-3xl rounded-[28px] border border-white/45 bg-white/90 p-6 backdrop-blur">
                  <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <span>{heroPost.location.fr}</span>
                    <span>{heroPost.createdAt}</span>
                  </div>
                  <h2 className="mt-3 text-3xl font-bold text-gray-950 md:text-4xl">{heroPost.title.fr}</h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700">{heroPost.excerpt.fr}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/journal/${heroPost.slug}`}
                      className="rounded-button bg-primary px-6 py-3.5 text-center font-semibold text-white shadow-[0_16px_36px_rgba(239,146,33,0.24)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Lire l&apos;article
                    </Link>
                    <Link
                      href="/projects"
                      className="rounded-button border border-secondary/18 bg-white px-6 py-3.5 text-center font-semibold text-secondary transition hover:bg-secondary/6"
                    >
                      Explorer les projets
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {featuredPosts.map((post, index) => {
                const active = index === heroIndex;
                return (
                  <button
                    key={post.id}
                    onClick={() => setHeroIndex(index)}
                    className={`group overflow-hidden rounded-[30px] border text-left transition-all ${
                      active
                        ? "border-primary bg-orange-50 shadow-[0_18px_50px_rgba(239,146,33,0.18)]"
                        : "border-secondary/12 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] hover:-translate-y-1"
                    }`}
                  >
                    <div className="grid gap-4 p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                      <div className="relative overflow-hidden rounded-[22px]">
                        <img src={post.image} alt={post.title.fr} className="h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
                          {categoryLabel[post.category]}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
                          <span className={active ? "text-primary" : "text-secondary"}>{post.location.fr}</span>
                          <span className="text-gray-500">{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-950">{post.title.fr}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{post.excerpt.fr}</p>
                        <div className="mt-4 text-sm font-semibold text-primary">Mettre en avant</div>
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="rounded-[30px] border border-secondary/12 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Lecture rapide</div>
                <h3 className="text-2xl font-bold text-gray-950">Le journal doit pousser vers le detail, pas juste montrer des cartes.</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Chaque entree doit pouvoir servir d&apos;apercu, puis laisser une vraie place a la lecture de l&apos;article complet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-secondary/10 bg-white py-5">
        <div className="journal-strip">
          <div className="journal-strip-track flex gap-4">
            {imageStrip.map((post, index) => (
              <div key={`${post.id}-${index}`} className="relative overflow-hidden rounded-[24px]">
                <img src={post.image} alt={post.title.fr} className="h-32 w-48 object-cover sm:h-36 sm:w-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {categoryLabel[post.category]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-3">
            {categoryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeCategory === filter.id
                    ? "bg-primary text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)]"
                    : "bg-white text-gray-700 ring-1 ring-secondary/14 hover:text-secondary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-[24px] bg-[#f7fbf4] px-5 py-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-950">{visiblePosts.length}</span> articles trouves
                </div>
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-950">{page}</span> / {totalPages}
                </div>
              </div>

              {paginatedPosts.map((post) => {
                const active = post.id === selectedPost.id;

                return (
                  <div
                    key={post.id}
                    className={`overflow-hidden rounded-[30px] border transition-all ${
                      active
                        ? "border-primary bg-orange-50 shadow-[0_18px_50px_rgba(239,146,33,0.16)]"
                        : "border-secondary/10 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <button onClick={() => setSelectedPostId(post.id)} className="group w-full text-left">
                      <div className="grid gap-4 p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                        <div className="relative overflow-hidden rounded-[22px]">
                          <img src={post.image} alt={post.title.fr} className="h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
                            {categoryLabel[post.category]}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                            <span className={active ? "text-primary" : "text-secondary"}>{post.location.fr}</span>
                            <span>{post.createdAt}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-950">{post.title.fr}</h2>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{post.excerpt.fr}</p>
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-col gap-3 border-t border-secondary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600">Clique la carte pour voir l&apos;apercu a droite.</div>
                      <Link
                        href={`/journal/${post.slug}`}
                        className="rounded-button bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                      >
                        Lire l&apos;article
                      </Link>
                    </div>
                  </div>
                );
              })}

              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-secondary/10 bg-white px-5 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                  >
                    Precedent
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                          pageNumber === page
                            ? "bg-primary text-white shadow-[0_12px_24px_rgba(239,146,33,0.22)]"
                            : "bg-white text-gray-700 ring-1 ring-secondary/12 hover:text-secondary"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                  >
                    Suivant
                  </button>
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-[34px] border border-secondary/12 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="relative">
                  <img src={selectedPost.image} alt={selectedPost.title.fr} className="h-[280px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/75 via-secondary/10 to-transparent" />
                  <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
                    <div className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
                      {categoryLabel[selectedPost.category]}
                    </div>
                    <div className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      {selectedPost.readTime}
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <div className="mb-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                    {selectedPost.location.fr}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-950">{selectedPost.title.fr}</h2>
                  <p className="mb-5 text-base leading-7 text-gray-600">{selectedPost.excerpt.fr}</p>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-primary/6 p-5">
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="mt-1 font-bold text-gray-950">{categoryLabel[selectedPost.category]}</div>
                    </div>
                    <div className="rounded-2xl bg-secondary/6 p-5">
                      <div className="text-sm text-gray-500">Publication</div>
                      <div className="mt-1 font-bold text-gray-950">{selectedPost.createdAt}</div>
                    </div>
                  </div>

                  <div className="mb-6 rounded-[24px] bg-[#f7fbf4] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Apercu article</div>
                    <p className="mt-2 text-sm leading-7 text-gray-700">{selectedPost.content.fr}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                      href={`/journal/${selectedPost.slug}`}
                      className="rounded-button bg-primary px-6 py-3.5 text-center text-base font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Ouvrir l&apos;article
                    </Link>
                    <Link
                      href="/projects"
                      className="rounded-button border border-secondary/18 bg-white px-6 py-3.5 text-center text-base font-semibold text-secondary transition hover:bg-secondary/6"
                    >
                      Voir les projets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
