"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getVideoThumbnail } from "@/lib/video-utils";
import type { VideoMeta } from "@/lib/types";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export default function MemberVideoGrid({ videos }: { videos: VideoMeta[] }) {
  const t = useTranslations("Membership.videos");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(videos.map((v) => v.frontmatter.category))).sort(),
    [videos]
  );

  const filtered = videos.filter(
    (v) =>
      (!category || v.frontmatter.category === category) &&
      (!difficulty || v.frontmatter.difficulty === difficulty)
  );

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">{t("filterCategory")}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 bg-white"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">{t("filterDifficulty")}</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 bg-white"
          >
            <option value="">{t("allCategories")}</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {t(d)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noVideos")}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((video) => {
            const thumbnail = getVideoThumbnail(video);
            return (
              <Link
                key={video.slug}
                href={`/membership/videos/${video.slug}`}
                className="group"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                  {thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={video.frontmatter.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-foreground line-clamp-2">
                  {video.frontmatter.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(video.frontmatter.difficulty)} · {video.frontmatter.duration}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
