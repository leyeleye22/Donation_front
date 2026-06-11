"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      setReady(true);
      return;
    }

    checkAdminSession().then((ok) => {
      if (!ok) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    });
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="admin-page flex min-h-screen items-center justify-center py-20">
        <div className="admin-surface w-full max-w-md px-8 py-10 text-center">
          <p className="admin-eyebrow">Administration</p>
          <Skeleton className="mx-auto mt-4 h-8 w-56 rounded-xl" />
          <Skeleton className="mx-auto mt-3 h-4 w-40 rounded-xl" />
          <p className="mt-6 text-sm text-slate-500">Chargement de l&apos;espace admin...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
