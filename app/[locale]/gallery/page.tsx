import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import GalleryContent from "./GalleryContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Gallery" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: "宮古島の風景とビジネスの日常を写真でお届けします。",
    path: "/gallery",
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GalleryContent />;
}
