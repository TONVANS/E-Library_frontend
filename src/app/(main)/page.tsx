'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChips } from '@/components/ui/FilterChips';
import { DocumentCard } from '@/components/cards/DocumentCard';
import { useAuthStore } from '@/store/authStore';
import { useFilterStore } from '@/store/filterStore';
import { Document, Faculty, Category } from '@/types';
import api from '@/lib/axios';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { searchQuery, selectedCategoryId, selectedFacultyId, selectedYear } = useFilterStore();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial faculties and categories
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
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch documents whenever filters change
  useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      try {
        const params: any = {
          limit: 6,
          search: searchQuery || undefined,
          categoryId: selectedCategoryId || undefined,
          facultyId: selectedFacultyId || undefined,
          publishedYear: selectedYear || undefined,
        };

        const res = await api.get('/documents', { params });
        setDocuments(res.data.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, [searchQuery, selectedCategoryId, selectedFacultyId, selectedYear]);

  return (
    <div className="w-full">
      {/* Hero Section with Academic Prestige Gradient */}
      <section className="w-full px-4 md:px-12 mb-12 fade-in-up">
        <div className="max-w-[1440px] mx-auto premium-gradient-bg rounded-3xl p-8 md:p-16 text-center text-white shadow-xl shadow-[#003d9b]/25 relative">
          
          {/* Section brand */}
          <div className="flex justify-center mb-6">
            <Logo
              priority
              className="w-28 h-28 md:w-36 md:h-36 shadow-2xl ring-4 ring-white/30 hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md leading-tight">
            ຄົ້ນຫາ ບົດວິທະຍານິພົນ <br></br> ຄະນະເສດຖະສາດ ແລະ ບໍລິຫານທຸລະກິດ
          </h1>

          <p className="text-base md:text-lg text-[#dae2ff] mb-8 max-w-2xl mx-auto opacity-95 leading-relaxed font-normal">
            ເຂົ້າເຖິງບົດຄົ້ນຄວ້າວິທະຍາສາດ, ບົດວິທະຍານິພົນປະລິນຍາຕີ-ໂທ-ເອກ ແລະ ວາລະສານວິຊາການ ຂອງຄູອາຈານ ແລະ ນັກສຶກສາ ຄສບ ຢ່າງສະດວກ ແລະ ປອດໄພ
          </p>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar redirectOnSubmit={false} />
          </div>

          {/* Filter Chips */}
          <FilterChips
            categories={categories}
            faculties={faculties}
            years={[2025, 2024, 2023, 2022]}
          />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 mb-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3a5f94]">
              {isAuthenticated && user?.faculty
                ? `ກັ່ນຕອງສະເພາະ: ${user.faculty.name}`
                : 'ເອກະສານວິຊາການແນະນຳ'}
            </span>
            <h2 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
              {isAuthenticated && user?.faculty
                ? `ເອກະສານຫຼ້າສຸດຈາກ ${user.faculty.code || user.faculty.name}`
                : 'ເອກະສານ ແລະ ບົດວິໄຈຫຼ້າສຸດທຸກຄະນະ'}
            </h2>
          </div>

          <Link
            href="/documents"
            className="text-xs font-bold text-[#0052cc] hover:text-[#003d9b] flex items-center gap-1 group transition-colors"
          >
            <span>ເບິ່ງຄັງເອກະສານທັງໝົດ</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse flex flex-col justify-between">
                <div className="h-44 bg-slate-200 rounded-xl" />
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="glass-panel text-center py-16 px-4 rounded-3xl bg-white border border-slate-200/70">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 className="text-lg font-bold text-[#191c1d] mb-1">ບໍ່ພົບເອກະສານທີ່ກົງກັບເງື່ອນໄຂ</h3>
            <p className="text-xs text-[#737685] max-w-md mx-auto mb-4">
              ບໍ່ພົບເອກະສານວິຊາການຕາມຄຳຄົ້ນຫາ ຫຼື ຕົວກັ່ນຕອງທີ່ທ່ານເລືອກ. ກະລຸນາປັບປ່ຽນຄຳຄົ້ນຫາໃໝ່.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc, idx) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                staggerClass={`stagger-${(idx % 5) + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
