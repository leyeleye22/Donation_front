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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">Verification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
