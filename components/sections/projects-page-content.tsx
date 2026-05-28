"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projects as fallbackProjects } from "@/lib/mock-data/projects";
import { pageContent } from "@/lib/mock-data/ui-content";
import { api } from "@/lib/api";

const statusFilters = [
  { id: "all", label: "Tous" },
  { id: "ongoing", label: "En cours" },
  { id: "completed", label: "Accomplis" },
  { id: "upcoming", label: "A venir" }
] as const;

const themeFilters = [
  { id: "all", label: "Toutes les causes" },
  { id: "education", label: "Education" },
  { id: "water", label: "Forage / eau" },
  { id: "health", label: "Sante" },
  { id: "tabaski", label: "Tabaski" },
  { id: "food", label: "Alimentaire" }
] as const;

const themeLabel: Record<string, string> = {
  education: "Education",
  water: "Forage / eau",
  health: "Sante",
  tabaski: "Tabaski",
  food: "Alimentaire"
};

const statusLabel: Record<string, string> = {
  ongoing: "En cours",
  completed: "Accompli",
  upcoming: "A venir"
};

const PAGE_SIZE = 6;

function projectProgress(goalAmount: number, collectedAmount: number) {
  if (goalAmount === 0) return 0;
  return Math.round((collectedAmount / goalAmount) * 100);
}

export function ProjectsPageContent() {
  const [allProjects, setAllProjects] = useState<typeof fallbackProjects>(fallbackProjects);
  useEffect(() => {
    api.getProjects().then((res) => {
      if (res?.data) setAllProjects(res.data);
    }).catch(() => {});
  }, []);
  const [activeStatus, setActiveStatus] = useState<(typeof statusFilters)[number]["id"]>("all");
  const [activeTheme, setActiveTheme] = useState<(typeof themeFilters)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState(allProjects[0]?.id ?? "");
  const [page, setPage] = useState(1);

  const visibleProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const statusOk = activeStatus === "all" || project.status === activeStatus;
      const themeOk = activeTheme === "all" || project.theme === activeTheme;
      return statusOk && themeOk;
    });
  }, [activeStatus, activeTheme]);

  const totalPages = Math.max(1, Math.ceil(visibleProjects.length / PAGE_SIZE));

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleProjects.slice(start, start + PAGE_SIZE);
  }, [page, visibleProjects]);

  useEffect(() => {
    setPage(1);
  }, [activeStatus, activeTheme]);

  useEffect(() => {
    if (!visibleProjects.length) return;
    const selectedStillVisible = visibleProjects.some((project) => project.id === selectedId);
    if (!selectedStillVisible) {
      setSelectedId(visibleProjects[0].id);
      return;
    }
    const selectedOnCurrentPage = paginatedProjects.some((project) => project.id === selectedId);
    if (!selectedOnCurrentPage && paginatedProjects[0]) {
      setSelectedId(paginatedProjects[0].id);
    }
  }, [selectedId, visibleProjects, paginatedProjects]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const selectedProject =
    paginatedProjects.find((project) => project.id === selectedId) ??
    visibleProjects.find((project) => project.id === selectedId) ??
    paginatedProjects[0] ??
    visibleProjects[0] ??
    allProjects[0];

  const summary = {
    total: allProjects.length,
    ongoing: allProjects.filter((project) => project.status === "ongoing").length,
    completed: allProjects.filter((project) => project.status === "completed").length,
    upcoming: allProjects.filter((project) => project.status === "upcoming").length
  };

  return (
    <div className="bg-white">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.16),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_56%,_#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{pageContent.projects.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] text-gray-950 md:text-6xl">
                Une page projet pensee pour tenir avec 70 campagnes et plus.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Certains projets sont deja accomplis, d&apos;autres sont en cours, d&apos;autres encore sont a venir. La page doit pouvoir gerer tout ce portefeuille sans s&apos;effondrer visuellement.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] border border-primary/14 bg-primary/6 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                  <div className="text-3xl font-bold text-gray-950">{summary.total}</div>
                  <div className="mt-1 text-sm text-gray-600">Projets visibles</div>
                </div>
                <div className="rounded-[24px] border border-secondary/14 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                  <div className="text-3xl font-bold text-gray-950">{summary.ongoing}</div>
                  <div className="mt-1 text-sm text-gray-600">En cours</div>
                </div>
                <div className="rounded-[24px] border border-secondary/14 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                  <div className="text-3xl font-bold text-gray-950">{summary.completed}</div>
                  <div className="mt-1 text-sm text-gray-600">Accomplis</div>
                </div>
                <div className="rounded-[24px] border border-secondary/14 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                  <div className="text-3xl font-bold text-gray-950">{summary.upcoming}</div>
                  <div className="mt-1 text-sm text-gray-600">A venir</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative overflow-hidden rounded-[36px] shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
                <img src={selectedProject.coverImage} alt={selectedProject.title.fr} className="h-[520px] w-full object-cover transition duration-700 hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/12 to-transparent" />
                <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
                  <div className="rounded-full bg-white/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary backdrop-blur">
                    {themeLabel[selectedProject.theme]}
                  </div>
                  <div className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                    {statusLabel[selectedProject.status]}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="max-w-xl rounded-[28px] border border-white/50 bg-white/90 p-6 backdrop-blur">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{selectedProject.location.fr}</div>
                    <h2 className="mt-2 text-3xl font-bold text-gray-950">{selectedProject.title.fr}</h2>
                    <p className="mt-3 text-sm leading-7 text-gray-700">{selectedProject.description.fr}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[30px] border border-secondary/12 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Portfolio vivant</div>
                  <h3 className="text-2xl font-bold text-gray-950">Education, forage, sante, alimentaire ou Tabaski.</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    La page doit pouvoir presenter des projets accomplis, des campagnes en cours et des actions a venir sans confusion.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[24px] bg-[#fff3df] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Impact</div>
                    <div className="mt-2 text-xl font-bold text-gray-950">{selectedProject.beneficiaryLabel.fr}</div>
                  </div>
                  <div className="rounded-[24px] bg-[#f7fbf4] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Objectif</div>
                    <div className="mt-2 text-xl font-bold text-gray-950">{selectedProject.goalAmount.toLocaleString("fr-FR")} FCFA</div>
                  </div>
                </div>
                <div className="rounded-[30px] bg-white p-6 ring-1 ring-secondary/10 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                  <div className="mb-3 flex justify-between text-sm text-gray-500">
                    <span>Progression</span>
                    <span>{projectProgress(selectedProject.goalAmount, selectedProject.collectedAmount)}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${projectProgress(selectedProject.goalAmount, selectedProject.collectedAmount)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-3">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveStatus(filter.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeStatus === filter.id
                    ? "bg-primary text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)]"
                    : "bg-white text-gray-700 ring-1 ring-secondary/14 hover:text-secondary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {themeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveTheme(filter.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeTheme === filter.id
                    ? "bg-secondary text-white shadow-[0_12px_30px_rgba(65,182,75,0.22)]"
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
                  <span className="font-semibold text-gray-950">{visibleProjects.length}</span> projets trouves
                </div>
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-950">{page}</span> / {totalPages}
                </div>
              </div>

              {paginatedProjects.map((project) => {
                const progress = projectProgress(project.goalAmount, project.collectedAmount);
                const active = project.id === selectedProject.id;

                return (
                  <div
                    key={project.id}
                    className={`overflow-hidden rounded-[30px] border transition-all ${
                      active
                        ? "border-primary bg-orange-50 shadow-[0_18px_50px_rgba(239,146,33,0.16)]"
                        : "border-secondary/10 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <button onClick={() => setSelectedId(project.id)} className="group w-full text-left">
                      <div className="grid gap-4 p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                        <div className="relative overflow-hidden rounded-[22px]">
                          <img src={project.coverImage} alt={project.title.fr} className="h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                          <div className="absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                            {themeLabel[project.theme]}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${active ? "text-primary" : "text-secondary"}`}>
                              {statusLabel[project.status]}
                            </span>
                            <span className="text-sm font-semibold text-gray-500">{project.location.fr}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-950">{project.title.fr}</h2>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{project.description.fr}</p>
                          <div className="mt-4 mb-2 h-2.5 w-full rounded-full bg-gray-100">
                            <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{project.beneficiaryLabel.fr}</span>
                            <span>{progress}%</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-col gap-3 border-t border-secondary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600">Clique la carte pour changer l&apos;apercu a droite.</div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="rounded-button bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                      >
                        Voir plus sur ce projet
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
                  <img src={selectedProject.coverImage} alt={selectedProject.title.fr} className="h-[260px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/75 via-secondary/10 to-transparent" />
                  <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
                    <div className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
                      {themeLabel[selectedProject.theme]}
                    </div>
                    <div className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      {statusLabel[selectedProject.status]}
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <div className="mb-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                    {selectedProject.location.fr}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-950">{selectedProject.title.fr}</h2>
                  <p className="mb-6 text-base leading-7 text-gray-600">{selectedProject.description.fr}</p>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-primary/6 p-5">
                      <div className="text-sm text-gray-500">Statut</div>
                      <div className="mt-1 font-bold text-gray-950">{statusLabel[selectedProject.status]}</div>
                    </div>
                    <div className="rounded-2xl bg-secondary/6 p-5">
                      <div className="text-sm text-gray-500">Zone</div>
                      <div className="mt-1 font-bold text-gray-950">{selectedProject.location.fr}</div>
                    </div>
                    <div className="rounded-2xl bg-white p-5 ring-1 ring-secondary/10">
                      <div className="text-sm text-gray-500">Objectif</div>
                      <div className="mt-1 font-bold text-gray-950">{selectedProject.goalAmount.toLocaleString("fr-FR")} FCFA</div>
                    </div>
                    <div className="rounded-2xl bg-white p-5 ring-1 ring-secondary/10">
                      <div className="text-sm text-gray-500">Collecte</div>
                      <div className="mt-1 font-bold text-gray-950">{selectedProject.collectedAmount.toLocaleString("fr-FR")} FCFA</div>
                    </div>
                  </div>

                  <div className="mb-3 flex justify-between text-sm text-gray-500">
                    <span>Progression</span>
                    <span>{projectProgress(selectedProject.goalAmount, selectedProject.collectedAmount)}%</span>
                  </div>
                  <div className="mb-8 h-3 w-full rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${projectProgress(selectedProject.goalAmount, selectedProject.collectedAmount)}%` }}
                    />
                  </div>

                  <div className="mb-6 rounded-[24px] bg-[#f7fbf4] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Lecture rapide</div>
                    <p className="mt-2 text-sm leading-7 text-gray-700">
                      Clique un projet a gauche pour changer ce panneau. Il reste compact et visible pour eviter les grands espaces blancs.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                      href={`/projects/${selectedProject.slug}`}
                      className="rounded-button bg-primary px-6 py-3.5 text-center text-base font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Voir plus sur ce projet
                    </Link>
                    <button className="rounded-button border border-secondary/18 bg-white px-6 py-3.5 text-base font-semibold text-secondary transition hover:bg-secondary/6">
                      {pageContent.projects.simulateDonationCta}
                    </button>
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
