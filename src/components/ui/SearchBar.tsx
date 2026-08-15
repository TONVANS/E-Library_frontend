'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFilterStore } from '@/store/filterStore';

interface SearchBarProps {
  redirectOnSubmit?: boolean;
  placeholder?: string;
}

export function SearchBar({
  redirectOnSubmit = false,
  placeholder = 'ຄົ້ນຫາເອກະສານ, ຊື່ຜູ້ຂຽນ, ຫົວຂໍ້ບົດຄົ້ນຄວ້າ, ຫຼື ຄຳສັບຫຼັກ...',
}: SearchBarProps) {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (redirectOnSubmit) {
      router.push('/documents');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative group">
      <div className="glass-panel rounded-full p-2 flex items-center shadow-lg transition-all duration-300 group-hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#0052cc]/40 focus-within:bg-white bg-white/30 border border-white/60">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:outline-none text-sm md:text-base text-[#191c1d] placeholder-slate-400 px-6 py-2"
        />
        {localQuery && (
          <button
            type="button"
            onClick={() => {
              setLocalQuery('');
              setSearchQuery('');
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full mr-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
        <button
          type="submit"
          className="bg-[#cba72f] hover:bg-[#b59325] text-[#4e3d00] p-3 rounded-full transition-all flex items-center justify-center shrink-0 ml-1 shadow-md hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>
      </div>
    </form>
  );
}
