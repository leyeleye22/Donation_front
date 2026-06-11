"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadHomeContent, type HomeEditorContent } from "@/lib/admin/home-content";
import { api } from "@/lib/api";
import { mapProject, mapPost, mapGalleryItem } from "@/lib/api-mappers";
import { SectionVisibility } from "@/components/ui/section-visibility";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format-date";
import { useDonateModal } from "@/lib/donate-modal-context";
import type { Project, Post, GalleryItem } from "@/lib/types";

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
  const [cms, setCms] = useState<HomeEditorContent | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const { openDonate } = useDonateModal();
  const [activeProjectStatus, setActiveProjectStatus] = useState<(typeof homeProjectStatusFilters)[number]["id"]>("all");
  const [activeProjectTheme, setActiveProjectTheme] = useState<(typeof homeProjectThemeFilters)[number]["id"]>("all");
  const [homeProjectPage, setHomeProjectPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMsg("");
    setNewsletterError("");
    try {
      const res = await api.subscribeNewsletter(newsletterEmail);
      setNewsletterMsg(res.message || "Inscription reussie !");
      setNewsletterEmail("");
    } catch (e: any) {
      console.error("HomePageContent: newsletter", e);
      setNewsletterError(e.message || "Erreur d'inscription");
    } finally {
      setNewsletterLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([
      loadHomeContent(),
      api.getProjects("per_page=20"),
      api.getPosts("per_page=3&published=1"),
      api.getGallery(),
    ]).then(([cmsData, projectsRes, postsRes, galleryRes]) => {
      setCms(cmsData);
      if (projectsRes?.data) setProjects((projectsRes.data || []).map(mapProject));
      if (postsRes?.data) setFeaturedPosts((postsRes.data || []).map(mapPost));
      if (galleryRes?.data) setGalleryItems((galleryRes.data || []).map(mapGalleryItem));
    }).catch((e) => {
      console.error("HomePageContent: failed to load data", e);
      loadHomeContent().then(setCms);
    });
  }, []);

  const filteredHomeProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = activeProjectStatus === "all" || project.status === activeProjectStatus;
      const matchesTheme = activeProjectTheme === "all" || project.theme === activeProjectTheme;
      return matchesStatus && matchesTheme;
    });
  }, [projects, activeProjectStatus, activeProjectTheme]);
  const homeProjectTotalPages = Math.max(1, Math.ceil(filteredHomeProjects.length / HOME_PROJECT_PAGE_SIZE));
  const paginatedHomeProjects = useMemo(() => {
    const start = (homeProjectPage - 1) * HOME_PROJECT_PAGE_SIZE;
    return filteredHomeProjects.slice(start, start + HOME_PROJECT_PAGE_SIZE);
  }, [filteredHomeProjects, homeProjectPage]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject =
    paginatedHomeProjects.find((project) => project.id === activeProjectId) ??
    filteredHomeProjects.find((project) => project.id === activeProjectId) ??
    paginatedHomeProjects[0] ??
    projects[0] ??
    null;

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

  if (!cms) {
    return (
      <div className="bg-white">
        <section className="overflow-hidden bg-page-hero">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
              <div>
                <Skeleton className="mb-5 h-4 w-24" />
                <Skeleton className="h-14 w-full max-w-[500px]" />
                <Skeleton className="mt-6 h-6 w-full max-w-[400px]" />
                <Skeleton className="mt-2 h-6 w-3/4 max-w-[350px]" />
                <div className="mt-8 flex gap-4">
                  <Skeleton className="h-14 w-40 rounded-[12px]" />
                  <Skeleton className="h-14 w-40 rounded-[12px]" />
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-[24px]" />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Skeleton className="h-[540px] rounded-[36px]" />
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-64 rounded-[28px]" />
                    <Skeleton className="h-64 rounded-[28px]" />
                  </div>
                  <Skeleton className="h-36 rounded-[30px]" />
                  <Skeleton className="h-40 rounded-[28px]" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-6">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-[26px]" />
            ))}
          </div>
        </section>
        <section className="bg-orange-50/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-3 h-4 w-48" />
            <Skeleton className="h-10 w-full max-w-[500px]" />
            <Skeleton className="mt-4 h-6 w-full max-w-[400px]" />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[420px] rounded-[32px]" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!activeProject && projects.length === 0 && featuredPosts.length === 0) {
    return <div className="flex items-center justify-center py-24 text-sm text-gray-400">Chargement des donnees...</div>;
  }

  return (
    <>
      <SectionVisibility section="hero">
        <section className="overflow-hidden bg-page-hero">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              {cms?.heroEyebrow ?? "Urgence"}
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">
              {cms?.heroTitle ?? ""}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{cms?.heroDescription ?? ""}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button type="button" className="btn-primary-lg" onClick={openDonate}>
                {cms?.primaryCta ?? ""}
              </button>
              <Link
                href="/projects"
                className="btn-outline-lg text-center"
              >
                {cms?.secondaryCta ?? ""}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {(cms?.heroStats ?? []).map((stat, index) => (
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
            {cms.heroImage ? (
            <div className="relative overflow-hidden rounded-[36px] border border-white/60 shadow-warm-lg">
              <img src={cms.heroImage} alt={cms.featuredTitle || cms.heroTitle || "Mission"} className="h-[540px] w-full object-cover" />
              <div className="overlay-image" />
              <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                <div className="rounded-full border border-white/60 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary backdrop-blur">
                  {cms?.featuredLabel ?? ""}
                </div>
                <button
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-orange-500"
                  onClick={openDonate}
                >
                  Soutenir
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="max-w-xl rounded-[28px] border border-white/60 bg-white/88 p-6 backdrop-blur-md">
                  <h2 className="text-2xl font-bold leading-tight text-gray-950">{cms?.featuredTitle ?? ""}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{cms?.featuredDescription ?? ""}</p>
                </div>
              </div>
            </div>
            ) : null}

            <div className="grid gap-4">
              {(cms.supportImage || cms.entryPoints[0]?.image) ? (
              <div className="grid grid-cols-2 gap-4">
                {cms.supportImage ? (
                  <img src={cms.supportImage} alt="Action terrain" className="h-64 w-full rounded-[28px] object-cover" />
                ) : null}
                {cms.entryPoints[0]?.image ? (
                  <img src={cms.entryPoints[0].image} alt={cms.entryPoints[0].title} className="h-64 w-full rounded-[28px] object-cover" />
                ) : null}
              </div>
              ) : null}
              <div className="rounded-[30px] border border-secondary/12 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{cms.featuredLabel}</div>
                    <div className="mt-2 text-2xl font-bold text-gray-950">{cms.featuredTitle}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {(cms?.trustPoints ?? []).map((point, index) => (
                    <div
                      key={point}
                      className={`rounded-2xl border px-4 py-3 text-sm leading-6 text-gray-700 ${
                        index % 2 === 0 ? "border-primary/10 bg-primary/5" : "border-secondary/10 bg-secondary/5"
                      }`}
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
              {cms.entryPoints[1]?.image ? (
              <img src={cms.entryPoints[1].image} alt={cms.entryPoints[1].title} className="h-40 w-full rounded-[28px] object-cover" />
              ) : null}
            </div>
          </div>
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="trustBar">
        <section className="bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {(cms?.proofStrip ?? []).map((item) => (
            <div key={item.label} className="rounded-[26px] border border-gray-100 bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
              <div className="text-2xl font-bold text-gray-950">{item.value}</div>
              <div className="mt-1 text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="entryPoints">
        <section className="bg-section-fresh py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="page-eyebrow-alt mb-3">Decouvrir l&apos;association</p>
            <h2 className="text-4xl font-bold text-gray-950">Explorer nos actions, nos projets et notre impact.</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Suivez nos projets en cours, parcourez le journal de terrain et plongez au coeur de nos interventions.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {(cms?.entryPoints ?? []).map((item) => (
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
                  <div className="overlay-image" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Acces rapide</div>
                    <div className="mt-2 text-2xl font-bold text-white">{item.title}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="leading-7 text-gray-600">{item.description}</p>
                  <div className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{item.cta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="projects">
        {projects.length > 0 ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Projets</p>
              <h2 className="text-4xl font-bold text-gray-950">Decouvrez nos projets et leur avancement sur le terrain.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Chaque projet est documente avec des images, des objectifs chiffres et un suivi de progression transparent.
              </p>
            </div>
            <Link
              href="/projects"
              className="btn-primary btn-md uppercase tracking-wide"
            >
              Voir tous les projets
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {homeProjectStatusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveProjectStatus(filter.id)}
                className={activeProjectStatus === filter.id ? "chip-active" : "chip-inactive"}
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
                className={activeProjectTheme === filter.id ? "chip-active-secondary" : "chip-inactive"}
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
                    <div className="overlay-image-soft" />
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
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Progression</div>
                      <div className="text-4xl font-bold text-gray-950">{projectProgress(activeProject.goalAmount, activeProject.collectedAmount)}%</div>
                      <p className="mt-2 text-sm leading-6 text-gray-600">du financement cible atteint pour ce projet.</p>
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
                        {activeProject.coverImage ? (
                          <img src={activeProject.coverImage} alt={`${activeProject.title.fr} scene terrain`} className="h-40 w-full rounded-[24px] object-cover sm:col-span-2" />
                        ) : null}
                      </div>
                      <div className="mt-6 rounded-[24px] border border-primary/20 bg-gradient-to-r from-primary/12 to-orange-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Soutenir</div>
                        <h4 className="mt-2 text-xl font-bold text-gray-950">Contribuez a ce projet</h4>
                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          Votre soutien permet de financer les actions sur le terrain et d'accompagner les communautes dans le besoin.
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={openDonate}
                          className="btn-primary btn-sm w-full sm:w-auto"
                        >
                          Soutenir ce projet
                        </button>
                        <Link
                          href={`/projects/${activeProject.slug}`}
                          className="btn-outline btn-sm w-full text-center sm:w-auto"
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
              <div className="flex items-center justify-between rounded-[24px] bg-orange-50/50 px-5 py-4">
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
                        className="btn-primary btn-sm"
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
      ) : null}
      </SectionVisibility>

      <SectionVisibility section="mission">
        <section className="overflow-hidden bg-page-section py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[34px] border border-primary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Mission</p>
              <h2 className="text-4xl font-bold leading-tight text-gray-950">{cms?.donationTitle ?? ""}</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">{cms?.donationDescription ?? ""}</p>

              {(cms?.heroStats ?? []).length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(cms?.heroStats ?? []).slice(0, 3).map((stat) => (
                <div key={stat.label} className="rounded-[24px] bg-primary/6 p-5">
                  <div className="text-3xl font-bold text-gray-950">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
                ))}
              </div>
              ) : null}

              {cms?.heroImage ? (
              <div className="mt-8 overflow-hidden rounded-[28px]">
                <img src={cms.heroImage} alt={cms.heroTitle || "Action humanitaire"} className="h-64 w-full object-cover" />
              </div>
              ) : null}
            </div>

            <div className="grid gap-5">
              {(cms?.pillars ?? []).map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="group grid gap-4 rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 md:grid-cols-[84px_1fr]"
                >
                  <div className="flex items-center gap-3 md:block">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white ${
                        index % 2 === 0
                          ? "bg-gradient-to-br from-primary to-orange-400 shadow-warm"
                          : "bg-gradient-to-br from-secondary to-green-500 shadow-fresh"
                      }`}
                    >
                      0{index + 1}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 md:mt-3">Priorite</div>
                  </div>

                  <div>
                    <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${index % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                      {index === 0 ? "Actions" : index === 1 ? "Journal" : "Confiance"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950">{pillar.title}</h3>
                    <p className="mt-3 leading-7 text-gray-600">{pillar.description}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-[30px] border border-secondary/14 bg-gradient-to-r from-secondary/8 via-white to-orange-50/60 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Agir</div>
                    <h3 className="mt-2 text-2xl font-bold text-gray-950">Decouvrez nos projets ou soutenez notre action.</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      Explorez les projets en cours et contribuez directement a ceux qui vous parlent le plus.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/projects"
                      className="btn-primary btn-sm w-full sm:w-auto"
                    >
                      Voir les projets
                    </Link>
                    <button
                      onClick={openDonate}
                      className="btn-outline btn-sm w-full text-center sm:w-auto"
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
      </SectionVisibility>

      <SectionVisibility section="journal">
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Journal</p>
              <h2 className="text-4xl font-bold text-gray-950">Suivez nos actualites et nos reportages de terrain.</h2>
            </div>
            <Link href="/journal" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 hover:text-secondary">
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
                  <span>{formatDate(featuredPosts[0].createdAt)}</span>
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
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{formatDate(post.createdAt)}</div>
                    <h3 className="mb-2 text-lg font-bold text-gray-950">{post.title.fr}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt.fr}</p>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="transparency">
        <section className="bg-page-section py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <h2 className="mb-4 text-4xl font-bold text-gray-950">{cms?.transparencyTitle ?? ""}</h2>
                <p className="max-w-xl leading-8 text-gray-600">{cms?.transparencyDescription ?? ""}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {(cms?.transparencyItems ?? []).map((item, index) => (
                    <div
                      key={item.label}
                      className={`rounded-2xl border p-5 ${
                        index % 2 === 0 ? "border-primary/10 bg-primary/5" : "border-secondary/10 bg-secondary/5"
                      }`}
                    >
                      <div className="text-2xl font-bold text-gray-950">{item.value}</div>
                      <div className="mt-1 text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {galleryItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {galleryItems.slice(0, 4).map((item) => (
                  <img key={item.id} src={item.image} alt={item.title.fr} className="h-56 w-full rounded-[28px] object-cover sm:h-72" />
                ))}
              </div>
              ) : null}
            </div>
          </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="gallery">
        <section id="multimedia" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Galerie</p>
              <h2 className="mb-4 text-4xl font-bold text-gray-950">{cms?.galleryTitle ?? ""}</h2>
              <p className="text-lg leading-8 text-gray-600">{cms?.galleryDescription ?? ""}</p>
            </div>
            <Link href="/gallery" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 hover:text-secondary">
              Voir toute la galerie
            </Link>
          </div>
          {galleryItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[34px]">
              <img src={galleryItems[0].image} alt={galleryItems[0].title.fr} className="h-[420px] w-full object-cover transition duration-500 hover:scale-[1.03]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {galleryItems.slice(1, 5).map((item) => (
                <img key={item.id} src={item.image} alt={item.title.fr} className="h-48 w-full rounded-[24px] object-cover transition duration-500 hover:-translate-y-1 hover:scale-[1.03]" />
              ))}
            </div>
          </div>
          ) : null}
        </div>
        </section>
      </SectionVisibility>

      {cms.testimonials && cms.testimonials.length > 0 ? (
        <SectionVisibility section="testimonials">
          <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Temoignages</p>
                <h2 className="mb-4 text-4xl font-bold text-gray-950">Ceux que nous accompagnons temoignent</h2>
                <p className="text-lg leading-8 text-gray-600">Parce que la meilleure preuve de notre action, c'est la parole de ceux qui la vivent au quotidien.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {cms.testimonials.map((t) => (
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
        </SectionVisibility>
      ) : null}

      <SectionVisibility section="donationCta">
        <section className="bg-gradient-to-r from-primary via-orange-500 to-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">Agir maintenant</p>
              <h2 className="mb-5 text-4xl font-bold text-white">{cms?.donationTitle ?? "Soutenez nos actions, visibles et documentees sur le terrain."}</h2>
              <p className="max-w-2xl text-lg leading-8 text-white/90">
                {cms?.donationDescription ?? "Chaque don est connecte a des projets concrets, suivis et illustres. Votre soutien a un impact direct et verifiable."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                className="btn-white btn-lg"
                onClick={openDonate}
              >
                Faire un don
              </button>
              <Link
                href="/projects"
                className="btn btn-lg border-2 border-white bg-transparent text-center text-white hover:bg-white hover:text-primary"
              >
                Voir les projets
              </Link>
            </div>
          </div>
        </div>
        </section>
      </SectionVisibility>

      <SectionVisibility section="newsletter">
        <section className="bg-section-warm py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="page-eyebrow-alt mb-3">Newsletter</p>
            <h2 className="mb-4 text-4xl font-bold text-gray-950">{cms?.newsletterTitle ?? ""}</h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">{cms?.newsletterDescription ?? ""}</p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 md:p-8">
            {newsletterMsg && <p className="mb-4 text-center text-sm font-medium text-secondary">{newsletterMsg}</p>}
            {newsletterError && <p className="mb-4 text-center text-sm font-medium text-red-600">{newsletterError}</p>}
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="field text-base"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="btn-primary btn-md whitespace-nowrap disabled:opacity-50"
                >
                  {newsletterLoading ? "Inscription..." : "S'abonner"}
                </button>
              </div>
            </form>
          </div>
        </div>
        </section>
      </SectionVisibility>

    </>
  );
}
