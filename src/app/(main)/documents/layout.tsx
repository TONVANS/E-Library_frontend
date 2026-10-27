import type { Metadata } from 'next';
import { SITE_SHORT_NAME } from '@/lib/seo';

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  // Re-declare the template: a segment's title only picks up the closest parent's template,
  // so without it /documents/[id] titles would lose the site suffix
  title: { default: 'ເອກະສານທັງໝົດ', template: `%s | ${SITE_SHORT_NAME}` },
  description:
    'ຄົ້ນຫາບົດຄົ້ນຄວ້າ, ວິທະຍານິພົນ, ວາລະສານ ແລະ ເອກະສານວິຊາການ ຂອງມະຫາວິທະຍາໄລແຫ່ງຊາດ ຕາມຄະນະ ແລະ ໝວດໝູ່.',
  alternates: { canonical: '/documents' },
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
