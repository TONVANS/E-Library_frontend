'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useFilterStore } from '@/store/filterStore';
import { Category, Document, Faculty, User } from '@/types';

// Mirrors the backend rule: non-admins who belong to a faculty only ever see that faculty
export function isFacultyLocked(user: User | null | undefined): boolean {
  return !!user && user.role !== 'ADMIN' && !!user.facultyId;
}

export function useCatalogMeta() {
  const userId = useAuthStore((s) => s.user?.id);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const [facRes, catRes, yearRes] = await Promise.all([
          api.get('/faculties'),
          api.get('/categories'),
          api.get('/documents/years'),
        ]);
        if (cancelled) return;
        setFaculties(facRes.data);
        setCategories(catRes.data);
        setYears(yearRes.data);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { faculties, categories, years };
}

// Fetches one page of /documents for the current filters in useFilterStore
export function useDocumentCatalog(limit: number) {
  const {
    searchQuery,
    selectedCategoryId,
    selectedFacultyId,
    selectedDepartmentId,
    selectedYear,
    selectedTag,
    page,
    setPage,
  } = useFilterStore();
  const userId = useAuthStore((s) => s.user?.id);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDocuments() {
      setLoading(true);
      try {
        const res = await api.get('/documents', {
          signal: controller.signal,
          params: {
            page,
            limit,
            search: searchQuery.trim() || undefined,
            categoryId: selectedCategoryId ?? undefined,
            facultyId: selectedFacultyId ?? undefined,
            departmentId: selectedDepartmentId ?? undefined,
            publishedYear: selectedYear ?? undefined,
            tag: selectedTag ?? undefined,
          },
        });
        const { data, meta } = res.data;
        // The page can fall outside the result set (e.g. stale URL); jump to the last real page
        if (meta.totalPages > 0 && page > meta.totalPages) {
          setPage(meta.totalPages);
          return;
        }
        setDocuments(data);
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.total || 0);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Error fetching documents:', err);
        setDocuments([]);
        setTotalPages(1);
        setTotalItems(0);
        setLoading(false);
      }
    }

    fetchDocuments();
    return () => controller.abort();
  }, [
    limit,
    page,
    searchQuery,
    selectedCategoryId,
    selectedFacultyId,
    selectedDepartmentId,
    selectedYear,
    selectedTag,
    userId,
    setPage,
  ]);

  return { documents, totalPages, totalItems, loading, page, setPage };
}
