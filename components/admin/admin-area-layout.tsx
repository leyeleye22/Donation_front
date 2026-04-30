"use client";

import { AdminSessionGuard } from "@/components/admin/admin-session-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionGuard>
      <AdminShell>{children}</AdminShell>
    </AdminSessionGuard>
  );
}
