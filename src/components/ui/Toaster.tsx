'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useToastStore, type ToastType } from '@/store/toastStore';

const STYLES: Record<ToastType, { icon: string; accent: string; iconBg: string }> = {
  success: { icon: 'check_circle', accent: 'border-l-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  error: { icon: 'error', accent: 'border-l-red-500', iconBg: 'bg-red-50 text-red-600' },
  info: { icon: 'info', accent: 'border-l-[#003d9b]', iconBg: 'bg-blue-50 text-[#003d9b]' },
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="fixed z-[100] top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:top-6 flex flex-col gap-2.5 sm:w-96 pointer-events-none"
    >
      {toasts.map((t) => {
        const style = STYLES[t.type];
        return (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className={`toast-in pointer-events-auto flex items-start gap-3 p-3.5 pr-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-[#003d9b]/10 border border-slate-200/70 border-l-4 ${style.accent}`}
          >
            <span
              className={`material-symbols-outlined text-xl w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${style.iconBg}`}
            >
              {style.icon}
            </span>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-bold text-[#191c1d] leading-snug">{t.title}</p>
              {t.description && <p className="text-xs text-[#434654] mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="ປິດ"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
