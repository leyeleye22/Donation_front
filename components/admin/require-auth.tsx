"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("entraide-admin-token");
    if (!token) {
      router.replace("/login");
      return;
    }
    checkAdminSession().then((ok) => {
      if (!ok) {
        localStorage.removeItem("entraide-admin-token");
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  if (!authorized) {
    return (
      <div className="admin-page flex min-h-screen items-center justify-center">
        <div className="admin-surface px-10 py-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="admin-eyebrow-alt mt-5">Administration</p>
          <p className="mt-2 text-sm text-slate-500">Verification de la session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
