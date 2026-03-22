import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { getVideos, getVideoCategories } from "@/lib/videos";
import VideoFilter from "@/components/video/VideoFilter";

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { userId } = await auth();
  const videos = getVideos();
  const categories = getVideoCategories();

  return (
    <VideosContent
      videos={JSON.parse(JSON.stringify(videos))}
      categories={categories}
      isAuthenticated={!!userId}
    />
  );
}

function VideosContent({
  videos,
  categories,
  isAuthenticated,
}: {
  videos: ReturnType<typeof getVideos>;
  categories: string[];
  isAuthenticated: boolean;
}) {
  const t = useTranslations("Membership.videos");

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VideoFilter
            videos={videos}
            categories={categories}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </section>
    </div>
  );
}
