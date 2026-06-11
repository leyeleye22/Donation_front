import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  trend?: { label: string; positive?: boolean };
  accent?: "orange" | "green" | "slate" | "blue";
};

const accentMap = {
  orange: "from-primary/15 to-orange-50 text-primary",
  green: "from-secondary/15 to-green-50 text-secondary",
  slate: "from-slate-100 to-slate-50 text-slate-600",
  blue: "from-sky-100 to-sky-50 text-sky-600",
};

export function StatCard({ label, value, hint, icon, trend, accent = "slate" }: StatCardProps) {
  return (
    <div className="admin-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
        </div>
        {icon ? (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]}`}>
            {icon}
          </div>
        ) : null}
      </div>
      {trend ? (
        <div className="mt-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              trend.positive !== false ? "bg-green-50 text-secondary" : "bg-orange-50 text-primary"
            }`}
          >
            {trend.label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
