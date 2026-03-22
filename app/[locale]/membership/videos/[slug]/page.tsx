import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { auth } from "@clerk/nextjs/server";
import { getVideo, getVideos } from "@/lib/videos";
import VideoPlayer from "@/components/video/VideoPlayer";
import { Clock } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return {};

  return {
    title: video.frontmatter.title,
    description: video.frontmatter.description,
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const { userId } = await auth();
  const video = getVideo(slug);

  if (!video) notFound();

  if (video.frontmatter.memberOnly && !userId) {
    redirect(`/${locale}/login`);
  }

  return <VideoDetailContent video={video} />;
}

function VideoDetailContent({
  video,
}: {
  video: NonNullable<ReturnType<typeof getVideo>>;
}) {
  const t = useTranslations("Membership.videos");

  const difficultyLabel =
    video.frontmatter.difficulty === "beginner"
      ? t("beginner")
      : video.frontmatter.difficulty === "intermediate"
        ? t("intermediate")
        : t("advanced");

  return (
    <div>
      <section className="py-8 px-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Video Player */}
          <VideoPlayer url={video.frontmatter.videoUrl} />

          {/* Video Info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                {video.frontmatter.category}
              </span>
              <span className="rounded-full bg-primary-light/20 px-3 py-0.5 text-xs font-medium text-primary">
                {difficultyLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} />
                {video.frontmatter.duration}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {video.frontmatter.title}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {video.frontmatter.description}
            </p>
            {video.content && (
              <div className="mt-6 prose prose-lg max-w-none prose-p:text-muted-foreground">
                <p>{video.content}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
