import React from 'react';
import { TopNavBar } from '@/components/layouts/TopNavBar';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopNavBar />
      <div className="flex flex-grow pt-[75px] md:pt-[95px]">
        <AdminSidebar />
        <main className="flex-grow p-6 md:p-8 max-w-[1400px] overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
