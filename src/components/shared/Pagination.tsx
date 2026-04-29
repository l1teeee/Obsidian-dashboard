interface PaginationProps {
  page:    number;
  total:   number;
  limit:   number;
  onPage:  (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ page, total, limit, onPage, loading }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  // Build page number list: always show first, last, current ±1, with ellipsis
  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const near = new Set([1, totalPages, page - 1, page, page + 1].filter(n => n >= 1 && n <= totalPages));
    let prev = 0;
    for (const n of [...near].sort((a, b) => a - b)) {
      if (n - prev > 1) pages.push('…');
      pages.push(n);
      prev = n;
    }
  }

  return (
    <div className="px-6 py-4 border-t border-[#4c4450]/10 flex items-center justify-between flex-wrap gap-3">
      <p className="text-xs text-[#988d9c]">
        Showing <span className="text-white font-mono">{start}-{end}</span> of{' '}
        <span className="text-white font-mono">{total.toLocaleString()}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1 || loading}
          onClick={() => onPage(page - 1)}
          className="px-3 py-1.5 rounded-lg border border-[#4c4450]/20 text-xs text-[#988d9c] hover:text-white hover:border-[#4c4450]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-2 text-xs text-[#4c4450]">…</span>
          ) : (
            <button
              key={p}
              disabled={loading}
              onClick={() => onPage(p as number)}
              className={[
                'w-8 h-8 rounded-lg text-xs font-semibold transition-all border',
                p === page
                  ? 'bg-[#d394ff]/15 border-[#d394ff]/30 text-[#d394ff]'
                  : 'border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40',
              ].join(' ')}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages || loading}
          onClick={() => onPage(page + 1)}
          className="px-3 py-1.5 rounded-lg border border-[#4c4450]/20 text-xs text-[#988d9c] hover:text-white hover:border-[#4c4450]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
