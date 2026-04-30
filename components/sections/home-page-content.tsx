"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { homeContent } from "@/lib/mock-data/home";
import { posts } from "@/lib/mock-data/posts";
import { projects } from "@/lib/mock-data/projects";

function projectProgress(goalAmount: number, collectedAmount: number) {
  return Math.round((collectedAmount / goalAmount) * 100);
}

function projectStatusLabel(status: "upcoming" | "ongoing" | "completed") {
  if (status === "ongoing") return "En cours";
  if (status === "completed") return "Accompli";
  return "A venir";
}

const homeProjectStatusFilters = [
  { id: "all", label: "Tous" },
  { id: "ongoing", label: "En cours" },
  { id: "completed", label: "Accomplis" },
  { id: "upcoming", label: "A venir" }
] as const;

const homeProjectThemeFilters = [
  { id: "all", label: "Toutes les causes" },
  { id: "water", label: "Forage / eau" },
  { id: "education", label: "Education" },
  { id: "health", label: "Sante" },
  { id: "tabaski", label: "Tabaski" },
  { id: "food", label: "Alimentaire" }
] as const;

function projectThemeLabel(theme: "education" | "water" | "health" | "tabaski" | "food") {
  if (theme === "water") return "Forage / eau";
  if (theme === "education") return "Education";
  if (theme === "health") return "Sante";
  if (theme === "tabaski") return "Tabaski";
  return "Alimentaire";
}

const HOME_PROJECT_PAGE_SIZE = 4;

export function HomePageContent() {
  const [donationOpen, setDonationOpen] = useState(false);
  const [activeProjectStatus, setActiveProjectStatus] = useState<(typeof homeProjectStatusFilters)[number]["id"]>("all");
  const [activeProjectTheme, setActiveProjectTheme] = useState<(typeof homeProjectThemeFilters)[number]["id"]>("all");
  const [homeProjectPage, setHomeProjectPage] = useState(1);
  const filteredHomeProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = activeProjectStatus === "all" || project.status === activeProjectStatus;
      const matchesTheme = activeProjectTheme === "all" || project.theme === activeProjectTheme;
      return matchesStatus && matchesTheme;
    });
  }, [activeProjectStatus, activeProjectTheme]);
  const homeProjectTotalPages = Math.max(1, Math.ceil(filteredHomeProjects.length / HOME_PROJECT_PAGE_SIZE));
  const paginatedHomeProjects = useMemo(() => {
    const start = (homeProjectPage - 1) * HOME_PROJECT_PAGE_SIZE;
    return filteredHomeProjects.slice(start, start + HOME_PROJECT_PAGE_SIZE);
  }, [filteredHomeProjects, homeProjectPage]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id ?? null);
  const activeProject =
    paginatedHomeProjects.find((project) => project.id === activeProjectId) ??
    filteredHomeProjects.find((project) => project.id === activeProjectId) ??
    paginatedHomeProjects[0] ??
    projects[0] ??
    null;
  const featuredPosts = posts.slice(0, 3);

  useEffect(() => {
    setHomeProjectPage(1);
  }, [activeProjectStatus, activeProjectTheme]);

  useEffect(() => {
    if (homeProjectPage > homeProjectTotalPages) {
      setHomeProjectPage(homeProjectTotalPages);
    }
  }, [homeProjectPage, homeProjectTotalPages]);

  useEffect(() => {
    if (!filteredHomeProjects.length) return;

    const selectedStillVisible = filteredHomeProjects.some((project) => project.id === activeProjectId);
    if (!selectedStillVisible) {
      setActiveProjectId(filteredHomeProjects[0]?.id ?? projects[0]?.id ?? null);
      return;
    }

    const selectedOnCurrentPage = paginatedHomeProjects.some((project) => project.id === activeProjectId);
    if (!selectedOnCurrentPage && paginatedHomeProjects[0]) {
      setActiveProjectId(paginatedHomeProjects[0].id);
    }
  }, [activeProjectId, filteredHomeProjects, paginatedHomeProjects]);

  return (
    <>
      <section className="border-b border-secondary/10 bg-secondary/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              {homeContent.emergencyBanner.label}
            </span>
            <p className="text-gray-700">{homeContent.emergencyBanner.text}</p>
          </div>
          <Link href="/journal" className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary transition hover:text-primary">
            Dernieres nouvelles
          </Link>
        </div>
      </section>

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.18),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_54%,_#fff7ed_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              {homeContent.hero.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">
              {homeContent.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{homeContent.hero.description}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                className="rounded-button bg-primary px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-500"
                onClick={() => setDonationOpen(true)}
              >
                {homeContent.hero.primaryCta}
              </button>
              <Link
                href="/projects"
                className="rounded-button border border-secondary/20 bg-white px-8 py-4 text-center text-lg font-semibold text-secondary transition hover:border-secondary hover:bg-secondary/5"
              >
                {homeContent.hero.secondaryCta}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {homeContent.hero.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`rounded-[24px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
                    index === 1 ? "border-primary/18 bg-primary/6" : "border-secondary/12 bg-white"
                  }`}
                >
                  <div className="text-3xl font-bold text-gray-950">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
              <img src="/assets/banner.jpeg" alt="Mission humanitaire" className="h-[540px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/12 to-transparent" />
              <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                <div className="rounded-full border border-white/60 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary backdrop-blur">
                  {homeContent.hero.featuredLabel}
                </div>
                <button
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-orange-500"
                  onClick={() => setDonationOpen(true)}
                >
                  Soutenir
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-xl rounded-[28px] border border-white/60 bg-white/88 p-6 backdrop-blur-md">
                  <h2 className="text-2xl font-bold leading-tight text-gray-950">{homeContent.hero.featuredTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{homeContent.hero.featuredDescription}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <img src="/assets/consultation.jpeg" alt="Consultation terrain" className="h-64 w-full rounded-[28px] object-cover" />
                <img src="/assets/education.jpeg" alt="Education terrain" className="h-64 w-full rounded-[28px] object-cover" />
              </div>
              <div className="rounded-[30px] border border-secondary/12 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Pourquoi ce site</div>
                    <div className="mt-2 text-2xl font-bold text-gray-950">Faire ressentir l'utilite de l'action des l'arrivee.</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {homeContent.hero.trustPoints.map((point) => (
                    <div key={point} className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-gray-700">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
              <img src="/assets/puits.jpeg" alt="Acces a l'eau" className="h-40 w-full rounded-[28px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {homeContent.proofStrip.map((item) => (
            <div key={item.label} className="rounded-[26px] border border-gray-100 bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
              <div className="text-2xl font-bold text-gray-950">{item.value}</div>
              <div className="mt-1 text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Entrees directes</p>
            <h2 className="text-4xl font-bold text-gray-950">Donner de la valeur des la premiere navigation.</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Chaque premiere action doit etre evidente: suivre un projet, comprendre le terrain ou entrer dans les images.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {homeContent.entryPoints.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group overflow-hidden rounded-[32px] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Acces rapide</div>
                    <div className="mt-2 text-2xl font-bold text-white">{item.title}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="leading-7 text-gray-600">{item.description}</p>
                  <div className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{item.cta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Projets visibles</p>
              <h2 className="text-4xl font-bold text-gray-950">Les projets doivent parler d'eux-memes par l'image et le detail.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                L'accueil doit deja faire sentir l'urgence, l'utilite et la progression. Chaque carte mene a une page detaillee.
              </p>
            </div>
            <Link
              href="/projects"
              className="rounded-button bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_36px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Voir tous les projets
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {homeProjectStatusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveProjectStatus(filter.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeProjectStatus === filter.id
                    ? "bg-primary text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)]"
                    : "bg-white text-gray-700 ring-1 ring-secondary/14 hover:text-secondary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {homeProjectThemeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveProjectTheme(filter.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeProjectTheme === filter.id
                    ? "bg-secondary text-white shadow-[0_12px_30px_rgba(65,182,75,0.22)]"
                    : "bg-white text-gray-700 ring-1 ring-secondary/14 hover:text-secondary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="overflow-hidden rounded-[36px] border border-secondary/12 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.1)]">
              {activeProject ? (
                <>
                  <div className="relative">
                    <img src={activeProject.coverImage} alt={activeProject.title.fr} className="h-[420px] w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/15 to-transparent" />
                    <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                      <div className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary backdrop-blur">
                        {projectThemeLabel(activeProject.theme)}
                      </div>
                      <div className="rounded-full border border-white/60 bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary backdrop-blur">
                        {projectStatusLabel(activeProject.status)}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="max-w-2xl text-3xl font-bold leading-tight text-white">{activeProject.title.fr}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/88">{activeProject.description.fr}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 p-8 md:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-[28px] bg-secondary/6 p-6">
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Impact direct</div>
                      <div className="text-4xl font-bold text-gray-950">{projectProgress(activeProject.goalAmount, activeProject.collectedAmount)}%</div>
                      <p className="mt-2 text-sm leading-6 text-gray-600">du financement cible est deja simule sur ce projet.</p>
                      <div className="mt-6 h-2 w-full rounded-full bg-secondary/10">
                        <div
                          className="h-2 rounded-full bg-secondary"
                          style={{ width: `${projectProgress(activeProject.goalAmount, activeProject.collectedAmount)}%` }}
                        />
                      </div>
                      <div className="mt-6 grid gap-4 text-sm text-gray-600">
                        <div className="rounded-2xl border border-secondary/10 bg-white px-4 py-3">
                          {activeProject.beneficiaryLabel.fr}
                        </div>
                        <div className="rounded-2xl border border-secondary/10 bg-white px-4 py-3">
                          Objectif: {activeProject.goalAmount.toLocaleString("fr-FR")} FCFA
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <img src={activeProject.coverImage} alt={`${activeProject.title.fr} scene terrain`} className="h-40 w-full rounded-[24px] object-cover" />
                        <img src="/assets/about.jpeg" alt="Equipe terrain" className="h-40 w-full rounded-[24px] object-cover" />
                      </div>
                      <div className="mt-6 rounded-[24px] border border-primary/20 bg-gradient-to-r from-primary/12 to-secondary/10 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Passer a l'action</div>
                        <h4 className="mt-2 text-xl font-bold text-gray-950">Soutenez ce projet maintenant</h4>
                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          Faites ressortir ce besoin comme l'action principale: soutenir le terrain maintenant, puis consulter le detail complet.
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => setDonationOpen(true)}
                          className="rounded-button bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.24)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                        >
                          Soutenir ce projet
                        </button>
                        <Link
                          href={`/projects/${activeProject.slug}`}
                          className="rounded-button border border-secondary/18 bg-white px-5 py-3 text-center text-sm font-semibold text-secondary transition hover:bg-secondary/6"
                        >
                          Voir plus sur ce projet
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-[24px] bg-[#f7fbf4] px-5 py-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-950">{filteredHomeProjects.length}</span> projets trouves
                </div>
                <div className="text-sm text-gray-600">
                  Selection <span className="font-semibold text-gray-950">interactive</span>
                </div>
              </div>

              {paginatedHomeProjects.map((project) => {
                const progress = projectProgress(project.goalAmount, project.collectedAmount);
                const isActive = project.id === activeProject?.id;

                return (
                  <div
                    key={project.id}
                    className={`overflow-hidden rounded-[28px] border transition ${
                      isActive
                        ? "border-primary bg-orange-50 shadow-[0_18px_50px_rgba(239,146,33,0.18)]"
                        : "border-gray-100 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <button onClick={() => setActiveProjectId(project.id)} className="group w-full text-left">
                      <div className="grid gap-4 p-4 sm:grid-cols-[136px_1fr] sm:items-center">
                        <div className="relative overflow-hidden rounded-[22px]">
                          <img src={project.coverImage} alt={project.title.fr} className="h-28 w-full object-cover transition duration-500 group-hover:scale-105" />
                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                            {projectThemeLabel(project.theme)}
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{projectStatusLabel(project.status)}</span>
                            <span className="text-sm font-semibold text-gray-500">{progress}%</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-950">{project.title.fr}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{project.description.fr}</p>
                          <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                            <div className="h-2 rounded-full bg-secondary" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-col gap-3 border-t border-secondary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600">Clique la carte pour changer le focus principal.</div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="rounded-button bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                      >
                        Voir plus
                      </Link>
                    </div>
                  </div>
                );
              })}

              {homeProjectTotalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-secondary/10 bg-white px-5 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
                  <button
                    onClick={() => setHomeProjectPage((current) => Math.max(1, current - 1))}
                    disabled={homeProjectPage === 1}
                    className="rounded-full border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                  >
                    Precedent
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: homeProjectTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setHomeProjectPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                          pageNumber === homeProjectPage
                            ? "bg-primary text-white shadow-[0_12px_24px_rgba(239,146,33,0.22)]"
                            : "bg-white text-gray-700 ring-1 ring-secondary/12 hover:text-secondary"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setHomeProjectPage((current) => Math.min(homeProjectTotalPages, current + 1))}
                    disabled={homeProjectPage === homeProjectTotalPages}
                    className="rounded-full border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                  >
                    Suivant
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[linear-gradient(180deg,_#f8f5ef_0%,_#ffffff_100%)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[34px] border border-primary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Mission et priorites</p>
              <h2 className="text-4xl font-bold leading-tight text-gray-950">Un site humanitaire doit expliquer l'action, pas juste occuper l'ecran.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Ici, on veut poser un cadre simple: montrer ce qui est fait, suivre ce qui avance et donner au public assez d'elements pour comprendre pourquoi l'action compte.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-primary/6 p-5">
                  <div className="text-3xl font-bold text-gray-950">3</div>
                  <div className="mt-1 text-sm text-gray-600">axes de lecture</div>
                </div>
                <div className="rounded-[24px] bg-secondary/6 p-5">
                  <div className="text-3xl font-bold text-gray-950">1</div>
                  <div className="mt-1 text-sm text-gray-600">parcours plus clair</div>
                </div>
                <div className="rounded-[24px] bg-[#fff3df] p-5">
                  <div className="text-3xl font-bold text-gray-950">100%</div>
                  <div className="mt-1 text-sm text-gray-600">centre sur l'impact</div>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-[28px]">
                <img src="/assets/about.jpeg" alt="Action humanitaire" className="h-64 w-full object-cover" />
              </div>
            </div>

            <div className="grid gap-5">
              {homeContent.pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="group grid gap-4 rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 md:grid-cols-[84px_1fr]"
                >
                  <div className="flex items-center gap-3 md:block">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-[0_12px_30px_rgba(65,182,75,0.18)]">
                      0{index + 1}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 md:mt-3">Priorite</div>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      {index === 0 ? "Actions" : index === 1 ? "Journal" : "Confiance"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950">{pillar.title}</h3>
                    <p className="mt-3 leading-7 text-gray-600">{pillar.description}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-[30px] border border-primary/14 bg-gradient-to-r from-primary/10 via-white to-secondary/10 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CTA plus direct</div>
                    <h3 className="mt-2 text-2xl font-bold text-gray-950">Voir les projets ou soutenir une action.</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      On reduit le texte pour garder une action plus claire et moins repetitive.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/projects"
                      className="rounded-button bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Voir les projets
                    </Link>
                    <button
                      onClick={() => setDonationOpen(true)}
                      className="rounded-button border border-secondary/18 bg-white px-5 py-3 text-center text-sm font-semibold text-secondary transition hover:bg-secondary/6"
                    >
                      Faire un don
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Journal</p>
              <h2 className="text-4xl font-bold text-gray-950">Le terrain doit aussi se raconter dans le temps.</h2>
            </div>
            <Link href="/journal" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 hover:text-primary">
              Ouvrir le journal
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Link href={`/journal/${featuredPosts[0].slug}`} className="overflow-hidden rounded-[34px] border border-secondary/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <img src={featuredPosts[0].image} alt={featuredPosts[0].title.fr} className="h-[380px] w-full object-cover" />
              <div className="p-8">
                <div className="mb-4 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                  Publication recente
                </div>
                <h3 className="mb-4 text-3xl font-bold text-gray-950">{featuredPosts[0].title.fr}</h3>
                <p className="mb-6 max-w-2xl text-lg leading-8 text-gray-600">{featuredPosts[0].excerpt.fr}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>{featuredPosts[0].createdAt}</span>
                  <span>Terrain</span>
                  <span>Suivi des actions</span>
                </div>
              </div>
            </Link>

            <div className="space-y-5">
              {featuredPosts.slice(1).map((post) => (
                <Link
                  href={`/journal/${post.slug}`}
                  key={post.id}
                  className="flex gap-4 rounded-[28px] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 transition hover:-translate-y-1"
                >
                  <img src={post.image} alt={post.title.fr} className="h-28 w-28 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{post.createdAt}</div>
                    <h3 className="mb-2 text-lg font-bold text-gray-950">{post.title.fr}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt.fr}</p>
                  </div>
                </Link>
              ))}

              <div className="rounded-[30px] bg-[#fff3df] p-6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Editorial</div>
                <h3 className="mb-3 text-2xl font-bold text-gray-950">Projets, images et nouvelles doivent avancer ensemble.</h3>
                <p className="text-sm leading-7 text-gray-600">
                  Le journal n'est pas un bloc secondaire. Il sert a contextualiser les actions, montrer leur evolution et nourrir la confiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,_#f7fbf4_0%,_#ffffff_100%)] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Transparence</p>
            <h2 className="mb-4 text-4xl font-bold text-gray-950">{homeContent.transparency.title}</h2>
            <p className="max-w-xl leading-8 text-gray-600">{homeContent.transparency.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {homeContent.transparency.items.map((item) => (
                <div key={item.label} className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                  <div className="text-2xl font-bold text-gray-950">{item.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img src="/assets/about.jpeg" alt="Association" className="h-56 w-full rounded-[28px] object-cover sm:h-72" />
            <img src="/assets/whats.jpeg" alt="Terrain" className="h-56 w-full rounded-[28px] object-cover sm:h-72" />
            <img src="/assets/consultation.jpeg" alt="Sante" className="h-56 w-full rounded-[28px] object-cover sm:h-72" />
            <img src="/assets/classe.jpeg" alt="Education" className="h-56 w-full rounded-[28px] object-cover sm:h-72" />
          </div>
        </div>
      </section>

      <section id="multimedia" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Galerie</p>
              <h2 className="mb-4 text-4xl font-bold text-gray-950">{homeContent.gallery.title}</h2>
              <p className="text-lg leading-8 text-gray-600">{homeContent.gallery.description}</p>
            </div>
            <Link href="/gallery" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 hover:text-primary">
              Voir toute la galerie
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[34px]">
              <img src="/assets/whats.jpeg" alt="Galerie terrain" className="h-[420px] w-full object-cover transition duration-500 hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/75 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Focus terrain</div>
                <div className="max-w-md text-2xl font-bold text-white">Les images doivent donner envie d'entrer dans les projets, pas juste decorer.</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/assets/1.jpeg" alt="Galerie 1" className="h-48 w-full rounded-[24px] object-cover transition duration-500 hover:-translate-y-1 hover:scale-[1.03]" />
              <img src="/assets/classe.jpeg" alt="Galerie 2" className="h-48 w-full rounded-[24px] object-cover transition duration-500 hover:-translate-y-1 hover:scale-[1.03]" />
              <img src="/assets/1.jpeg" alt="Galerie 3 duplicate" className="h-48 w-full rounded-[24px] object-cover transition duration-500 hover:-translate-y-1 hover:scale-[1.03]" />
              <img src="/assets/about.jpeg" alt="Galerie 4" className="h-48 w-full rounded-[24px] object-cover transition duration-500 hover:-translate-y-1 hover:scale-[1.03]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(90deg,_rgba(239,146,33,0.94)_0%,_rgba(65,182,75,0.96)_100%)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">Don et action</p>
              <h2 className="mb-5 text-4xl font-bold text-white">Soutenir une action visible, suivie et documentee.</h2>
              <p className="max-w-2xl text-lg leading-8 text-white/90">
                Le don doit rester connecte aux projets, aux images et aux nouvelles du terrain. C'est ce lien qui renforce la confiance.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                className="rounded-button bg-white px-8 py-4 text-lg font-semibold text-primary transition hover:bg-gray-100"
                onClick={() => setDonationOpen(true)}
              >
                Faire un don
              </button>
              <Link
                href="/projects"
                className="rounded-button border-2 border-white bg-transparent px-8 py-4 text-center text-lg font-semibold text-white transition hover:bg-white hover:text-primary"
              >
                Voir les projets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Newsletter</p>
            <h2 className="mb-4 text-4xl font-bold text-gray-950">{homeContent.newsletter.title}</h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">{homeContent.newsletter.description}</p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 md:p-8">
            <form className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-4 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white transition hover:bg-orange-600"
                >
                  S'abonner
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>

      {donationOpen ? (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Faire un don</h3>
              <button onClick={() => setDonationOpen(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">X</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-gray-700">Montant du don</label>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {[10000, 25000, 50000, 100000].map((amount) => (
                    <div key={amount} className="donation-amount">
                      <div className="text-lg font-semibold">{amount.toLocaleString("fr-FR")} F</div>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Autre montant"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="absolute right-3 top-3 text-gray-500">FCFA</div>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                Ce module reste fictif pour l'instant. Son role est de reserver la place du futur flux Laravel + paiement.
              </div>
              <div className="pt-1">
                <button className="w-full rounded-lg bg-primary py-4 font-semibold text-white transition-colors hover:bg-orange-600">
                  Effectuer le don
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
