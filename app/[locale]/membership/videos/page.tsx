import { currentUser } from "@clerk/nextjs/server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { getVideosForLocale, canViewVideo } from "@/lib/videos";
import MemberVideoGrid from "@/components/video/MemberVideoGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Membership.videos" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/membership/videos",
  });
}

export default async function MemberVideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  const videos = getVideosForLocale(locale).filter((v) => canViewVideo(v, email));

  const t = await getTranslations("Membership.videos");

  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-8">
          <MemberVideoGrid videos={videos} />
        </div>
      </div>
    </div>
  );
}
