'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { DocumentCard } from '@/components/cards/DocumentCard';
import { Pagination } from '@/components/ui/Pagination';
import { useAuthStore } from '@/store/authStore';
import { useFilterStore } from '@/store/filterStore';
import { isFacultyLocked, useCatalogMeta, useDocumentCatalog } from '@/hooks/useDocumentCatalog';
import { useFilterUrlSync } from '@/hooks/useFilterUrlSync';

const PAGE_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 400;

function DocumentsCatalog() {
  useFilterUrlSync();

  const { user } = useAuthStore();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedFacultyId,
    setSelectedFacultyId,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedYear,
    setSelectedYear,
    resetFilters,
  } = useFilterStore();

  const { faculties, categories, years } = useCatalogMeta();
  const { documents, totalPages, totalItems, loading, page, setPage } =
    useDocumentCatalog(PAGE_SIZE);

  // Non-admin users are limited to their own faculty by the backend, so the select is fixed
  const facultyLocked = isFacultyLocked(user);
  const effectiveFacultyId = facultyLocked ? user!.facultyId! : selectedFacultyId;
  const departments = faculties.find((f) => f.id === effectiveFacultyId)?.departments ?? [];

  // Debounce typing so every keystroke doesn't hit the API
  const [searchInput, setSearchInput] = useState(searchQuery);
  // Follow external changes to the query (reset button, URL) without an extra effect
  const [syncedQuery, setSyncedQuery] = useState(searchQuery);
  if (searchQuery !== syncedQuery) {
    setSyncedQuery(searchQuery);
    setSearchInput(searchQuery);
  }
  useEffect(() => {
    if (searchInput === searchQuery) return;
    const timer = setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchQuery]);

  const resultsRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (next: number) => {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasActiveFilters =
    !!searchQuery ||
    selectedCategoryId !== null ||
    (!facultyLocked && selectedFacultyId !== null) ||
    selectedDepartmentId !== null ||
    selectedYear !== null;

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-6">
      {/* Header Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#003d9b] to-[#3a5f94] text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ຄັງເອກະສານວິຊາການທັງໝົດ
          </h1>
          <p className="text-xs md:text-sm text-[#dae2ff] mt-1">
            ຄົ້ນຫາບົດວິໄຈ, ບົດວິທະຍານິພົນ, ແລະ ສິ່ງພິມວິຊາການ ທັງໝົດ {totalItems} ລາຍການ
          </p>
        </div>
        <div className="w-full md:w-80">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearchQuery(searchInput);
              }}
              placeholder="ຄົ້ນຫາຫົວຂໍ້, ຊື່ຜູ້ຂຽນ..."
              className="w-full pl-9 pr-9 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs text-[#191c1d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full flex"
                aria-label="ລ້າງຄຳຄົ້ນຫາ"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/70 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1d]">
                ຕົວກັ່ນຕອງເອກະສານ
              </h3>
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="text-[11px] font-semibold text-red-600 hover:underline disabled:text-slate-300 disabled:no-underline"
              >
                ລ້າງຄ່າ
              </button>
            </div>

            {/* Faculty Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#434654] mb-2">ສັງກັດຄະນະ</label>
              <select
                value={effectiveFacultyId ?? ''}
                disabled={facultyLocked}
                onChange={(e) =>
                  setSelectedFacultyId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value="">ທຸກຄະນະ (All Faculties)</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              {facultyLocked && (
                <p className="text-[11px] text-[#737685] mt-1.5">
                  ສະແດງສະເພາະເອກະສານຂອງຄະນະທ່ານ
                </p>
              )}
            </div>

            {/* Department Filter (depends on the selected faculty) */}
            {departments.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-2">ພາກວິຊາ</label>
                <select
                  value={selectedDepartmentId ?? ''}
                  onChange={(e) =>
                    setSelectedDepartmentId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                >
                  <option value="">ທຸກພາກວິຊາ</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#434654] mb-2">
                ໝວດໝູ່ເອກະສານ
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategoryId === null
                      ? 'bg-blue-50 text-[#003d9b] font-bold'
                      : 'text-[#434654] hover:bg-slate-50'
                  }`}
                >
                  ທຸກໝວດໝູ່
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate ${
                      selectedCategoryId === c.id
                        ? 'bg-blue-50 text-[#003d9b] font-bold'
                        : 'text-[#434654] hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#434654] mb-2">
                ປີທີ່ພິມເຜີຍແຜ່
              </label>
              <select
                value={selectedYear ?? ''}
                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              >
                <option value="">ທຸກໆປີ</option>
                {/* Keep a year that came from the URL selectable even if it has no documents */}
                {(selectedYear && !years.includes(selectedYear) ? [selectedYear, ...years] : years).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      ປີ {yr}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </aside>

        {/* Right Main Grid */}
        <div ref={resultsRef} className="lg:col-span-3 space-y-6 scroll-mt-24">
          {!loading && totalItems > 0 && (
            <p className="text-xs text-[#737685]">
              ສະແດງ {rangeStart}–{rangeEnd} ຈາກ {totalItems} ລາຍການ
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: PAGE_SIZE }, (_, n) => (
                <div
                  key={n}
                  className="h-96 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-200 rounded-xl" />
                  <div className="space-y-3 mt-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="glass-panel text-center py-20 px-4 rounded-3xl bg-white border border-slate-200/70">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">search_off</span>
              </div>
              <h3 className="text-lg font-bold text-[#191c1d] mb-1">ບໍ່ພົບເອກະສານທີ່ກົງກັບເງື່ອນໄຂ</h3>
              <p className="text-xs text-[#737685] max-w-sm mx-auto mb-6">
                ກະລຸນາລອງປັບປ່ຽນຄຳຄົ້ນຫາ ຫຼື ເລືອກຄະນະ ແລະ ໝວດໝູ່ໃໝ່.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-[#003d9b] text-white text-xs font-semibold shadow-md"
              >
                ລ້າງຕົວກັ່ນຕອງທັງໝົດ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, idx) => (
                <DocumentCard key={doc.id} document={doc} staggerClass={`stagger-${(idx % 5) + 1}`} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}

// useSearchParams (via useFilterUrlSync) needs a Suspense boundary for prerendering
export default function DocumentsCatalogPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsCatalog />
    </Suspense>
  );
}
