"use client";

import { useEffect, useState } from "react";
import { projects as defaultProjects } from "@/lib/mock-data/projects";
import type { Project } from "@/lib/types";

const STORAGE_KEY = "entraide-admin-projects";

const themeLabels: Record<string, string> = { water: "Forage / eau", education: "Education", health: "Santé", tabaski: "Tabaski", food: "Alimentaire" };
const statusLabels: Record<string, string> = { ongoing: "En cours", completed: "Accompli", upcoming: "À venir" };
const themeColors: Record<string, string> = { water: "bg-blue-100 text-blue-700", education: "bg-purple-100 text-purple-700", health: "bg-green-100 text-green-700", tabaski: "bg-orange-100 text-orange-700", food: "bg-yellow-100 text-yellow-700" };
const statusColors: Record<string, string> = { ongoing: "bg-amber-100 text-amber-700", completed: "bg-green-100 text-green-700", upcoming: "bg-gray-100 text-gray-600" };

export function ProjectsPageEditor() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [saved, setSaved] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try { setProjects(JSON.parse(raw) as Project[]); } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function persist(updated: Project[]) {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
  }

  function startEdit(p: Project) {
    setEditId(p.id);
    setDraft(JSON.parse(JSON.stringify(p)));
  }

  function cancelEdit() {
    setEditId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;
    persist(projects.map((p) => (p.id === draft.id ? draft : p)));
    setEditId(null);
    setDraft(null);
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    persist(projects.filter((p) => p.id !== id));
  }

  const totalRaised = projects.reduce((s, p) => s + p.collectedAmount, 0);
  const totalGoal = projects.reduce((s, p) => s + p.goalAmount, 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Projets</h1>
          <p className="text-xs text-gray-500">{projects.length} projets · {(totalGoal ? Math.round(totalRaised / totalGoal * 100) : 0)}% collecté</p>
        </div>
        {saved ? <span className="text-xs font-semibold text-secondary">Enregistré</span> : null}
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
            {editId === project.id && draft ? (
              <div className="space-y-4 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Titre (fr)</label>
                    <input value={draft.title.fr} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, fr: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Slug</label>
                    <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Description (fr)</label>
                  <textarea value={draft.description.fr} onChange={(e) => setDraft({ ...draft, description: { ...draft.description, fr: e.target.value } })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Objectif (FCFA)</label>
                    <input type="number" value={draft.goalAmount} onChange={(e) => setDraft({ ...draft, goalAmount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Collecté (FCFA)</label>
                    <input type="number" value={draft.collectedAmount} onChange={(e) => setDraft({ ...draft, collectedAmount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Statut</label>
                    <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Project["status"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                      <option value="ongoing">En cours</option>
                      <option value="completed">Accompli</option>
                      <option value="upcoming">À venir</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Thème</label>
                    <select value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value as Project["theme"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                      {Object.entries(themeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Image (chemin)</label>
                    <input value={draft.coverImage} onChange={(e) => setDraft({ ...draft, coverImage: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
                  <button onClick={cancelEdit} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <img src={project.coverImage} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900">{project.title.fr}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${themeColors[project.theme]}`}>{themeLabels[project.theme]}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{project.location.fr} · {project.goalAmount.toLocaleString("fr-FR")} FCFA · {Math.round(project.collectedAmount / project.goalAmount * 100)}%</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(project)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Modifier</button>
                  <button onClick={() => handleDelete(project.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
