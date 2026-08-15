'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function TopNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const navLinks = [
    { label: 'ໜ້າຫຼັກ', href: '/' },
    { label: 'ເອກະສານທັງໝົດ', href: '/documents' },
    ...(isAuthenticated && user?.faculty?.name
      ? [{ label: 'ຄະນະຂອງຂ້ອຍ', href: `/documents?facultyId=${user.facultyId}` }]
      : []),
    ...(user?.role === 'ADMIN' ? [{ label: 'ລະບົບຜູ້ດູແລ (Admin)', href: '/admin' }] : []),
    ...(user?.role === 'TEACHER' ? [{ label: 'ຈັດການເອກະສານອາຈານ', href: '/admin/docs' }] : []),
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  const roleLabelMap: Record<string, string> = {
    ADMIN: 'ຜູ້ດູແລລະບົບ',
    TEACHER: 'ອາຈານສອນ',
    STUDENT: 'ນັກສຶກສາ',
  };

  return (
    <>
      {/* Desktop Floating Glass Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] rounded-full bg-white/75 backdrop-blur-xl shadow-lg shadow-[#003d9b]/10 border border-white/60 z-50 justify-between items-center px-8 md:px-12 py-3 hidden md:flex transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#003d9b] to-[#0052cc] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#003d9b]">
            ຫໍສະໝຸດດິຈິຕອນ <span className="text-[#3a5f94] font-medium">ມຊ (NUOL)</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 pb-1 relative hover:text-[#003d9b] ${
                  isActive
                    ? 'text-[#003d9b] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#cba72f] after:rounded-full'
                    : 'text-[#434654]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-4 text-[#003d9b]">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 py-1.5 px-3 rounded-full hover:bg-white/50 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0052cc] to-[#3a5f94] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-[#191c1d] leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-[#737685] font-medium mt-0.5 uppercase tracking-wider">
                    {roleLabelMap[user.role] || user.role} • {user.userCode}
                  </p>
                </div>
                <span className="material-symbols-outlined text-sm text-[#737685]">
                  keyboard_arrow_down
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#191c1d]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-[#737685] truncate">{user.email || user.userCode}</p>
                    {user.faculty && (
                      <span className="inline-block mt-1 text-[10px] bg-blue-50 text-[#003d9b] px-2 py-0.5 rounded-full font-medium">
                        {user.faculty.code || user.faculty.name}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#434654] hover:bg-blue-50/50 hover:text-[#003d9b] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    ໂປຣໄຟລ໌ ແລະ ບັນຊີ
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#434654] hover:bg-blue-50/50 hover:text-[#003d9b] transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">dashboard</span>
                      ໜ້າກະດານຄວບຄຸມ (Dashboard)
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    ອອກຈາກລະບົບ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              ເຂົ້າສູ່ລະບົບ
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-slate-200/50 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#003d9b] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <span className="text-lg font-bold text-[#003d9b]">ຫໍສະໝຸດດິຈິຕອນ ມຊ</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#003d9b] rounded-lg hover:bg-blue-50"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-xl z-40 p-6 flex flex-col justify-between animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-[#191c1d] hover:text-[#003d9b] py-2 border-b border-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003d9b] text-white flex items-center justify-center font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#737685]">
                      {user.userCode} • {roleLabelMap[user.role] || user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold text-center mt-2"
                >
                  ອອກຈາກລະບົບ
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center rounded-xl bg-[#003d9b] text-white font-semibold text-sm shadow-md"
              >
                ເຂົ້າສູ່ລະບົບ
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
