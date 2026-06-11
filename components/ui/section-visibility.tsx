"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

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
  | "testimonials"
  | "donationCta"
  | "newsletter"
  | "footer";

export function SectionVisibility({ section, children }: { section: SectionKey; children: ReactNode }) {
  const pathname = usePathname();
  const settings = useSettings();

  const visible = useMemo(() => {
    const pageVisibility = settings.pageVisibility[pathname];
    return pageVisibility ? pageVisibility[section] : true;
  }, [settings, pathname, section]);

  if (!visible) return null;
  return <>{children}</>;
}
