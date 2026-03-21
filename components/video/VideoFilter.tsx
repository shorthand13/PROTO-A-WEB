"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { VideoMeta } from "@/lib/types";
import VideoCard from "./VideoCard";

export default function VideoFilter({
  videos,
  categories,
  isAuthenticated,
}: {
  videos: VideoMeta[];
  categories: string[];
  isAuthenticated: boolean;
}) {
  const t = useTranslations("Membership.videos");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const filtered = videos.filter((v) => {
    if (category && v.frontmatter.category !== category) return false;
    if (difficulty && v.frontmatter.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          <option value="">{t("filterDifficulty")}</option>
          <option value="beginner">{t("beginner")}</option>
          <option value="intermediate">{t("intermediate")}</option>
          <option value="advanced">{t("advanced")}</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <VideoCard
              key={video.slug}
              video={video}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          {t("noVideos")}
        </p>
      )}
    </div>
  );
}
