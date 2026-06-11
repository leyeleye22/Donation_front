import { ReactNode } from "react";

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "soft";
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function AdminCard({ children, className = "", padding = "md", variant = "default" }: AdminCardProps) {
  const base = variant === "soft" ? "admin-surface-soft" : "admin-surface";

  return <div className={`${base} ${paddingMap[padding]} ${className}`}>{children}</div>;
}
