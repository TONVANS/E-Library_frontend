'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Document } from '@/types';
import api from '@/lib/axios';
import { PdfPreviewModal } from '@/components/ui/PdfPreviewModal';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { isAuthenticated } = useAuthStore();

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocument() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເອກະສານໄດ້');
      } finally {
        setLoading(false);
      }
    }
    loadDocument();
  }, [id]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://training-api.edl.com.la/elibrary';

  const getFullUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${apiBase}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  const handlePreview = () => {
    if (!doc || !doc.fileUrl) return;
    const url = getFullUrl(doc.fileUrl);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleDownload = async () => {
    if (!doc) return;
    setDownloading(true);
    try {
      window.open(`${apiBase}/documents/${doc.id}/download`, '_blank');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນເອກະສານວິຊາການ...</p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center glass-panel rounded-3xl bg-white p-8">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h2 className="text-xl font-bold text-[#191c1d] mb-2">ຈຳກັດສິດການເຂົ້າເຖິງ ຫຼື ບໍ່ພົບເອກະສານ</h2>
        <p className="text-xs text-[#737685] mb-6">{error || 'ບໍ່ສາມາດດຶງຂໍ້ມູນເອກະສານນີ້ໄດ້'}</p>
        <Link
          href="/documents"
          className="px-6 py-2.5 rounded-full bg-[#003d9b] text-white text-xs font-semibold shadow-md"
        >
          ກັບຄືນສູ່ຄັງເອກະສານ
        </Link>
      </div>
    );
  }

  const coverSrc = doc.coverUrl
    ? getFullUrl(doc.coverUrl)
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 fade-in-up">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#737685] mb-6">
        <Link href="/" className="hover:text-[#003d9b]">
          ໜ້າຫຼັກ
        </Link>
        <span>/</span>
        <Link href="/documents" className="hover:text-[#003d9b]">
          ເອກະສານ
        </Link>
        <span>/</span>
        <span className="text-[#191c1d] font-semibold truncate max-w-xs">{doc.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {doc.category && (
                <span className="bg-[#cba72f]/20 text-[#735c00] text-xs font-bold px-3 py-1 rounded-full">
                  {doc.category.name}
                </span>
              )}
              {doc.status === 'AVAILABLE' ? (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                  ເອກະສານທາງການ ມຊ
                </span>
              ) : (
                <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                  ຈຳກັດການເຂົ້າເຖິງ
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#003d9b] tracking-tight mb-4 leading-snug">
              {doc.title}
            </h1>

            {/* Author and Faculty metadata */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#434654] pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-400">person</span>
                <span className="font-semibold text-[#191c1d]">{doc.author}</span>
              </div>
              {doc.faculty && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-slate-400">domain</span>
                  <span>{doc.faculty.name}</span>
                </div>
              )}
              {doc.department && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-slate-400">
                    account_tree
                  </span>
                  <span>{doc.department.name}</span>
                </div>
              )}
              {doc.publishedYear && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-slate-400">
                    calendar_month
                  </span>
                  <span>ປີພິມ: {doc.publishedYear}</span>
                </div>
              )}
            </div>

            {/* Abstract */}
            <div className="pt-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#003d9b]">
                ບົດຄັດຫຍໍ້ ແລະ ສະຫຼຸບການຄົ້ນຄວ້າ (Abstract)
              </h2>
              <p className="text-sm text-[#191c1d] leading-relaxed opacity-90 whitespace-pre-line">
                {doc.abstract || 'ບໍ່ມີບົດຄັດຫຍໍ້ສະແດງໃນປັດຈຸບັນ.'}
              </p>
            </div>

            {/* Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737685] mb-2.5">
                  ຄຳສັບຫຼັກ / ໝວດໝູ່ວິຊາ (Keywords)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-slate-100 text-[#434654] text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Cover, Action Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col items-center text-center">
            <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 shadow-inner bg-slate-100 border border-slate-200">
              <img src={coverSrc} alt={doc.title} className="w-full h-full object-cover" />
            </div>

            <button
              onClick={handlePreview}
              className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#003d9b] text-[#003d9b] font-bold text-sm shadow-sm hover:bg-slate-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <span className="material-symbols-outlined text-xl">visibility</span>
              <span>ເບິ່ງເອກະສານ (Preview)</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-bold text-sm shadow-lg shadow-[#003d9b]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <span className="material-symbols-outlined text-xl text-[#ffe088]">download</span>
              <span>{downloading ? 'ກຳລັງດາວໂຫຼດ...' : 'ດາວໂຫຼດເອກະສານ (PDF)'}</span>
            </button>

            <p className="text-[11px] text-[#737685]">
              ເອກະສານ PDF ທາງການ • ສິດການເຂົ້າເຖິງສະຖາບັນ ມຊ
            </p>

            <div className="w-full pt-4 mt-4 border-t border-slate-100 flex justify-around text-center text-xs text-[#434654]">
              <div>
                <span className="block font-bold text-[#003d9b] text-base">
                  {doc._count?.userActivities || 1}
                </span>
                <span className="text-[10px] text-[#737685] uppercase tracking-wider">
                  ຈຳນວນການເຂົ້າເບິ່ງ
                </span>
              </div>
              <div className="border-l border-slate-200" />
              <div>
                <span className="block font-bold text-[#003d9b] text-base">
                  {doc.publishedYear || 2024}
                </span>
                <span className="text-[10px] text-[#737685] uppercase tracking-wider">
                  ປີທີ່ບັນທຶກ
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 text-xs text-[#003d9b] space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">verified</span>
              ແຈ້ງການກ່ຽວກັບລິຂະສິດທາງວິຊາການ
            </p>
            <p className="text-[#434654] leading-relaxed text-[11px]">
              ເອກະສານນີ້ຢູ່ພາຍໃຕ້ການຄຸ້ມຄອງລິຂະສິດທາງປັນຍາ ຂອງມະຫາວິທະຍາໄລແຫ່ງຊາດ. ກະລຸນາອ້າງອີງຕາມຫຼັກວິຊາການ (APA/IEEE Citation) ເມື່ອນຳໃຊ້ເນື້ອໃນໃນການຄົ້ນຄວ້າ.
            </p>
          </div>
        </div>
      </div>
      
      {/* Preview Modal */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={previewUrl}
        title={doc.title}
      />
    </div>
  );
}
