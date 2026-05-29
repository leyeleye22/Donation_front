"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapPost, unmapPost } from "@/lib/api-mappers";
import { Pagination } from "@/components/admin/pagination";
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
    setCreating(true);
    setEditId(null);
  }

  function startEdit(p: Post) {
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
      const payload = unmapPost(draft);
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

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Chargement...</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Journal</h1>
          <p className="text-xs text-gray-500">{total} articles &middot; {publishedCount} publies</p>
        </div>
        <button onClick={startCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          + Ajouter un article
        </button>
      </div>

      {msg ? <div className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">{msg}</div> : null}

      {(creating || editId) && draft ? (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Modifier l'article" : "Nouvel article"}</h3>
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
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Extrait (fr)</label>
            <textarea value={draft.excerpt.fr} onChange={(e) => setDraft({ ...draft, excerpt: { ...draft.excerpt, fr: e.target.value } })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Contenu (fr)</label>
            <textarea value={draft.content.fr} onChange={(e) => setDraft({ ...draft, content: { ...draft.content, fr: e.target.value } })} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Categorie</label>
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Post["category"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option value="terrain">Terrain</option>
                <option value="project-update">Projet</option>
                <option value="association">Association</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Image</label>
              <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Localisation</label>
              <input value={draft.location.fr} onChange={(e) => setDraft({ ...draft, location: { ...draft.location, fr: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
            <button onClick={cancelForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-4 p-4">
              <img src={post.image} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${post.published ? "bg-secondary" : "bg-gray-300"}`} />
                  <span className="truncate text-sm font-semibold text-gray-900">{post.title.fr}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryColors[post.category]}`}>{categoryLabels[post.category]}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{post.createdAt} &middot; {post.location.fr} &middot; {post.readTime}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => togglePublish(post.id)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${post.published ? "border-gray-200 text-gray-600 hover:bg-gray-50" : "border-secondary/30 text-secondary hover:bg-secondary/6"}`}>
                  {post.published ? "Masquer" : "Publier"}
                </button>
                <button onClick={() => startEdit(post)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Modifier</button>
                <button onClick={() => remove(post.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={(p) => fetchPosts(p)} />
    </section>
  );
}
