import type { ComponentType } from "react";
import {
  IconDashboard,
  IconDocument,
  IconFolder,
  IconMail,
  IconSettings,
} from "@/components/admin/icons";

export type AdminNavItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavigation: AdminNavGroup[] = [
  {
    title: "Pilotage",
    items: [{ label: "Tableau de bord", href: "/dashboard", icon: IconDashboard }],
  },
  {
    title: "Programmes & impact",
    items: [
      { label: "Projets", href: "/dashboard/projects", icon: IconFolder },
      { label: "Journal terrain", href: "/dashboard/journal", icon: IconDocument },
      { label: "Galerie", href: "/dashboard/gallery" },
      { label: "Mediatheque", href: "/dashboard/media" },
    ],
  },
  {
    title: "Site public",
    items: [
      { label: "Centre de contenu", href: "/dashboard/content", icon: IconDocument },
      { label: "Page accueil", href: "/dashboard/content/home" },
      { label: "Page a propos", href: "/dashboard/content/about" },
      { label: "Page contact", href: "/dashboard/content/contact" },
    ],
  },
  {
    title: "Relations & confiance",
    items: [
      { label: "Messages", href: "/dashboard/messages", icon: IconMail },
      { label: "Newsletter", href: "/dashboard/newsletter" },
      { label: "Templates email", href: "/dashboard/email-templates" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { label: "Themes", href: "/dashboard/themes" },
      { label: "Navigation", href: "/dashboard/navigation" },
      { label: "Parametres", href: "/dashboard/settings", icon: IconSettings },
    ],
  },
];
