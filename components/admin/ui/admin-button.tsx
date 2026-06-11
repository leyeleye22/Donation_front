import { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "admin-btn-primary",
  secondary: "admin-btn-secondary",
  ghost: "admin-btn-ghost",
  danger: "admin-btn-danger",
};

export function AdminButton({ variant = "primary", className = "", children, ...props }: AdminButtonProps) {
  return (
    <button type="button" className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
