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
// import FeedbackWidget from "@/components/FeedbackWidget";
// import SurveyCta from "@/components/SurveyCta";
import EventPopup from "@/components/EventPopup";
import EventBanner from "@/components/EventBanner";
import { getCMSNextEvent, getCMSBlogPosts } from "@/lib/microcms";
import "../globals.css";

const mPlus1p = M_PLUS_1p({
  variable: "--font-sans-jp",
  weight: ["400", "500", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://protoa.digital";

export const metadata: Metadata = {
  title: {
    template: "%s | ProtoA",
    default: "ProtoA — DXコンサルティング",
  },
  description:
    "中小企業向けDXコンサルティング。親しみやすいアプローチでデジタル化を支援します。",
  verification: {
    google: "G93VGR0JMn4E1WZSvu8-RsGGQWirXcxFk3uA5zj4TzY",
  },
  openGraph: {
    siteName: "ProtoA",
    type: "website",
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("ProtoA — DXコンサルティング")}&description=${encodeURIComponent("中小企業向けDXコンサルティング")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
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

  const nextEvent = await getCMSNextEvent();

  let hasNewBlog = false;
  try {
    const posts = await getCMSBlogPosts(locale);
    if (posts.length > 0) {
      const latestDate = new Date(posts[0].frontmatter.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      hasNewBlog = latestDate >= sevenDaysAgo;
    }
  } catch {
    // CMS unavailable
  }

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
          <NextIntlClientProvider>
            <Header newItems={hasNewBlog ? ["blog"] : []} />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* <FeedbackWidget /> — disabled: overlaps with blog share bar */}
            {/* <SurveyCta /> — disabled: no incentive for users currently */}
            <EventBanner event={nextEvent} />
            <EventPopup event={nextEvent} />
          </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
