import type { Metadata } from 'next';
import type { Document } from '@/types';
import { getBackendUrl } from '@/lib/backend';
import { OG_IMAGE, SITE_SHORT_NAME } from '@/lib/seo';

// Fetched anonymously: the backend only logs a VIEW for signed-in users, so link previews don't inflate counts
async function getDocument(id: string): Promise<Document | null> {
  try {
    const res = await fetch(`${getBackendUrl()}/documents/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
      // A slow backend must not hold up the page
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as Document;
  } catch {
    return null;
  }
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: LayoutProps<'/documents/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const doc = await getDocument(id);
  // Unknown or hidden documents fall back to the site-wide poster
  if (!doc || doc.status !== 'AVAILABLE') {
    return { title: 'ເອກະສານວິຊາການ' };
  }

  const description = truncate(
    [doc.author, doc.faculty?.name, doc.publishedYear && `ປີ ${doc.publishedYear}`, doc.abstract]
      .filter(Boolean)
      .join(' · '),
    200,
  );
  // Uploaded covers are relative to metadataBase (which includes basePath), so they resolve through
  // the API proxy; seeded covers are already absolute URLs
  const coverUrl = doc.coverUrl?.startsWith('http')
    ? doc.coverUrl
    : doc.coverUrl && `/api/${doc.coverUrl.replace(/\\/g, '/').replace(/^\//, '')}`;
  const cover = coverUrl ? { url: coverUrl, alt: doc.title } : OG_IMAGE;

  return {
    title: doc.title,
    description,
    keywords: doc.tags,
    authors: [{ name: doc.author }],
    alternates: { canonical: `/documents/${doc.id}` },
    openGraph: {
      type: 'article',
      // A segment's openGraph replaces the root one entirely, so repeat the site-wide fields
      siteName: SITE_SHORT_NAME,
      locale: 'lo_LA',
      url: `/documents/${doc.id}`,
      title: doc.title,
      description,
      images: [cover],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description,
      images: [cover.url],
    },
  };
}

export default function DocumentLayout({ children }: LayoutProps<'/documents/[id]'>) {
  return children;
}
