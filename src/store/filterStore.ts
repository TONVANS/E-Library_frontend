import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  selectedCategoryId: number | null;
  selectedFacultyId: number | null;
  selectedDepartmentId: number | null;
  selectedYear: number | null;
  selectedTag: string | null;
  page: number;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: number | null) => void;
  setSelectedFacultyId: (id: number | null) => void;
  setSelectedDepartmentId: (id: number | null) => void;
  setSelectedYear: (year: number | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategoryId: null,
  selectedFacultyId: null,
  selectedDepartmentId: null,
  selectedYear: null,
  selectedTag: null,
  page: 1,

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId, page: 1 }),
  setSelectedFacultyId: (selectedFacultyId) => set({ selectedFacultyId, selectedDepartmentId: null, page: 1 }),
  setSelectedDepartmentId: (selectedDepartmentId) => set({ selectedDepartmentId, page: 1 }),
  setSelectedYear: (selectedYear) => set({ selectedYear, page: 1 }),
  setSelectedTag: (selectedTag) => set({ selectedTag, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategoryId: null,
      selectedFacultyId: null,
      selectedDepartmentId: null,
      selectedYear: null,
      selectedTag: null,
      page: 1,
    }),
}));
