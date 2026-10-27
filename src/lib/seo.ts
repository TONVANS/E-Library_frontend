import { BASE_PATH } from './api-config';

// Public origin of the site, e.g. https://elibrary.example.la (no trailing slash, no basePath).
// Link previews (Facebook, LINE, WhatsApp, Messenger) need absolute URLs, so this must be the real domain.
// Pages are prerendered, so set SITE_URL at build time.
const SITE_ORIGIN = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

// metadataBase includes basePath, so relative metadata URLs like '/images/og-image.jpg'
// resolve to https://<domain>/elibrary/images/og-image.jpg
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const SITE_NAME = 'ຫໍສະໝຸດດິຈິຕອນ ມຊ | NUOL E-Library';
export const SITE_SHORT_NAME = 'NUOL E-Library';
export const SITE_DESCRIPTION =
  'ຄັງເອກະສານວິຊາການ, ບົດຄົ້ນຄວ້າ ແລະ ວິທະຍານິພົນ ຂອງມະຫາວິທະຍາໄລແຫ່ງຊາດ — ຄົ້ນຫາ, ອ່ານ ແລະ ດາວໂຫຼດ ໄດ້ທຸກທີ່ ທຸກເວລາ. National University of Laos digital library of research papers, theses and academic documents.';

// Poster shown in link previews. Source: ../og-poster/og.html (render at 1200x630, 2x, then downscale)
export const OG_IMAGE = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'ຫໍສະໝຸດດິຈິຕອນ ມຊ — NUOL E-Library System',
};
