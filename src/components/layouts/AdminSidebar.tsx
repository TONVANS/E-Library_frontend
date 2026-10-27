'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  FileText,
  Users,
  GitFork,
  Tags,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const links = [
    {
      label: 'ພາບລວມລະບົບ',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['ADMIN'],
      description: 'ສະຖິຕິ ແລະ ຂໍ້ມູນລວມ',
    },
    {
      label: 'ຄຸ້ມຄອງເອກະສານ',
      href: '/admin/docs',
      icon: FileText,
      roles: ['ADMIN', 'TEACHER'],
      description: 'ອັບໂຫຼດ ແລະ ຈັດການໄຟລ໌',
    },
    {
      label: 'ລາຍຊື່ຜູ້ໃຊ້ງານ',
      href: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
      description: 'ບັນຊີອາຈານ ແລະ ນັກສຶກສາ',
    },
    {
      label: 'ຄະນະ ແລະ ພາກວິຊາ',
      href: '/admin/faculties',
      icon: GitFork,
      roles: ['ADMIN'],
      description: 'ໂຄງສ້າງຫຼັກສູດ ມຊ',
    },
    {
      label: 'ໝວດໝູ່ເອກະສານ',
      href: '/admin/categories',
      icon: Tags,
      roles: ['ADMIN'],
      description: 'ປະເພດ ແລະ ແທັກ',
    },
    {
      label: 'ລາຍງານ ແລະ ປະຫວັດ',
      href: '/admin/reports',
      icon: BarChart3,
      roles: ['ADMIN'],
      description: 'Audit logs & ສະຖິຕິ',
    },
  ];

  const filteredLinks = links.filter((l) => user && l.roles.includes(user.role));

  const roleLabel =
    user?.role === 'ADMIN' ? 'ຜູ້ດູແລລະບົບສູນກາງ' : 'ອາຈານສັງກັດຄະນະ';

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* User Context Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-100/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#003d9b] text-white flex items-center justify-center shadow-sm">
              {user?.role === 'ADMIN' ? (
                <ShieldCheck className="w-4 h-4 text-[#ffe088]" />
              ) : (
                <GraduationCap className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-[#003d9b] uppercase tracking-wider truncate">
                {roleLabel}
              </p>
              <p className="text-[10px] text-[#434654] truncate">
                {user?.faculty?.name || 'ມະຫາວິທະຍາໄລແຫ່ງຊາດ (NUOL)'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {filteredLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white shadow-md shadow-[#003d9b]/20 font-bold'
                    : 'text-[#434654] hover:bg-slate-100/80 hover:text-[#003d9b]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#003d9b]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="truncate">{item.label}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-slate-200/80">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xs font-semibold text-[#737685] hover:text-[#003d9b] hover:bg-blue-50/60 transition-all py-2.5 px-3 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນສູ່ໜ້າຫຼັກຫໍສະໝຸດ</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Sub-Nav Header */}
      <div className="lg:hidden sticky top-[72px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#003d9b] uppercase tracking-wider">
            ລະບົບຄຸ້ມຄອງ Admin
          </span>
          <span className="text-[10px] bg-blue-50 text-[#003d9b] px-2 py-0.5 rounded-full font-bold">
            {roleLabel}
          </span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>ເມນູຈັດການ</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl p-5 flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-[#003d9b]">ເມນູລະບົບ Admin</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200/80 sticky top-[88px] h-[calc(100vh-88px)] p-4 shrink-0 overflow-y-auto">
        {navContent}
      </aside>
    </>
  );
}
