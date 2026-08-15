'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = [
    { label: 'ພາບລວມລະບົບ', href: '/admin', icon: 'dashboard', roles: ['ADMIN'] },
    { label: 'ຄຸ້ມຄອງເອກະສານ', href: '/admin/docs', icon: 'description', roles: ['ADMIN', 'TEACHER'] },
    { label: 'ລາຍຊື່ຜູ້ໃຊ້ງານ', href: '/admin/users', icon: 'group', roles: ['ADMIN'] },
    { label: 'ຄະນະ ແລະ ພາກວິຊາ', href: '/admin/faculties', icon: 'account_tree', roles: ['ADMIN'] },
    { label: 'ໝວດໝູ່ເອກະສານ', href: '/admin/categories', icon: 'category', roles: ['ADMIN'] },
    { label: 'ລາຍງານ ແລະ ປະຫວັດ', href: '/admin/reports', icon: 'analytics', roles: ['ADMIN'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="px-4 py-3 mb-4 rounded-xl bg-blue-50/70 border border-blue-100">
          <p className="text-xs font-bold text-[#003d9b] uppercase tracking-wider">
            {user?.role === 'ADMIN' ? 'ລະບົບຜູ້ດູແລສູນກາງ' : 'ລະບົບຈັດການອາຈານປະຈຳຄະນະ'}
          </p>
          <p className="text-[11px] text-[#434654] truncate">
            {user?.faculty?.name || 'ມະຫາວິທະຍາໄລແຫ່ງຊາດ'}
          </p>
        </div>

        <nav className="space-y-1">
          {links
            .filter((l) => user && l.roles.includes(user.role))
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white shadow-md shadow-[#003d9b]/15'
                      : 'text-[#434654] hover:bg-slate-50 hover:text-[#003d9b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 px-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#737685] hover:text-[#003d9b] transition-colors py-2 px-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          ກັບຄືນສູ່ໜ້າຫຼັກຫໍສະໝຸດ
        </Link>
      </div>
    </aside>
  );
}
