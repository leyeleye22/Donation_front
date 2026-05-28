"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "@/lib/image-url";

const baseItems = [
  { id: "gallery-1", title: "Education", image: resolveImageUrl("/assets/education.jpeg"), category: "education" },
  { id: "gallery-2", title: "Consultation", image: resolveImageUrl("/assets/consultation.jpeg"), category: "sante" },
  { id: "gallery-3", title: "Acces a l'eau", image: resolveImageUrl("/assets/puits.jpeg"), category: "eau" },
  { id: "gallery-4", title: "Terrain", image: resolveImageUrl("/assets/whats.jpeg"), category: "terrain" },
  { id: "gallery-5", title: "Classe", image: resolveImageUrl("/assets/classe.jpeg"), category: "education" },
  { id: "gallery-6", title: "Equipe", image: resolveImageUrl("/assets/about.jpeg"), category: "terrain" },
  { id: "gallery-7", title: "Point d'eau", image: resolveImageUrl("/assets/3.jpeg"), category: "eau" },
  { id: "gallery-8", title: "Soutien", image: resolveImageUrl("/assets/educationn.jpeg"), category: "education" },
  { id: "gallery-9", title: "Mobilisation", image: resolveImageUrl("/assets/partenaire.jpeg"), category: "terrain" },
  { id: "gallery-10", title: "Sante", image: resolveImageUrl("/assets/santee.jpg"), category: "sante" }
];

const filters = [
  { id: "all", label: "Tout" },
  { id: "terrain", label: "Terrain" },
  { id: "education", label: "Education" },
  { id: "sante", label: "Sante" },
  { id: "eau", label: "Eau" }
] as const;

export function GalleryPageContent() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return baseItems;
    return baseItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    setActiveSlide(0);
    setSelectedIndex(null);
  }, [activeFilter]);

  useEffect(() => {
    if (visibleItems.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % visibleItems.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [visibleItems]);

  const featuredItem = visibleItems[activeSlide] ?? baseItems[0];
  const lightboxItem = selectedIndex !== null ? visibleItems[selectedIndex] : null;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showNext = () => setSelectedIndex((current) => (current === null ? 0 : (current + 1) % visibleItems.length));
  const showPrev = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current - 1 + visibleItems.length) % visibleItems.length));

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_52%,_#fff7ed_100%)]">
      <section className="px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Galerie</p>
              <h1 className="text-4xl font-bold text-gray-950 sm:text-5xl">Des images, du rythme, du terrain.</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    activeFilter === filter.id
                      ? "bg-primary text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)]"
                      : "bg-white text-gray-700 ring-1 ring-secondary/12 hover:-translate-y-0.5 hover:text-secondary"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="relative overflow-hidden rounded-[36px] shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
              <img
                key={featuredItem.id}
                src={featuredItem.image}
                alt={featuredItem.title}
                className="gallery-hero-slide h-[560px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/78 via-secondary/8 to-transparent" />
              <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                <div className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
                  {featuredItem.category}
                </div>
                <div className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Slide {activeSlide + 1}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-md rounded-[28px] border border-white/50 bg-white/88 p-5 backdrop-blur">
                  <h2 className="text-3xl font-bold text-gray-950">{featuredItem.title}</h2>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="gallery-strip overflow-hidden rounded-[30px] border border-secondary/10 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                <div className="gallery-strip-track flex gap-4">
                  {[...visibleItems, ...visibleItems].map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      onClick={() => {
                        const nextIndex = visibleItems.findIndex((entry) => entry.id === item.id);
                        setActiveSlide(nextIndex);
                        openLightbox(nextIndex);
                      }}
                      className="group min-w-[180px] overflow-hidden rounded-[24px]"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-52 w-[180px] rounded-[24px] object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {visibleItems.slice(0, 4).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSlide(index)}
                    className={`overflow-hidden rounded-[24px] border p-0 text-left transition ${
                      activeSlide === index
                        ? "border-primary shadow-[0_16px_42px_rgba(239,146,33,0.18)]"
                        : "border-secondary/10 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:-translate-y-1"
                    }`}
                  >
                    <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
                className={`gallery-tile group relative overflow-hidden rounded-[28px] text-left shadow-[0_12px_36px_rgba(15,23,42,0.07)] ${
                  index % 6 === 0 ? "sm:row-span-2 sm:min-h-[456px]" : ""
                } ${index % 5 === 2 ? "lg:col-span-2" : ""}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:rotate-[0.4deg]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                      {item.category}
                    </div>
                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                    Ouvrir
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4">
          <div className="w-full max-w-6xl rounded-[34px] bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                {lightboxItem.category}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={showPrev}
                  className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/6"
                >
                  Prev
                </button>
                <button
                  onClick={showNext}
                  className="rounded-full border border-secondary/14 bg-white px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/6"
                >
                  Next
                </button>
                <button
                  onClick={closeLightbox}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <img src={lightboxItem.image} alt={lightboxItem.title} className="h-[72vh] w-full rounded-[28px] object-cover" />
              <div className="grid gap-4">
                <div className="rounded-[28px] bg-[#f7fbf4] p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Focus</div>
                  <h3 className="mt-2 text-3xl font-bold text-gray-950">{lightboxItem.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {visibleItems
                    .filter((item) => item.id !== lightboxItem.id)
                    .slice(0, 4)
                    .map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => openLightbox(visibleItems.findIndex((entry) => entry.id === item.id))}
                        className="overflow-hidden rounded-[22px] shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
                      >
                        <img src={item.image} alt={item.title} className="h-36 w-full object-cover transition duration-500 hover:scale-105" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
