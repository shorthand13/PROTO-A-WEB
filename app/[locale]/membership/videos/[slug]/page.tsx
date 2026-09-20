import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/metadata";
import { getVideo, getVideosForLocale, canViewVideo, getYouTubeEmbedUrl } from "@/lib/videos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const video = getVideo(slug);
  if (!video) return {};

  return generatePageMetadata({
    locale,
    title: video.frontmatter.title,
    description: video.frontmatter.description,
    path: `/membership/videos/${slug}`,
  });
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const video = getVideo(slug);
  if (!video) notFound();

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  // Middleware already requires sign-in for this route; this also excludes
  // videos privately assigned to a different client's email, and videos in
  // the other locale.
  if (video.frontmatter.locale !== locale || !canViewVideo(video, email)) {
    notFound();
  }

  const t = await getTranslations("Membership.videos");
  const related = getVideosForLocale(locale)
    .filter((v) => v.slug !== video.slug && v.frontmatter.category === video.frontmatter.category)
    .filter((v) => canViewVideo(v, email))
    .slice(0, 4);

  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            src={getYouTubeEmbedUrl(video.frontmatter.videoUrl)}
            title={video.frontmatter.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">{video.frontmatter.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {video.frontmatter.category} · {t(video.frontmatter.difficulty)} · {t("duration")}{" "}
          {video.frontmatter.duration}
        </p>
        <p className="mt-4 text-base text-foreground whitespace-pre-line">
          {video.frontmatter.description}
        </p>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-foreground">{t("relatedVideos")}</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((v) => (
                <Link
                  key={v.slug}
                  href={`/membership/videos/${v.slug}`}
                  className="text-sm font-medium text-foreground hover:text-primary line-clamp-2"
                >
                  {v.frontmatter.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
