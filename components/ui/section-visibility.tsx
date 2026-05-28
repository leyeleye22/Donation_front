"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { loadGlobalSettings } from "@/lib/admin/global-settings";

type SectionKey =
  | "emergencyBanner"
  | "hero"
  | "trustBar"
  | "entryPoints"
  | "projects"
  | "mission"
  | "journal"
  | "transparency"
  | "gallery"
  | "donationCta"
  | "newsletter"
  | "footer";

export function SectionVisibility({ section, children }: { section: SectionKey; children: ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    loadGlobalSettings().then((settings) => {
      const pageVisibility = settings.pageVisibility[pathname];
      if (pageVisibility) {
        setVisible(pageVisibility[section] ?? true);
      }
    });
  }, [pathname, section]);

  if (!visible) return null;
  return <>{children}</>;
}
