"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapProject, unmapProject } from "@/lib/api-mappers";
import { Pagination } from "@/components/admin/pagination";
import type { Project } from "@/lib/types";

const themeLabels: Record<string, string> = { water: "Forage / eau", education: "Education", health: "Santé", tabaski: "Tabaski", food: "Alimentaire" };
const statusLabels: Record<string, string> = { ongoing: "En cours", completed: "Accompli", upcoming: "À venir" };
const themeColors: Record<string, string> = { water: "bg-blue-100 text-blue-700", education: "bg-purple-100 text-purple-700", health: "bg-green-100 text-green-700", tabaski: "bg-orange-100 text-orange-700", food: "bg-yellow-100 text-yellow-700" };
const statusColors: Record<string, string> = { ongoing: "bg-amber-100 text-amber-700", completed: "bg-green-100 text-green-700", upcoming: "bg-gray-100 text-gray-600" };

const PAGE_SIZE = 12;

const emptyProject = (): Project => ({
  id: "",
  slug: "",
  theme: "water",
  title: { fr: "", en: "", ar: "" },
  description: { fr: "", en: "", ar: "" },
  goalAmount: 0,
  collectedAmount: 0,
  coverImage: "",
  status: "ongoing",
  location: { fr: "", en: "", ar: "" },
  beneficiaryLabel: { fr: "", en: "", ar: "" },
  createdAt: "",
});

export function ProjectsPageEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [msg, setMsg] = useState("");

  const fetchProjects = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await api.getProjects(`page=${p}&per_page=${PAGE_SIZE}`);
      const data = res?.data ?? [];
      setProjects(data.map(mapProject));
      setTotal(res?.meta?.total ?? data.length);
      setPage(p);
    } catch (e) { console.error("ProjectsPageEditor: fetch failed", e); setMsg("Erreur de chargement"); setTimeout(() => setMsg(""), 3000); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(1); }, [fetchProjects]);

  const showMsg = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  }, []);

  function startCreate() {
    setDraft(emptyProject());
    setCreating(true);
    setEditId(null);
  }

  function startEdit(p: Project) {
    setDraft(JSON.parse(JSON.stringify(p)));
    setEditId(p.id);
    setCreating(false);
  }

  function cancelForm() {
    setCreating(false);
    setEditId(null);
    setDraft(null);
  }

  async function save() {
    if (!draft) return;
    try {
      const payload = unmapProject(draft);
      if (editId) {
        await api.updateProject(editId, payload);
        setProjects(projects.map((p) => (p.id === editId ? { ...draft, id: editId } : p)));
        showMsg("Projet mis a jour");
      } else {
        const res = await api.createProject(payload);
        const mapped = mapProject(res);
        setProjects([mapped, ...projects]);
        setTotal((t) => t + 1);
        showMsg("Projet cree");
      }
      cancelForm();
    } catch (e) { console.error("ProjectsPageEditor: save failed", e); showMsg("Erreur lors de la sauvegarde"); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
      showMsg("Projet supprime");
    } catch (e) { console.error("ProjectsPageEditor: delete failed", e); showMsg("Erreur lors de la suppression"); }
  }

  const totalRaised = projects.reduce((s, p) => s + p.collectedAmount, 0);
  const totalGoal = projects.reduce((s, p) => s + p.goalAmount, 0);

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Chargement...</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Projets</h1>
          <p className="text-xs text-gray-500">{total} projets &middot; {totalGoal ? Math.round(totalRaised / totalGoal * 100) : 0}% collecte</p>
        </div>
        <button onClick={startCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          + Ajouter un projet
        </button>
      </div>

      {msg ? <div className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">{msg}</div> : null}

      {(creating || editId) && draft ? (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Modifier le projet" : "Nouveau projet"}</h3>
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
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Collecte (FCFA)</label>
              <input type="number" value={draft.collectedAmount} onChange={(e) => setDraft({ ...draft, collectedAmount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Statut</label>
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Project["status"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option value="ongoing">En cours</option>
                <option value="completed">Accompli</option>
                <option value="upcoming">A venir</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Theme</label>
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
            <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
            <button onClick={cancelForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-4 p-4">
              <img src={project.coverImage} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-gray-900">{project.title.fr}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${themeColors[project.theme]}`}>{themeLabels[project.theme]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{project.location.fr} &middot; {project.goalAmount.toLocaleString("fr-FR")} FCFA &middot; {project.goalAmount ? Math.round(project.collectedAmount / project.goalAmount * 100) : 0}%</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(project)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Modifier</button>
                <button onClick={() => remove(project.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={(p) => fetchProjects(p)} />
    </section>
  );
}
