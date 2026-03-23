import type { Metadata } from "next";
import { M_PLUS_1p } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import DisclaimerPopup from "@/components/DisclaimerPopup";
import FeedbackWidget from "@/components/FeedbackWidget";
import SurveyCta from "@/components/SurveyCta";
import TopBanner from "@/components/TopBanner";
import "../globals.css";

const mPlus1p = M_PLUS_1p({
  variable: "--font-sans-jp",
  weight: ["400", "500", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | ProtoA",
    default: "ProtoA — 宮古島DXコンサルティング",
  },
  description:
    "宮古島の中小企業向けDXコンサルティング。地元に根ざした親しみやすいアプローチでデジタル化を支援します。",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${mPlus1p.variable} h-full bg-white antialiased`}
    >
      <head>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
      </head>
      <body
        className={`min-h-full flex flex-col bg-white text-foreground ${mPlus1p.className}`}
      >
        <ClerkProvider>
          <NextIntlClientProvider>
            <TopBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <DisclaimerPopup />
            <FeedbackWidget />
            <SurveyCta />
          </NextIntlClientProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
