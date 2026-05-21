interface PaginationProps {
  page:     number;
  total:    number;
  limit:    number;
  onPage:   (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ page, total, limit, onPage, loading }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  // Build page list with ellipsis
  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const near = new Set(
      [1, totalPages, page - 1, page, page + 1].filter(n => n >= 1 && n <= totalPages)
    );
    let prev = 0;
    for (const n of [...near].sort((a, b) => a - b)) {
      if (n - prev > 1) pages.push('…');
      pages.push(n);
      prev = n;
    }
  }

  return (
    <div className="px-2 py-4 text-[#64748B]">

      {/* Desktop */}
      <div className="hidden items-center justify-between sm:flex" aria-label="Pagination">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || loading}
          className="flex items-center gap-x-2 text-sm font-medium transition-colors duration-150 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
          </svg>
          Previous
        </button>

        <ul className="flex items-center gap-1">
          {pages.map((item, i) => (
            <li key={`${item}-${i}`} className="text-sm">
              {item === '…' ? (
                <div className="px-2 py-1 text-[#0F172A]">…</div>
              ) : (
                <button
                  onClick={() => onPage(item as number)}
                  disabled={loading}
                  aria-current={page === item ? 'page' : undefined}
                  className={[
                    'px-3 py-2 rounded-xl font-medium transition-all duration-150 disabled:cursor-not-allowed',
                    page === item
                      ? 'bg-[#111827]/15 text-[#111827] border border-[#111827]/30'
                      : 'hover:text-[#111827] hover:bg-[#111827]/8 border border-transparent',
                  ].join(' ')}
                >
                  {item}
                </button>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || loading}
          className="flex items-center gap-x-2 text-sm font-medium transition-colors duration-150 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between text-sm font-medium sm:hidden">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5 border border-[#0F172A]/30 rounded-xl bg-[#FFFFFF] hover:border-[#111827]/40 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          Previous
        </button>

        <span className="px-3 py-1.5 border border-[#0F172A]/20 rounded-xl bg-[#FFFFFF] text-[#64748B]">
          Page <span className="text-[#0F172A] font-semibold">{page}</span> of{' '}
          <span className="text-[#0F172A] font-semibold">{totalPages}</span>
        </span>

        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || loading}
          className="px-3 py-1.5 border border-[#0F172A]/30 rounded-xl bg-[#FFFFFF] hover:border-[#111827]/40 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          Next
        </button>
      </div>

    </div>
  );
}
