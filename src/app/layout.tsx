import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "ຫໍສະໝຸດດິຈິຕອນ ມຊ | NUOL E-Library",
  description: "ລະບົບຄັງເອກະສານວິຊາການ ແລະ ຫໍສະໝຸດດິຈິຕອນ ມະຫາວິທະຍາໄລແຫ່ງຊາດ",
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
      </body>
    </html>
  );
}
