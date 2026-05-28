"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";

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
      <section className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_100%)] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-secondary/10 bg-white p-10 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Admin</div>
            <h1 className="mt-3 text-3xl font-bold text-gray-950">Chargement de l&apos;espace admin...</h1>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
