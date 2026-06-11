export function Pagination({ current, total, pageSize, onChange }: {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1);
    }
  }

  return (
    <div className="admin-surface flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        {Math.min((current - 1) * pageSize + 1, total)}–{Math.min(current * pageSize, total)} sur {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          className="admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-30"
        >
          Precedent
        </button>
        {pages.map((p, i) =>
          p === -1 ? (
            <span key={`dot-${i}`} className="px-1 text-xs text-slate-300">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-[34px] rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                p === current ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
          className="admin-btn-ghost px-3 py-1.5 text-xs disabled:opacity-30"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
