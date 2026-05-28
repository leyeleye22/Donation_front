"use client";

import Link from "next/link";
import { SectionVisibility } from "@/components/ui/section-visibility";
import { useEffect, useState } from "react";
import { loadAboutContent, type AboutEditorContent, defaultAboutEditorContent } from "@/lib/admin/about-content";
import { resolveImageUrl } from "@/lib/image-url";

export default function AboutPage() {
  const [cms, setCms] = useState<AboutEditorContent | null>(null);
  useEffect(() => { loadAboutContent().then(setCms); }, []);

  if (!cms) return <div className="bg-white min-h-screen" />;

  return (
    <div className="bg-white">
      <SectionVisibility section="hero">
        <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.18),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_56%,_#fff7ed_100%)]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-lg rounded-[28px] border border-white/60 bg-white/90 p-6 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                    Presence terrain
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-gray-950">
                    Une association humanitaire se comprend aussi par ce qu&apos;elle montre.
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[resolveImageUrl("/assets/about.jpeg"), resolveImageUrl("/assets/consultation.jpeg"), resolveImageUrl("/assets/classe.jpeg"), resolveImageUrl("/assets/whats.jpeg")].slice(1).map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Action terrain ${index + 1}`}
                  className={`w-full rounded-[28px] object-cover ${
                    index === 0 ? "h-44" : index === 1 ? "h-56" : "h-36"
                  }`}
                />
              ))}
            </div>
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
            <div className="rounded-[32px] bg-[#f7fbf4] p-8">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Ce que cette page doit dire</div>
              <h3 className="text-3xl font-bold text-gray-950">L&apos;association d&apos;abord, parce que c&apos;est elle qui porte le sens.</h3>
              <p className="mt-4 text-base font-medium text-secondary">{"Entr'aide pour Servir l'Humanite"}</p>
              <p className="mt-2 text-base font-medium text-secondary">{"Association humanitaire et solidaire"}</p>
              <div className="mt-4 space-y-4 text-lg leading-8 text-gray-600">
                {cms.story.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-primary/10 bg-primary/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Mission</div>
                <p className="mt-3 text-lg leading-7 text-gray-700">
                  Eau, sante, education et appui communautaire comme axes concrets d&apos;intervention.
                </p>
              </div>
              <div className="rounded-[28px] border border-secondary/10 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Methodes</div>
                <p className="mt-3 text-lg leading-7 text-gray-700">
                  Suivi de projets, visuels de terrain, journal d&apos;actualites et presentation plus transparente.
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>
      </SectionVisibility>

      <section className="bg-[#f8f5ef] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
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
                <div className="space-y-5 text-lg leading-8 text-gray-600">
                  <p>
                    Le parcours, la motivation initiale, le lien avec le terrain et la raison d&apos;etre de l&apos;association.
                  </p>
                  <p>
                    La date de creation, la reconnaissance officielle et l&apos;orientation des actions menees au Senegal et au Niger.
                  </p>
                  <p>
                    Nom complet, photo officielle, citation fondatrice, parcours et responsabilites institutionnelles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Actions de terrain</p>
            <h2 className="text-4xl font-bold text-gray-950">Ici, les photos doivent servir l'information.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Cette partie relie directement les visuels aux explications. Le but n&apos;est pas seulement de montrer des scenes,
              mais de faire comprendre ce que l&apos;association fait et pourquoi.
            </p>
          </div>

          <div className="grid gap-6">
            {cms.actionStories.map((story, index) => (
              <div
                key={story.title}
                className={`grid gap-6 rounded-[32px] border border-secondary/10 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-6 lg:grid-cols-[0.95fr_1.05fr] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f7fbf4]"
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

      <section className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_55%,_#fff7ed_100%)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-secondary/10">
              <div className="bg-[linear-gradient(135deg,_rgba(239,146,33,0.96)_0%,_rgba(65,182,75,0.96)_100%)] px-8 py-8 text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">Valeurs</p>
                <h2 className="text-4xl font-bold">Les principes qui structurent l&apos;association.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
                  Une association ne se presente pas seulement par ses dates ou ses projets. Elle se lit aussi a travers la maniere dont elle agit, parle, accompagne et construit la confiance.
                </p>
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
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Valeur {index + 1}</div>
                    <h3 className="text-2xl font-bold text-gray-950">{value.title}</h3>
                    <p className="mt-3 leading-7 text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-secondary/10">
              <div className="border-b border-secondary/10 bg-[#f7fbf4] px-8 py-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Trajectoire</p>
                <h2 className="text-4xl font-bold text-gray-950">Une page a propos doit aussi donner un sens du temps.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                  La trajectoire donne du poids a la mission. Elle montre d&apos;ou vient l&apos;association, comment elle s&apos;est consolidee et vers quoi elle se structure aujourd&apos;hui.
                </p>
              </div>

              <div className="space-y-8 p-8">
                {cms.timeline.map((item, index) => (
                  <div key={item.year} className="relative pl-12">
                    {index !== cms.timeline.length - 1 ? (
                      <div className="absolute left-[19px] top-12 h-[calc(100%+1.5rem)] w-[2px] bg-gradient-to-b from-primary/40 to-secondary/30" />
                    ) : null}
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-[0_10px_24px_rgba(239,146,33,0.25)]">
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
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-[linear-gradient(90deg,_rgba(239,146,33,0.94)_0%,_rgba(65,182,75,0.96)_100%)] p-8 text-white lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-orange-100">Credibilite</div>
                <h2 className="text-4xl font-bold">{cms.calloutTitle}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">{cms.calloutDescription}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/projects"
                  className="rounded-button bg-white px-6 py-3 text-center text-base font-semibold text-primary transition hover:bg-gray-100"
                >
                  {cms.calloutPrimaryCta}
                </Link>
                <Link
                  href="/#multimedia"
                  className="rounded-button border-2 border-white bg-transparent px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-primary"
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
