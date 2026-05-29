import { resolveImageUrl } from "@/lib/image-url";
import type { Project, Post, GalleryItem, NavItem } from "@/lib/types";

function toRelativeUrl(url: string): string {
  if (!url) return "";
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return url;
  }
}

function toLocalized(val: any): { fr: string; en: string; ar: string } {
  if (!val) return { fr: "", en: "", ar: "" };
  if (typeof val === "string") return { fr: val, en: val, ar: val };
  return { fr: val.fr || "", en: val.en || "", ar: val.ar || "" };
}

export function mapProject(p: any): Project {
  return {
    id: p.id,
    slug: p.slug,
    theme: p.theme || "water",
    title: toLocalized(p.title),
    description: toLocalized(p.description),
    location: toLocalized(p.location),
    beneficiaryLabel: toLocalized(p.beneficiary_label ?? p.beneficiaryLabel),
    goalAmount: Number(p.goal_amount ?? p.goalAmount ?? 0),
    collectedAmount: Number(p.collected_amount ?? p.collectedAmount ?? 0),
    coverImage: resolveImageUrl(p.cover_image ?? p.coverImage ?? ""),
    status: p.status || "ongoing",
    createdAt: p.created_at ?? p.createdAt ?? "",
  };
}

export function unmapProject(p: Project): Record<string, any> {
  return {
    slug: p.slug,
    theme: p.theme,
    title: p.title,
    description: p.description,
    location: p.location,
    beneficiary_label: p.beneficiaryLabel,
    goal_amount: p.goalAmount,
    collected_amount: p.collectedAmount,
    cover_image: toRelativeUrl(p.coverImage),
    status: p.status,
  };
}

export function mapPost(p: any): Post {
  return {
    id: p.id,
    slug: p.slug,
    title: toLocalized(p.title),
    excerpt: toLocalized(p.excerpt),
    content: toLocalized(p.content),
    image: resolveImageUrl(p.image ?? p.cover_image ?? ""),
    category: p.category || "terrain",
    location: toLocalized(p.location),
    readTime: p.read_time ?? p.readTime ?? "5 min",
    published: p.is_published ?? p.published ?? false,
    createdAt: p.created_at ?? p.createdAt ?? "",
  };
}

export function unmapPost(p: Post): Record<string, any> {
  const coverImage = toRelativeUrl(p.image);
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    image: coverImage,
    category: p.category,
    location: p.location,
    read_time: p.readTime,
    is_published: p.published,
  };
}

export function mapGalleryItem(g: any): GalleryItem {
  const titleRaw = g.title ?? g.name ?? "";
  return {
    id: g.id,
    title: toLocalized(titleRaw),
    image: resolveImageUrl(g.file_path ?? g.image ?? g.url ?? ""),
    category: g.categories ?? (g.category ? (Array.isArray(g.category) ? g.category : [g.category]) : []),
    type: g.file_type ?? g.type ?? "image",
  };
}

export function mapNavItem(n: any): NavItem {
  const labelRaw = n.label ?? n.title ?? "";
  return {
    label: toLocalized(labelRaw),
    href: n.href || n.path || "/",
  };
}
