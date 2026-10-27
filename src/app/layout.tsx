import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_URL } from "@/lib/seo";

const notoSansLao = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSansLao-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSansLao-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-lao",
  display: "swap",
  fallback: ["Lao UI", "Saysettha OT", "DokChampa", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_SHORT_NAME,
  keywords: [
    "ຫໍສະໝຸດດິຈິຕອນ",
    "ມະຫາວິທະຍາໄລແຫ່ງຊາດ",
    "ມຊ",
    "ບົດຄົ້ນຄວ້າ",
    "ວິທະຍານິພົນ",
    "NUOL",
    "National University of Laos",
    "E-Library",
    "Digital Library",
    "Laos research",
  ],
  icons: { icon: "/images/Logo.png", apple: "/images/Logo.png" },
  openGraph: {
    type: "website",
    locale: "lo_LA",
    siteName: SITE_SHORT_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="lo"
      className={`${notoSansLao.variable} ${notoSansLao.className} light`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${notoSansLao.className} min-h-screen flex flex-col antialiased bg-[#f8f9fa] text-[#191c1d]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
