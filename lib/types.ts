export type Locale = "fr" | "en" | "ar";

export type LocalizedText = Record<Locale, string>;

export type NavItem = {
  label: LocalizedText;
  href: string;
};

export type Project = {
  id: string;
  slug: string;
  theme: "education" | "water" | "health" | "tabaski" | "food";
  title: LocalizedText;
  description: LocalizedText;
  goalAmount: number;
  collectedAmount: number;
  coverImage: string;
  status: "upcoming" | "ongoing" | "completed";
  location: LocalizedText;
  beneficiaryLabel: LocalizedText;
  createdAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  image: string;
  category: "terrain" | "project-update" | "association";
  location: LocalizedText;
  readTime: string;
  published: boolean;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  title: LocalizedText;
  image: string;
  category: string[];
  type: "image" | "video";
};

export type SiteSettings = {
  siteName: string;
  heroTitle: LocalizedText;
  heroText: LocalizedText;
  aboutSummary: LocalizedText;
  donationCta: LocalizedText;
};
