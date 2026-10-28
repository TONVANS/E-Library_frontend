'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FilterValues, useFilterStore } from '@/store/filterStore';

function toId(value: string | null): number | null {
  const n = Number(value);
  return value && Number.isInteger(n) && n > 0 ? n : null;
}

function filtersFromParams(params: URLSearchParams): FilterValues {
  return {
    searchQuery: params.get('search') ?? '',
    selectedCategoryId: toId(params.get('categoryId')),
    selectedFacultyId: toId(params.get('facultyId')),
    selectedDepartmentId: toId(params.get('departmentId')),
    selectedYear: toId(params.get('year')),
    selectedTag: params.get('tag') || null,
    page: toId(params.get('page')) ?? 1,
  };
}

function filtersToQuery(f: FilterValues): string {
  const params = new URLSearchParams();
  if (f.searchQuery.trim()) params.set('search', f.searchQuery.trim());
  if (f.selectedFacultyId) params.set('facultyId', String(f.selectedFacultyId));
  if (f.selectedDepartmentId) params.set('departmentId', String(f.selectedDepartmentId));
  if (f.selectedCategoryId) params.set('categoryId', String(f.selectedCategoryId));
  if (f.selectedYear) params.set('year', String(f.selectedYear));
  if (f.selectedTag) params.set('tag', f.selectedTag);
  if (f.page > 1) params.set('page', String(f.page));
  return params.toString();
}

// Two-way sync between useFilterStore and the URL query string, so filtered/paged
// catalog views can be linked (e.g. /documents?facultyId=2&page=3) and survive reloads.
// Requires a <Suspense> boundary above the caller (useSearchParams).
export function useFilterUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    searchQuery,
    selectedCategoryId,
    selectedFacultyId,
    selectedDepartmentId,
    selectedYear,
    selectedTag,
    page,
    setFilters,
  } = useFilterStore();

  const [ready, setReady] = useState(false);
  // Query strings we pushed ourselves, so their echo through useSearchParams is ignored
  const ownWrites = useRef(new Set<string>());
  const currentQuery = useRef(searchParams.toString());

  // URL -> store
  useEffect(() => {
    const query = searchParams.toString();
    currentQuery.current = query;
    if (ownWrites.current.delete(query)) return;
    // Landing without params keeps filters chosen elsewhere (e.g. on the home page)
    if (ready || query) {
      setFilters(filtersFromParams(new URLSearchParams(query)));
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Store -> URL
  useEffect(() => {
    if (!ready) return;
    const query = filtersToQuery({
      searchQuery,
      selectedCategoryId,
      selectedFacultyId,
      selectedDepartmentId,
      selectedYear,
      selectedTag,
      page,
    });
    if (query === currentQuery.current) return;
    ownWrites.current.add(query);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [
    ready,
    searchQuery,
    selectedCategoryId,
    selectedFacultyId,
    selectedDepartmentId,
    selectedYear,
    selectedTag,
    page,
    pathname,
    router,
  ]);
}
