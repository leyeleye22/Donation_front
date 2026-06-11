"use client";

import Link from "next/link";
import { SectionVisibility } from "@/components/ui/section-visibility";
import { useEffect, useState } from "react";
import { loadAboutContent, type AboutEditorContent } from "@/lib/admin/about-content";

export default function AboutPage() {
  const [cms, setCms] = useState<AboutEditorContent | null>(null);
  useEffect(() => { loadAboutContent().then(setCms); }, []);

  if (!cms) return <div className="bg-white min-h-screen" />;

  return (
    <div className="bg-white">
      <SectionVisibility section="hero">
        <section className="bg-page-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {cms.heroEyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] text-gray-950 md:text-6xl">
              {cms.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{cms.heroDescription}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {cms.stats.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-[24px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
                    index === 1 ? "border-primary/18 bg-primary/6" : "border-secondary/12 bg-white"
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-950">{item.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[34px] shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
              <img
                src={cms.associationImage}
                alt={"Association sur le terrain"}
                className="h-[520px] w-full object-cover"
              />
              <div className="overlay-image" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-lg rounded-[28px] border border-white/60 bg-white/90 p-6 backdrop-blur">
                  {cms.associationBadge ? (
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                    {cms.associationBadge}
                  </div>
                  ) : null}
                  {cms.associationTitle ? (
                  <h2 className="mt-2 text-2xl font-bold text-gray-950">{cms.associationTitle}</h2>
                  ) : null}
                </div>
              </div>
            </div>

            {cms.actionStories.length > 0 ? (
            <div className="grid gap-4">
              {cms.actionStories.slice(0, 3).map((story, index) => (
                <img
                  key={story.title}
                  src={story.image}
                  alt={story.title}
                  className={`w-full rounded-[28px] object-cover ${
                    index === 0 ? "h-44" : index === 1 ? "h-56" : "h-36"
                  }`}
                />
              ))}
            </div>
            ) : null}
          </div>
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="mission">
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="overflow-hidden rounded-[34px] shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <img
              src={cms.portrait}
              alt={"Entr'aide pour Servir l'Humanite"}
              className="h-full min-h-[520px] w-full object-cover"
            />
          </div>

          <div className="grid gap-5">
            {(cms.associationTitle || cms.story.length > 0) ? (
            <div className="rounded-[32px] bg-orange-50/50 p-8">
              {cms.associationBadge ? (
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{cms.associationBadge}</div>
              ) : null}
              {cms.associationTitle ? (
              <h3 className="text-3xl font-bold text-gray-950">{cms.associationTitle}</h3>
              ) : null}
              <div className="mt-4 space-y-4 text-lg leading-8 text-gray-600">
                {cms.story.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            ) : null}

            {cms.values.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {cms.values.slice(0, 2).map((value, index) => (
              <div key={value.title} className={`rounded-[28px] border p-6 ${index === 0 ? "border-primary/10 bg-primary/5" : "border-secondary/10 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]"}`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${index === 0 ? "text-primary" : "text-secondary"}`}>{value.title}</div>
                <p className="mt-3 text-lg leading-7 text-gray-700">{value.description}</p>
              </div>
              ))}
            </div>
            ) : null}
          </div>
        </div>
        </section>
      </SectionVisibility>

      <section className="bg-page-section py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="page-eyebrow-alt mb-3">
              {cms.founderBadge}
            </p>
            <h2 className="text-4xl font-bold text-gray-950">{cms.founderTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">{cms.founderSubtitle}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
                <img
                  src={cms.founderPortrait}
                  alt="Portrait fondateur"
                  className="h-full min-h-[520px] w-full object-cover"
                />
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[30px] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ring-1 ring-gray-100">
                <div className="text-lg leading-8 text-gray-600">
                  <p className="mb-5">{cms.founderQuote}</p>
                  <p className="mb-5">{cms.narrativeParagraphs[0]}</p>
                  <p>{cms.narrativeParagraphs[1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cms.actionStories.length > 0 ? (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(cms.narrativeTitle || cms.narrativeParagraphs[0]) ? (
          <div className="mb-10 max-w-3xl">
            <p className="page-eyebrow-alt mb-3">Actions de terrain</p>
            {cms.narrativeTitle ? <h2 className="text-4xl font-bold text-gray-950">{cms.narrativeTitle}</h2> : null}
            {cms.narrativeParagraphs[0] ? (
            <p className="mt-5 text-lg leading-8 text-gray-600">{cms.narrativeParagraphs[0]}</p>
            ) : null}
          </div>
          ) : null}

          <div className="grid gap-6">
            {cms.actionStories.map((story, index) => (
              <div
                key={story.title}
                className={`grid gap-6 rounded-[32px] border border-secondary/10 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-6 lg:grid-cols-[0.95fr_1.05fr] ${
                  index % 2 === 0 ? "bg-white" : "bg-green-50/40"
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <img src={story.image} alt={story.title} className="h-[280px] w-full rounded-[26px] object-cover" />
                </div>
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Information terrain</div>
                  <h3 className="text-3xl font-bold text-gray-950">{story.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-gray-600">{story.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {cms.values.length > 0 ? (
      <section className="bg-page-section py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-secondary/10">
              <div className="bg-gradient-to-br from-primary via-orange-500 to-secondary px-8 py-8 text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">Valeurs</p>
                <h2 className="text-4xl font-bold">Les principes qui structurent l&apos;association.</h2>
              </div>

              <div className="grid gap-5 p-8">
                {cms.values.map((value, index) => (
                  <div
                    key={value.title}
                    className={`rounded-[26px] border p-6 ${
                      index === 0
                        ? "border-primary/14 bg-primary/6"
                        : index === 1
                          ? "border-secondary/14 bg-secondary/6"
                          : index === 2
                            ? "border-primary/10 bg-white"
                            : "border-secondary/10 bg-[#fcfcfb]"
                    }`}
                  >
                    <div className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${index % 2 === 0 ? "text-primary" : "text-secondary"}`}>Valeur {index + 1}</div>
                    <h3 className="text-2xl font-bold text-gray-950">{value.title}</h3>
                    <p className="mt-3 leading-7 text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {cms.timeline.length > 0 ? (
            <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-secondary/10">
              <div className="border-b border-secondary/10 bg-green-50/40 px-8 py-8">
                <p className="page-eyebrow-alt mb-3">Trajectoire</p>
                <h2 className="text-4xl font-bold text-gray-950">{cms.founderTitle || "Notre parcours"}</h2>
                {cms.founderSubtitle ? (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{cms.founderSubtitle}</p>
                ) : null}
              </div>

              <div className="space-y-8 p-8">
                {cms.timeline.map((item, index) => (
                  <div key={item.year} className="relative pl-12">
                    {index !== cms.timeline.length - 1 ? (
                      <div className="absolute left-[19px] top-12 h-[calc(100%+1.5rem)] w-[2px] bg-gradient-to-b from-primary/40 to-secondary/40" />
                    ) : null}
                    <div className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${index % 2 === 0 ? "bg-primary shadow-warm" : "bg-secondary shadow-fresh"}`}>
                      {index + 1}
                    </div>
                    <div className="rounded-[26px] border border-secondary/10 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{item.year}</div>
                      <h3 className="text-2xl font-bold text-gray-950">{item.title}</h3>
                      <p className="mt-3 leading-7 text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      {cms.testimonials && cms.testimonials.length > 0 ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="page-eyebrow-alt mb-3">Temoignages</p>
              <h2 className="mb-4 text-4xl font-bold text-gray-950">La parole a ceux que nous accompagnons</h2>
              <p className="text-lg leading-8 text-gray-600">Chaque projet laisse une trace. Voici ce que les beneficiaires et partenaires nous confient.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {cms.testimonials.map((t: any) => (
                <div key={t.name} className="flex flex-col rounded-[32px] border border-secondary/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                  <div className="mb-4 text-3xl leading-none text-secondary">"</div>
                  <p className="flex-1 text-base leading-7 text-gray-700">{t.text}</p>
                  <div className="mt-6 border-t border-secondary/10 pt-4">
                    <div className="font-bold text-gray-950">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                    <div className="text-xs text-gray-400">{t.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-gradient-to-r from-primary via-orange-500 to-secondary p-8 text-white shadow-warm-lg lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-orange-100">Credibilite</div>
                <h2 className="text-4xl font-bold">{cms.calloutTitle}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">{cms.calloutDescription}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/projects"
                  className="btn-white btn-md text-center"
                >
                  {cms.calloutPrimaryCta}
                </Link>
                <Link
                  href="/#multimedia"
                  className="btn btn-md border-2 border-white bg-transparent text-center text-white hover:bg-white hover:text-primary"
                >
                  {cms.calloutSecondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
