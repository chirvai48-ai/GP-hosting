import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans, Jost } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { TanStackProvider } from "./tanstack-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/footer/ConditionalFooter";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const SITE_URL = "https://glowing-partner.jp";
const SITE_DESCRIPTION =
  "株式会社Glowing Partnerは、留学生をはじめとする外国人材と企業をつなぐ人材紹介・人材派遣サービスです。求人紹介から就業後のサポートまで一貫して対応します。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "株式会社Glowing Partner",
    template: "%s | Glowing Partner",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Glowing Partner",
    title: "株式会社Glowing Partner",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: ["/GpLogoTransparent.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${cormorantGaramond.variable} ${workSans.variable} ${jost.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <TanStackProvider>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </TanStackProvider>
        <ConditionalFooter />
      </body>
    </html>
  );
}
