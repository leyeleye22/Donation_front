"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export function FooterVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const settings = useSettings();

  const visible = useMemo(() => {
    const pageVisibility = settings.pageVisibility[pathname];
    return pageVisibility ? pageVisibility.footer : true;
  }, [settings, pathname]);

  if (!visible) return null;
  return <>{children}</>;
}
