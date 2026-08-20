"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100];

function pageList(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);
  return pages;
}

// Shared prev/next + page-number + page-size controls for every admin list.
export function PaginationControls({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Showing{" "}
        <span className="font-semibold text-[var(--color-on-surface)]">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--color-on-surface)]">
          {total}
        </span>
      </p>

      <div className="flex items-center gap-1.5">
        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="mr-2 py-1 px-2 text-xs rounded border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] focus:border-[var(--color-primary)] outline-none font-[var(--font-label)] cursor-pointer"
            aria-label="Rows per page"
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center h-8 w-8 rounded border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-container-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="px-1 text-xs text-[var(--color-on-surface-variant)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded text-xs font-[var(--font-label)] transition-colors ${
                p === page
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-container-low)]"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center justify-center h-8 w-8 rounded border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-container-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}