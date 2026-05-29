export type AdminNavItem = {
  label: string;
  href: string;
};

export const adminNavigation = [
  {
    title: "Vue d'ensemble",
    items: [{ label: "Dashboard", href: "/dashboard" }]
  },
  {
    title: "Contenu",
    items: [
      { label: "Centre de contenu", href: "/dashboard/content" },
      { label: "Accueil", href: "/dashboard/content/home" },
      { label: "A propos", href: "/dashboard/content/about" },
      { label: "Contact", href: "/dashboard/content/contact" }
    ]
  },
  {
    title: "Collections",
    items: [
      { label: "Projets", href: "/dashboard/projects" },
      { label: "Journal", href: "/dashboard/journal" },
      { label: "Galerie", href: "/dashboard/gallery" },
      { label: "Media", href: "/dashboard/media" }
    ]
  },
  {
    title: "Communication",
    items: [
      { label: "Templates email", href: "/dashboard/email-templates" },
      { label: "Newsletter", href: "/dashboard/newsletter" }
    ]
  },
  {
    title: "Structure",
    items: [
      { label: "Themes", href: "/dashboard/themes" },
      { label: "Navigation", href: "/dashboard/navigation" },
      { label: "Parametres", href: "/dashboard/settings" }
    ]
  }
] as const;
