import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Play, Clock, Lock } from "lucide-react";
import type { VideoMeta } from "@/lib/types";

const difficultyColors = {
  beginner: "bg-primary-light/20 text-primary",
  intermediate: "bg-cta/10 text-cta",
  advanced: "bg-accent-light/20 text-accent",
};

export default function VideoCard({
  video,
  isAuthenticated,
}: {
  video: VideoMeta;
  isAuthenticated: boolean;
}) {
  const t = useTranslations("Membership.videos");

  const difficultyLabel =
    video.frontmatter.difficulty === "beginner"
      ? t("beginner")
      : video.frontmatter.difficulty === "intermediate"
        ? t("intermediate")
        : t("advanced");

  if (!isAuthenticated && video.frontmatter.memberOnly) {
    return (
      <div className="relative rounded-2xl border border-border bg-background p-6 shadow-sm opacity-80">
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm z-10">
          <div className="text-center">
            <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("loginToWatch")}
            </Link>
          </div>
        </div>
        <VideoCardInner
          video={video}
          difficultyLabel={difficultyLabel}
          t={t}
        />
      </div>
    );
  }

  return (
    <Link
      href={`/membership/videos/${video.slug}`}
      className="group block rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <VideoCardInner video={video} difficultyLabel={difficultyLabel} t={t} />
    </Link>
  );
}

function VideoCardInner({
  video,
  difficultyLabel,
  t,
}: {
  video: VideoMeta;
  difficultyLabel: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-muted">
        <Play className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {video.frontmatter.category}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[video.frontmatter.difficulty]}`}
        >
          {difficultyLabel}
        </span>
      </div>
      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
        {video.frontmatter.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {video.frontmatter.description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>{video.frontmatter.duration}</span>
      </div>
    </>
  );
}
