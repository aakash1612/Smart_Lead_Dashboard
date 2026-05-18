import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import { cn } from '@/utils';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = meta;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
      <p className="text-sm text-[var(--text-muted)]">
        Showing <span className="font-medium text-[var(--text-secondary)]">{from}–{to}</span> of{' '}
        <span className="font-medium text-[var(--text-secondary)]">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            hasPrevPage
              ? 'hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]'
              : 'text-[var(--text-muted)] cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <div key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-[var(--text-muted)] text-sm">…</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-[var(--accent)] text-white'
                    : 'hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]'
                )}
              >
                {p}
              </button>
            </div>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            hasNextPage
              ? 'hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]'
              : 'text-[var(--text-muted)] cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
