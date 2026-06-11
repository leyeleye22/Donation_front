"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { mapGalleryItem } from "@/lib/api-mappers";
import { useSettings } from "@/lib/settings-context";
import { Skeleton } from "@/components/ui/skeleton";

type GalleryDisplayItem = { id: string; title: string; image: string; category: string };

const filters = [
  { id: "all", label: "Tout" },
  { id: "terrain", label: "Terrain" },
  { id: "education", label: "Education" },
  { id: "sante", label: "Sante" },
  { id: "eau", label: "Eau" }
] as const;

export function GalleryPageContent() {
  const pageHero = useSettings().pageSettings["/gallery"];
  const [baseItems, setBaseItems] = useState<GalleryDisplayItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getGallery().then((res) => {
      const items: any[] = res?.data ?? [];
      setBaseItems(items.map((g: any) => {
        const mapped = mapGalleryItem(g);
        const cat = Array.isArray(mapped.category) && mapped.category.length > 0
          ? mapped.category[0] : "general";
        return { id: mapped.id, title: mapped.title.fr, image: mapped.image, category: cat };
      }));
      setLoaded(true);
    }).catch((e) => { console.error("GalleryPageContent: failed to load gallery", e); setLoaded(true); });
  }, []);

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
    }, 5000);

    return () => window.clearInterval(interval);
  }, [visibleItems]);

  const featuredItem = visibleItems[activeSlide] ?? baseItems[0];
  const lightboxItem = selectedIndex !== null ? visibleItems[selectedIndex] : null;

  if (!loaded || baseItems.length === 0) {
    return (
      <div className="overflow-hidden bg-page-hero">
        <section className="px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-12 w-full max-w-[500px]" />
              </div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <Skeleton className="h-[560px] rounded-[36px]" />
              <div className="grid gap-4">
                <Skeleton className="h-52 rounded-[30px]" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-[24px]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="rounded-[28px]" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showNext = () => setSelectedIndex((current) => (current === null ? 0 : (current + 1) % visibleItems.length));
  const showPrev = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current - 1 + visibleItems.length) % visibleItems.length));

  return (
    <div className="overflow-hidden bg-page-hero">
      <section className="px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              {pageHero?.heroEyebrow ? <p className="page-eyebrow-alt mb-2">{pageHero.heroEyebrow}</p> : null}
              {pageHero?.heroTitle ? <h1 className="text-4xl font-bold text-gray-950 sm:text-5xl">{pageHero.heroTitle}</h1> : null}
              {pageHero?.heroDescription ? <p className="mt-3 max-w-2xl text-lg text-gray-600">{pageHero.heroDescription}</p> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={activeFilter === filter.id ? "chip-active" : "chip-inactive"}
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
              <div className="overlay-image" />
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
                <div className="overlay-image-soft opacity-90 transition duration-300 group-hover:opacity-100" />
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
                <div className="rounded-[28px] bg-orange-50/50 p-6">
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
