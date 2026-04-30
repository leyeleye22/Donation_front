import { galleryItems } from "@/lib/mock-data/gallery";
import { homeContent } from "@/lib/mock-data/home";
import { posts } from "@/lib/mock-data/posts";
import { projects } from "@/lib/mock-data/projects";
import { pageContent, siteChromeContent } from "@/lib/mock-data/ui-content";
import { navItems, siteSettings } from "@/lib/mock-data/site";

export const cmsRegistry = {
  providerMode: "local-mock",
  futureCmsTargets: [
    "Sanity",
    "Storyblok",
    "Contentful",
    "Strapi",
    "Directus",
    "CloudCannon",
    "Prismic"
  ],
  notes: {
    contentManagerIo:
      "contentmanager.io is not a website CMS for this use case; it is a blog monetization platform.",
    netlify:
      "Netlify provides CMS integrations rather than a single built-in CMS on the referenced page.",
    gartner:
      "Gartner's Web Content Management category is useful for vendor evaluation later, not for the current front-only implementation."
  },
  collections: [
    {
      key: "siteSettings",
      label: "Site settings",
      description: "Global site identity, CTA labels, and shared settings",
      source: "lib/mock-data/site.ts",
      entryCount: 1
    },
    {
      key: "navigation",
      label: "Navigation",
      description: "Header and footer navigation links",
      source: "lib/mock-data/site.ts",
      entryCount: navItems.length
    },
    {
      key: "siteChrome",
      label: "Header and footer content",
      description: "Emergency banner, footer stats, contact labels, and shared chrome copy",
      source: "lib/mock-data/ui-content.ts",
      entryCount: 1
    },
    {
      key: "homePage",
      label: "Homepage sections",
      description: "Hero, impact, CTA, transparency, and newsletter blocks",
      source: "lib/mock-data/home.ts",
      entryCount: 1
    },
    {
      key: "projects",
      label: "Projects",
      description: "Project cards, project detail pages, and related metrics",
      source: "lib/mock-data/projects.ts",
      entryCount: projects.length
    },
    {
      key: "journalPosts",
      label: "Journal posts",
      description: "Editorial feed, featured stories, and project updates",
      source: "lib/mock-data/posts.ts",
      entryCount: posts.length
    },
    {
      key: "galleryItems",
      label: "Gallery items",
      description: "Filterable gallery media content",
      source: "lib/mock-data/gallery.ts",
      entryCount: galleryItems.length
    },
    {
      key: "pageContent",
      label: "Page UI content",
      description: "Static page labels and explanatory copy for projects, about, gallery, and contact pages",
      source: "lib/mock-data/ui-content.ts",
      entryCount: Object.keys(pageContent).length
    }
  ]
} as const;

export function getCmsSnapshot() {
  return {
    registry: cmsRegistry,
    siteSettings,
    navItems,
    siteChromeContent,
    pageContent,
    homeContent,
    projects,
    posts,
    galleryItems
  };
}
