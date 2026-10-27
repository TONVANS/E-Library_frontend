import type { Metadata } from 'next';

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: 'ໂປຣໄຟລ໌ຂອງຂ້ອຍ',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
