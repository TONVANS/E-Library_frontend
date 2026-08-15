'use client';

import React, { useEffect, useState } from 'react';
import { DocumentCard } from '@/components/cards/DocumentCard';
import { useFilterStore } from '@/store/filterStore';
import { Document, Faculty, Category } from '@/types';
import api from '@/lib/axios';

export default function DocumentsCatalogPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedFacultyId,
    setSelectedFacultyId,
    selectedYear,
    setSelectedYear,
    page,
    setPage,
    resetFilters,
  } = useFilterStore();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load Metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const [facRes, catRes] = await Promise.all([
          api.get('/faculties'),
          api.get('/categories'),
        ]);
        setFaculties(facRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  // Load Catalog
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 9,
          search: searchQuery || undefined,
          categoryId: selectedCategoryId || undefined,
          facultyId: selectedFacultyId || undefined,
          publishedYear: selectedYear || undefined,
        };

        const res = await api.get('/documents', { params });
        setDocuments(res.data.data);
        setTotalPages(res.data.meta.totalPages || 1);
        setTotalItems(res.data.meta.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [page, searchQuery, selectedCategoryId, selectedFacultyId, selectedYear]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ຄົ້ນຫາຫົວຂໍ້, ຊື່ຜູ້ຂຽນ..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs text-[#191c1d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
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
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                ລ້າງຄ່າ
              </button>
            </div>

            {/* Faculty Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#434654] mb-2">ສັງກັດຄະນະ</label>
              <select
                value={selectedFacultyId || ''}
                onChange={(e) =>
                  setSelectedFacultyId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              >
                <option value="">ທຸກຄະນະ (All Faculties)</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

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
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              >
                <option value="">ທຸກໆປີ</option>
                {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <option key={yr} value={yr}>
                    ປີ {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Right Main Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm"
              >
                ໜ້າກ່ອນໜ້າ
              </button>
              <span className="text-xs font-semibold text-[#434654] px-3">
                ໜ້າທີ {page} ຈາກທັງໝົດ {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm"
              >
                ໜ້າຖັດໄປ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
