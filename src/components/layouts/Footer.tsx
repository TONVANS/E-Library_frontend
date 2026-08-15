import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-12 mt-16 bg-[#ffffff] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#003d9b] text-white flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#003d9b]">ຫໍສະໝຸດດິຈິຕອນ ມະຫາວິທະຍາໄລແຫ່ງຊາດ</h3>
            <p className="text-xs text-[#434654]">
              National University of Laos E-Library System
            </p>
          </div>
        </div>

        <div className="text-xs text-[#737685] text-center md:text-left">
          © {new Date().getFullYear()} ມະຫາວິທະຍາໄລແຫ່ງຊາດ (ມຊ). ສະຫງວນລິຂະສິດທຸກປະການ.
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#434654]">
          <Link href="/documents" className="hover:text-[#003d9b] hover:underline transition-colors">
            ເອກະສານທັງໝົດ
          </Link>
          <Link href="/login" className="hover:text-[#003d9b] hover:underline transition-colors">
            ເຂົ້າສູ່ລະບົບສະຖາບັນ
          </Link>
          <Link href="/admin" className="hover:text-[#003d9b] hover:underline transition-colors">
            ລະບົບຄຸ້ມຄອງຫໍສະໝຸດ
          </Link>
        </div>
      </div>
    </footer>
  );
}
