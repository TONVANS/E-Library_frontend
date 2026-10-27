'use client';

import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, ExternalLink, Download, Loader2 } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  title?: string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  fileUrl,
  title = 'ເບິ່ງເອກະສານ',
}: PdfPreviewModalProps) {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIframeLoading(true);
    }
  }, [isOpen, fileUrl]);

  if (!isOpen || !fileUrl) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay with blur */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal Container */}
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-6xl h-[92vh] max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 truncate pr-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003d9b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              </div>
              <DialogPrimitive.Title className="text-sm sm:text-base font-bold text-[#003d9b] truncate">
                {title}
              </DialogPrimitive.Title>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Open in new tab */}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#434654] hover:text-[#003d9b] hover:bg-blue-50 transition-colors"
                title="ເປີດໃນແທັບໃໝ່"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ເປີດແທັບໃໝ່</span>
              </a>

              {/* Download */}
              <a
                href={fileUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#003d9b] text-white hover:bg-[#0052cc] transition-colors shadow-sm"
                title="ດາວໂຫຼດ PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ດາວໂຫຼດ</span>
              </a>

              {/* Close Button */}
              <DialogPrimitive.Close
                onClick={onClose}
                className="p-1.5 ml-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">ປິດ</span>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div className="relative flex-grow w-full h-full bg-slate-100/80 overflow-hidden">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-10 gap-3">
                <Loader2 className="w-8 h-8 text-[#003d9b] animate-spin" />
                <p className="text-xs font-semibold text-[#737685]">
                  ກຳລັງໂຫຼດຕົວຢ່າງເອກະສານ PDF...
                </p>
              </div>
            )}
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title={title}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
