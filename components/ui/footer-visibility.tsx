"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { loadGlobalSettings } from "@/lib/admin/global-settings";

export function FooterVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    loadGlobalSettings().then((settings) => {
      const pageVisibility = settings.pageVisibility[pathname];
      if (pageVisibility) {
        setVisible(pageVisibility.footer ?? true);
      }
    });
  }, [pathname]);

  if (!visible) return null;
  return <>{children}</>;
}
