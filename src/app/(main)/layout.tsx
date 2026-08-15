import React from 'react';
import { TopNavBar } from '@/components/layouts/TopNavBar';
import { Footer } from '@/components/layouts/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <TopNavBar />
      <main className="flex-grow pt-[85px] md:pt-[105px]">{children}</main>
      <Footer />
    </div>
  );
}
