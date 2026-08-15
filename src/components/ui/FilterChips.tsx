'use client';

import React from 'react';
import { useFilterStore } from '@/store/filterStore';
import { Category, Faculty } from '@/types';

interface FilterChipsProps {
  categories?: Category[];
  faculties?: Faculty[];
  years?: number[];
}

export function FilterChips({
  categories = [],
  faculties = [],
  years = [2025, 2024, 2023, 2022],
}: FilterChipsProps) {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedFacultyId,
    setSelectedFacultyId,
    selectedYear,
    setSelectedYear,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters =
    selectedCategoryId !== null ||
    selectedFacultyId !== null ||
    selectedYear !== null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/20">
      {/* Reset all pill if active */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-100/80 hover:bg-red-200 text-red-800 transition-all flex items-center gap-1 shadow-sm"
        >
          <span className="material-symbols-outlined text-xs">refresh</span>
          ລ້າງຕົວກັ່ນຕອງທັງໝົດ
        </button>
      )}

      {/* Faculties */}
      {faculties.map((f) => {
        const isSelected = selectedFacultyId === f.id;
        return (
          <button
            key={`fac-${f.id}`}
            onClick={() => setSelectedFacultyId(isSelected ? null : f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all gold-glow ${
              isSelected
                ? 'bg-[#cba72f] text-[#4e3d00] border-[#cba72f] shadow-md scale-105'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
          >
            {f.code || f.name}
          </button>
        );
      })}

      {/* Categories */}
      {categories.slice(0, 4).map((c) => {
        const isSelected = selectedCategoryId === c.id;
        return (
          <button
            key={`cat-${c.id}`}
            onClick={() => setSelectedCategoryId(isSelected ? null : c.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all gold-glow ${
              isSelected
                ? 'bg-[#cba72f] text-[#4e3d00] border-[#cba72f] shadow-md scale-105'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
          >
            {c.name}
          </button>
        );
      })}

      {/* Years */}
      {years.slice(0, 2).map((yr) => {
        const isSelected = selectedYear === yr;
        return (
          <button
            key={`yr-${yr}`}
            onClick={() => setSelectedYear(isSelected ? null : yr)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all gold-glow ${
              isSelected
                ? 'bg-[#cba72f] text-[#4e3d00] border-[#cba72f] shadow-md scale-105'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
          >
            ປີ {yr}
          </button>
        );
      })}
    </div>
  );
}
