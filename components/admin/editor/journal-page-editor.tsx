"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapPost, unmapPost } from "@/lib/api-mappers";
import { Pagination } from "@/components/admin/pagination";
import { ImagePicker } from "@/components/admin/editor/image-picker";
import { RichTextEditor } from "@/components/admin/editor/rich-text-editor";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format-date";
import { slugify } from "@/lib/slugify";
import type { Post } from "@/lib/types";

const categoryLabels: Record<string, string> = { terrain: "Terrain", "project-update": "Projet", association: "Association" };
const categoryColors: Record<string, string> = { terrain: "bg-blue-100 text-blue-700", "project-update": "bg-amber-100 text-amber-700", association: "bg-purple-100 text-purple-700" };

const PAGE_SIZE = 12;

const emptyPost = (): Post => ({
  id: "",
  slug: "",
  title: { fr: "", en: "", ar: "" },
  excerpt: { fr: "", en: "", ar: "" },
  content: { fr: "", en: "", ar: "" },
  image: "",
  category: "terrain",
  location: { fr: "", en: "", ar: "" },
  readTime: "5 min",
  published: false,
  createdAt: "",
});

export function JournalPageEditor() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Post | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchPosts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await api.getPosts(`page=${p}&per_page=${PAGE_SIZE}`);
      const data = res?.data ?? [];
      setPosts(data.map(mapPost));
      setTotal(res?.meta?.total ?? data.length);
      setPage(p);
    } catch (e) { console.error("JournalPageEditor: fetch failed", e); setMsg("Erreur de chargement"); setTimeout(() => setMsg(""), 3000); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const showMsg = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  }, []);

  function startCreate() {
    setDraft(emptyPost());
    setSlugManual(false);
    setCreating(true);
    setEditId(null);
  }

  function startEdit(p: Post) {
    setDraft(JSON.parse(JSON.stringify(p)));
    setSlugManual(true);
    setEditId(p.id);
    setCreating(false);
  }

  function cancelForm() {
    setCreating(false);
    setEditId(null);
    setDraft(null);
    setSlugManual(false);
  }

  function updateTitle(fr: string) {
    if (!draft) return;
    const next = { ...draft, title: { ...draft.title, fr } };
    if (!slugManual && !editId) {
      next.slug = slugify(fr);
    }
    setDraft(next);
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.fr.trim()) {
      showMsg("Le titre est obligatoire");
      return;
    }
    try {
      const payload = unmapPost({
        ...draft,
        slug: draft.slug || slugify(draft.title.fr),
      });
      if (editId) {
        await api.updatePost(editId, payload);
        setPosts(posts.map((p) => (p.id === editId ? { ...draft, id: editId } : p)));
        showMsg("Article mis a jour");
      } else {
        const res = await api.createPost(payload);
        const mapped = mapPost(res);
        setPosts([mapped, ...posts]);
        setTotal((t) => t + 1);
        showMsg("Article cree");
      }
      cancelForm();
    } catch (e) { console.error("JournalPageEditor: save failed", e); showMsg("Erreur lors de la sauvegarde"); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await api.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
      showMsg("Article supprime");
    } catch (e) { console.error("JournalPageEditor: delete failed", e); showMsg("Erreur lors de la suppression"); }
  }

  async function togglePublish(id: string) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    try {
      await api.updatePost(id, { is_published: !post.published });
      setPosts(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
      showMsg(post.published ? "Article masque" : "Article publie");
    } catch (e) { console.error("JournalPageEditor: toggle publish failed", e); showMsg("Erreur lors du changement de publication"); }
  }

  const publishedCount = posts.filter((p) => p.published).length;

  if (loading) {
    return (
      <AdminPage className="space-y-6">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="admin-list-card">
              <Skeleton className="h-14 w-14 flex-shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
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
        title="Journal terrain"
        description="Articles de terrain, mises a jour de projets et actualites de l'association."
        actions={!(creating || editId) ? <AdminButton onClick={startCreate}>+ Nouvel article</AdminButton> : undefined}
        meta={
          <>
            <span className="admin-badge-neutral">{total} article(s)</span>
            <span className="admin-badge-success">{publishedCount} publie(s)</span>
          </>
        }
      />

      {msg ? <AdminAlert tone="success">{msg}</AdminAlert> : null}

      {(creating || editId) && draft ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">{editId ? "Modifier l'article" : "Nouvel article"}</h3>
            <div className="flex gap-2">
              <AdminButton onClick={save}>Enregistrer</AdminButton>
              <AdminButton variant="ghost" onClick={cancelForm}>Annuler</AdminButton>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <AdminCard padding="lg" className="space-y-4">
                <div>
                  <label className="admin-label">Titre</label>
                  <input
                    value={draft.title.fr}
                    onChange={(e) => updateTitle(e.target.value)}
                    placeholder="Titre de l'article"
                    className="admin-input text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="admin-label">Contenu</label>
                  <RichTextEditor
                    value={draft.content.fr}
                    onChange={(html) => setDraft({ ...draft, content: { ...draft.content, fr: html } })}
                    placeholder="Redigez votre article : paragraphes, titres, listes, images..."
                  />
                </div>

                <div>
                  <label className="admin-label">Extrait</label>
                  <textarea
                    value={draft.excerpt.fr}
                    onChange={(e) => setDraft({ ...draft, excerpt: { ...draft.excerpt, fr: e.target.value } })}
                    rows={3}
                    placeholder="Resume court affiche sur la liste des articles"
                    className="admin-textarea"
                  />
                </div>
              </AdminCard>
            </div>

            <aside className="space-y-4">
              <AdminCard padding="md" className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Publication</h4>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Publier l'article</div>
                    <div className="text-xs text-slate-500">Visible sur le site public</div>
                  </div>
                </label>
              </AdminCard>

              <AdminCard padding="md" className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Image a la une</h4>
                <ImagePicker
                  label=""
                  value={draft.image}
                  onChange={(image) => setDraft({ ...draft, image })}
                />
              </AdminCard>

              <AdminCard padding="md" className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Parametres</h4>
                <div>
                  <label className="admin-label">Categorie</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as Post["category"] })}
                    className="admin-select"
                  >
                    <option value="terrain">Terrain</option>
                    <option value="project-update">Projet</option>
                    <option value="association">Association</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Localisation</label>
                  <input
                    value={draft.location.fr}
                    onChange={(e) => setDraft({ ...draft, location: { ...draft.location, fr: e.target.value } })}
                    placeholder="Ex: Thies, Senegal"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Slug (URL)</label>
                  <input
                    value={draft.slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      setDraft({ ...draft, slug: slugify(e.target.value) });
                    }}
                    placeholder="mon-article"
                    className="admin-input font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="admin-label">Temps de lecture</label>
                  <input
                    value={draft.readTime}
                    onChange={(e) => setDraft({ ...draft, readTime: e.target.value })}
                    placeholder="5 min"
                    className="admin-input"
                  />
                </div>
              </AdminCard>
            </aside>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="admin-list-card">
            <img src={post.image || ""} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl object-cover bg-slate-100" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${post.published ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="truncate text-sm font-semibold text-slate-900">{post.title.fr}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryColors[post.category]}`}>{categoryLabels[post.category]}</span>
                {!post.published ? <span className="admin-badge-neutral">Brouillon</span> : null}
              </div>
              <div className="mt-1 text-xs text-slate-500">{formatDate(post.createdAt)} · {post.location.fr} · {post.readTime}</div>
            </div>
            <div className="flex gap-2">
              <AdminButton variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => togglePublish(post.id)}>
                {post.published ? "Masquer" : "Publier"}
              </AdminButton>
              <AdminButton variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => startEdit(post)}>Modifier</AdminButton>
              <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => remove(post.id)}>Supprimer</AdminButton>
            </div>
          </div>
        ))}
      </div>

      <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={(p) => fetchPosts(p)} />
    </AdminPage>
  );
}
