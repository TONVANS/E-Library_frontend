'use client';

import React, { useState } from 'react';
import { PdfPreviewModal } from '@/components/ui/PdfPreviewModal';
import Link from 'next/link';
import { Document } from '@/types';
import { getFileUrl } from '@/lib/api-config';

interface DocumentCardProps {
  document: Document;
  staggerClass?: string;
}

export function DocumentCard({ document, staggerClass = '' }: DocumentCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const coverSrc = document.coverUrl
    ? getFileUrl(document.coverUrl)
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60';

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getFileUrl(document.fileUrl);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  return (
    <div
      className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#003d9b]/15 group flex flex-col fade-in-up ${staggerClass} border border-white/70 bg-white`}
    >
      {/* Cover Image Header */}
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={document.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category / Status Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {document.status === 'AVAILABLE' ? (
            <span className="bg-[#cba72f] text-[#4e3d00] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              ເປີດໃຫ້ບໍລິການ
            </span>
          ) : (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              ຈຳກັດການເຂົ້າເຖິງ
            </span>
          )}
        </div>

        {document.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#003d9b] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm max-w-[80%] truncate">
            {document.category.name}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="text-base font-bold text-[#003d9b] mb-2 line-clamp-2 leading-snug group-hover:text-[#0052cc] transition-colors">
          {document.title}
        </h3>

        <p className="text-xs text-[#434654] line-clamp-3 mb-4 flex-grow opacity-85 leading-relaxed">
          {document.abstract || 'ບໍ່ມີບົດຄັດຫຍໍ້ສະແດງໃນປັດຈຸບັນ.'}
        </p>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pt-3 border-t border-slate-100 text-[11px]">
          {document.faculty && (
            <span className="bg-blue-50 text-[#003d9b] px-2 py-0.5 rounded-full font-medium">
              {document.faculty.code || document.faculty.name}
            </span>
          )}
          {document.publishedYear && (
            <span className="bg-slate-100 text-[#434654] px-2 py-0.5 rounded-full font-medium">
              ປີ {document.publishedYear}
            </span>
          )}
          <span className="text-[#737685] ml-auto font-medium truncate max-w-[130px]" title={document.author}>
            {document.author}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePreviewClick}
            className="flex-1 py-2.5 px-2 rounded-xl border border-[#003d9b] text-[#003d9b] text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>ເບິ່ງຕົວຢ່າງ</span>
          </button>
          <Link
            href={`/documents/${document.id}`}
            className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 group/btn"
          >
            <span>ລາຍລະອຽດ</span>
            <span className="material-symbols-outlined text-sm text-[#ffe088] group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <PdfPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileUrl={previewUrl}
          title={document.title}
        />
      )}
    </div>
  );
}
