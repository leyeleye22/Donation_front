import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  eyebrowAlt?: boolean;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({ eyebrow, eyebrowAlt, title, description, actions, meta }: PageHeaderProps) {
  return (
    <div className="admin-surface px-5 py-5 lg:px-6 lg:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className={eyebrowAlt ? "admin-eyebrow-alt" : "admin-eyebrow"}>{eyebrow}</p>
          ) : null}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 lg:text-[1.75rem]">{title}</h1>
          {description ? <p className="mt-2 text-sm leading-7 text-slate-500 lg:text-[15px]">{description}</p> : null}
          {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
