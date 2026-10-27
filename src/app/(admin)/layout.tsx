import React from 'react';
import { TopNavBar } from '@/components/layouts/TopNavBar';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ລະບົບຜູ້ດູແລ',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <TopNavBar />
      <div className="flex flex-col lg:flex-row flex-grow pt-[72px] md:pt-[88px] min-h-screen">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
