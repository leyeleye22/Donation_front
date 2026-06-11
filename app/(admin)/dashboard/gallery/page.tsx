"use client";

import { useEffect, useCallback, useState } from "react";
import { api } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";

type GalleryPhoto = {
  id: string;
  title: string;
  image: string;
};

type GalleryBlock = {
  id: string;
  name: string;
  photos: GalleryPhoto[];
  collapsed: boolean;
};

function PhotoCard({ photo, onView, onReplace, onDelete }: {
  photo: GalleryPhoto;
  onView: (photo: GalleryPhoto) => void;
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-400">Image introuvable</div>
        ) : (
          <img
            src={photo.image}
            alt={photo.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setError(true)}
          />
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-primary/0 opacity-0 transition-all group-hover:bg-primary/35 group-hover:opacity-100">
        <button type="button" onClick={() => onView(photo)} className="admin-btn-secondary px-3 py-1.5 text-xs shadow-lg">
          Visualiser
        </button>
        <button type="button" onClick={() => onReplace(photo.id)} className="admin-btn-secondary px-3 py-1.5 text-xs shadow-lg">
          Remplacer
        </button>
        <button type="button" onClick={() => onDelete(photo.id)} className="admin-btn-danger px-3 py-1.5 text-xs shadow-lg">
          Supprimer
        </button>
      </div>
      <div className="p-2.5">
        <div className="truncate text-xs font-medium text-slate-900">{photo.title}</div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [blocks, setBlocks] = useState<GalleryBlock[]>([]);
  const [viewerPhoto, setViewerPhoto] = useState<GalleryPhoto | null>(null);
  const [newBlockName, setNewBlockName] = useState("");
  const [showNewBlock, setShowNewBlock] = useState(false);
  const [pageOffsets, setPageOffsets] = useState<Record<string, number>>({});

  const PHOTOS_PER_PAGE = 8;

  const loadBlocks = useCallback(() => {
    api.getGallery().then((data) => {
      const items = Array.isArray(data) ? data : data?.data ?? [];
      if (items.length > 0) {
        const grouped: Record<string, GalleryBlock> = {};
        for (const item of items) {
          const title = item.title?.fr || item.title || "";
          const image = item.image || item.file_path || "";
          const cats: string[] = item.categories ?? [];
          const cat = cats[0] || "general";
          if (!grouped[cat]) {
            grouped[cat] = { id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), photos: [], collapsed: false };
          }
          grouped[cat].photos.push({ id: item.id, title, image });
        }
        setBlocks(Object.values(grouped));
      }
    }).catch((e) => { console.error("AdminGallery: failed to load gallery", e); });
  }, []);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  function toggleCollapse(id: string) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, collapsed: !b.collapsed } : b)));
  }

  async function addBlock() {
    if (!newBlockName.trim()) return;
    const id = newBlockName.toLowerCase().replace(/\s+/g, "-");
    if (blocks.find((b) => b.id === id)) return;
    try {
      await api.createCategory({ name: newBlockName.trim(), slug: id, type: "project" });
      await loadBlocks();
    } catch {}
    setNewBlockName("");
    setShowNewBlock(false);
  }

  async function deleteBlock(id: string) {
    if (!confirm(`Supprimer le bloc "${id}" et toutes ses photos ?`)) return;
    try {
      await api.deleteCategory(id);
      for (const photo of blocks.find((b) => b.id === id)?.photos ?? []) {
        await api.deleteGalleryItem(photo.id).catch((e) => { console.error("AdminGallery: failed to delete photo", e); });
      }
    } catch {}
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  async function handleUpload(blockId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []);
      for (const file of files.filter((f) => f.type.startsWith("image/"))) {
        try {
          await api.uploadMedia(
            file,
            { fr: file.name.replace(/\.[^/.]+$/, "") },
            [blockId]
          );
        } catch {}
      }
      await loadBlocks();
    };
    input.click();
  }

  async function replacePhoto(photoId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      try {
        const res = await api.uploadMedia(file);
        await api.updateGalleryItem(photoId, { file_path: res.file_path || res.url || res.image || "" });
      } catch {}
      await loadBlocks();
    };
    input.click();
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await api.deleteGalleryItem(photoId);
      setBlocks(blocks.map((b) => ({ ...b, photos: b.photos.filter((p) => p.id !== photoId) })));
    } catch {}
  }

  function getPaginatedPhotos(blockId: string, photos: GalleryPhoto[]) {
    const offset = pageOffsets[blockId] || 0;
    return photos.slice(offset, offset + PHOTOS_PER_PAGE);
  }

  function nextPage(blockId: string, total: number) {
    const offset = (pageOffsets[blockId] || 0) + PHOTOS_PER_PAGE;
    if (offset < total) setPageOffsets({ ...pageOffsets, [blockId]: offset });
  }

  function prevPage(blockId: string) {
    const offset = Math.max(0, (pageOffsets[blockId] || 0) - PHOTOS_PER_PAGE);
    setPageOffsets({ ...pageOffsets, [blockId]: offset });
  }

  const totalPhotos = blocks.reduce((sum, b) => sum + b.photos.length, 0);

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Programmes & impact"
        title="Galerie photos"
        description="Blocs thematiques et preuves visuelles des actions sur le terrain."
        actions={<AdminButton onClick={() => setShowNewBlock(true)}>Nouveau bloc</AdminButton>}
        meta={
          <>
            <span className="admin-badge-neutral">{blocks.length} bloc(s)</span>
            <span className="admin-badge-info">{totalPhotos} photo(s)</span>
          </>
        }
      />

      {showNewBlock ? (
        <div className="admin-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <input
            value={newBlockName}
            onChange={(e) => setNewBlockName(e.target.value)}
            placeholder="Nom du bloc (ex: Forages, Ecoles...)"
            className="admin-input flex-1"
            onKeyDown={(e) => e.key === "Enter" && addBlock()}
          />
          <div className="flex gap-2">
            <AdminButton onClick={addBlock}>Creer</AdminButton>
            <AdminButton variant="ghost" onClick={() => { setShowNewBlock(false); setNewBlockName(""); }}>Annuler</AdminButton>
          </div>
        </div>
      ) : null}

      {blocks.length === 0 ? (
        <AdminEmptyState
          title="Aucun bloc"
          description="Creez un bloc thematique pour organiser vos photos de terrain."
          action={<AdminButton onClick={() => setShowNewBlock(true)}>Nouveau bloc</AdminButton>}
        />
      ) : (
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="admin-surface overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <button type="button" onClick={() => toggleCollapse(block.id)} className="flex items-center gap-3 text-left">
                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${block.collapsed ? "" : "rotate-90"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-sm font-semibold text-slate-900">{block.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{block.photos.length} photo{block.photos.length > 1 ? "s" : ""}</span>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <AdminButton variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => handleUpload(block.id)}>
                    + Ajouter
                  </AdminButton>
                  <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => deleteBlock(block.id)}>
                    Supprimer le bloc
                  </AdminButton>
                </div>
              </div>
              {!block.collapsed ? (
                <div className="border-t border-slate-100 px-5 py-4">
                  {block.photos.length === 0 ? (
                    <p className="admin-empty py-8 text-center text-sm">Aucune photo. Cliquez sur &quot;+ Ajouter&quot;.</p>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {getPaginatedPhotos(block.id, block.photos).map((photo) => (
                          <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onView={setViewerPhoto}
                            onReplace={replacePhoto}
                            onDelete={deletePhoto}
                          />
                        ))}
                      </div>
                      {block.photos.length > PHOTOS_PER_PAGE ? (
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <p className="text-xs text-slate-500">
                            {Math.min((pageOffsets[block.id] || 0) + 1, block.photos.length)}&ndash;{Math.min((pageOffsets[block.id] || 0) + PHOTOS_PER_PAGE, block.photos.length)} sur {block.photos.length}
                          </p>
                          <div className="flex gap-1">
                            <button type="button" onClick={() => prevPage(block.id)} disabled={!(pageOffsets[block.id] || 0)} className="admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed">
                              Precedent
                            </button>
                            <button type="button" onClick={() => nextPage(block.id, block.photos.length)} disabled={(pageOffsets[block.id] || 0) + PHOTOS_PER_PAGE >= block.photos.length} className="admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed">
                              Suivant
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {viewerPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setViewerPhoto(null)}>
          <div className="admin-surface relative max-h-[90vh] max-w-[90vw] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={viewerPhoto.image} alt={viewerPhoto.title} className="max-h-[80vh] w-full object-contain" />
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <span className="text-sm font-medium text-slate-900">{viewerPhoto.title}</span>
              <AdminButton variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setViewerPhoto(null)}>Fermer</AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
