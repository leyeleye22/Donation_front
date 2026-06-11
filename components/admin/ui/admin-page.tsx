import { ReactNode } from "react";

export function AdminPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`admin-page ${className}`}>{children}</section>;
}
