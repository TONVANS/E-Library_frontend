import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="w-full py-12 mt-16 bg-[#ffffff] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <div>
            <h3 className="text-base font-bold text-[#003d9b]">ຄະນະເສດຖະສາດ ແລະ ບໍລິຫານທຸລະກິດ</h3>
            <p className="text-xs text-[#434654]">
              Faculty of Economics and Business Management
            </p>
          </div>
        </div>

        <div className="text-xs text-[#737685] text-center md:text-left">
          © {new Date().getFullYear()} ຄະນະເສດຖະສາດ ແລະ ບໍລິຫານທຸລະກິດ ມະຫາວິທະຍາໄລແຫ່ງຊາດ. ສະຫງວນລິຂະສິດທຸກປະການ.
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
