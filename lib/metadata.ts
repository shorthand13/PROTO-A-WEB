import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proto-a.com";

export function generatePageMetadata({
  locale,
  title,
  description,
  path = "",
}: {
  locale: string;
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${baseUrl}/${locale}${path}`;
  const altLocale = locale === "ja" ? "en" : "ja";
  const altUrl = `${baseUrl}/${altLocale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: locale === "ja" ? url : altUrl,
        en: locale === "en" ? url : altUrl,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ProtoA",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      ],
    },
  };
}
