"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapProject, unmapProject } from "@/lib/api-mappers";
import { Pagination } from "@/components/admin/pagination";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (loading) {
    return (
      <AdminPage className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <Skeleton className="h-14 w-14 flex-shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Programmes & impact"
        title="Gestion des projets"
        description="Campagnes humanitaires, objectifs de collecte, statuts et preuves d'impact sur le terrain."
        actions={<AdminButton onClick={startCreate}>+ Nouveau projet</AdminButton>}
        meta={
          <>
            <span className="admin-badge-neutral">{total} projet(s)</span>
            <span className="admin-badge-warning">{totalGoal ? Math.round(totalRaised / totalGoal * 100) : 0}% collecte</span>
          </>
        }
      />

      {msg ? <AdminAlert tone="success">{msg}</AdminAlert> : null}

      {(creating || editId) && draft ? (
        <div className="admin-form-panel">
          <h3 className="text-base font-bold text-slate-900">{editId ? "Modifier le projet" : "Nouveau projet"}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label">Titre (fr)</label>
              <input value={draft.title.fr} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, fr: e.target.value } })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Description (fr)</label>
            <textarea value={draft.description.fr} onChange={(e) => setDraft({ ...draft, description: { ...draft.description, fr: e.target.value } })} rows={2} className="admin-textarea" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="admin-label">Objectif (FCFA)</label>
              <input type="number" value={draft.goalAmount} onChange={(e) => setDraft({ ...draft, goalAmount: Number(e.target.value) })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Collecte (FCFA)</label>
              <input type="number" value={draft.collectedAmount} onChange={(e) => setDraft({ ...draft, collectedAmount: Number(e.target.value) })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Statut</label>
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Project["status"] })} className="admin-select">
                <option value="ongoing">En cours</option>
                <option value="completed">Accompli</option>
                <option value="upcoming">A venir</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label">Theme</label>
              <select value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value as Project["theme"] })} className="admin-select">
                {Object.entries(themeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Image (chemin)</label>
              <input value={draft.coverImage} onChange={(e) => setDraft({ ...draft, coverImage: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div className="flex gap-3">
            <AdminButton onClick={save}>Enregistrer</AdminButton>
            <AdminButton variant="ghost" onClick={cancelForm}>Annuler</AdminButton>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="admin-list-card">
            <img src={project.coverImage} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-slate-900">{project.title.fr}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${themeColors[project.theme]}`}>{themeLabels[project.theme]}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{project.location.fr} · {project.goalAmount.toLocaleString("fr-FR")} FCFA · {project.goalAmount ? Math.round(project.collectedAmount / project.goalAmount * 100) : 0}%</div>
            </div>
            <div className="flex gap-2">
              <AdminButton variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => startEdit(project)}>Modifier</AdminButton>
              <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => remove(project.id)}>Supprimer</AdminButton>
            </div>
          </div>
        ))}
      </div>

      <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={(p) => fetchProjects(p)} />
    </AdminPage>
  );
}
