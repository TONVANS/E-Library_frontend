'use client';

import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Page numbers to show: first, last, and a window around the current page, with gaps as null
function getPageItems(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  const items: (number | null)[] = [1];
  if (start > 2) items.push(null);
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push(null);
  items.push(totalPages);
  return items;
}

export function Pagination({ page, totalPages, onPageChange, className = '' }: PaginationProps) {
  // Shown even for a single page so users can see there is nothing more to browse
  if (totalPages < 1) return null;

  const navBtn =
    'h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm flex items-center gap-1';

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap justify-center items-center gap-1.5 pt-6 ${className}`}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={navBtn}
        aria-label="ໜ້າກ່ອນໜ້າ"
      >
        <span className="material-symbols-outlined text-base">chevron_left</span>
        <span className="hidden sm:inline">ກ່ອນໜ້າ</span>
      </button>

      {getPageItems(page, totalPages).map((item, idx) =>
        item === null ? (
          <span key={`gap-${idx}`} className="w-9 text-center text-xs text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`h-9 min-w-9 px-2 rounded-xl text-xs font-semibold transition-all shadow-sm border ${
              item === page
                ? 'bg-[#003d9b] text-white border-[#003d9b]'
                : 'bg-white text-[#191c1d] border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={navBtn}
        aria-label="ໜ້າຖັດໄປ"
      >
        <span className="hidden sm:inline">ຖັດໄປ</span>
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </nav>
  );
}
