"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { getVideoThumbnail, getYouTubeEmbedUrl } from "@/lib/video-utils";
import type { VideoMeta } from "@/lib/types";

export default function PublicVideoGallery({ videos }: { videos: VideoMeta[] }) {
  const t = useTranslations("Home");
  const [selected, setSelected] = useState<VideoMeta | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
        {videos.map((video) => {
          const thumbnail = getVideoThumbnail(video);
          return (
            <button
              key={video.slug}
              onClick={() => setSelected(video)}
              className="group relative flex-shrink-0 w-80 sm:w-full text-left"
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow group-hover:shadow-lg">
                {thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt={video.frontmatter.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-110">
                    <Play size={28} className="ml-1 text-primary" fill="currentColor" />
                  </span>
                </div>
              </div>
              <p className="mt-3 text-base font-medium text-foreground line-clamp-2">
                {video.frontmatter.title}
              </p>
              {video.frontmatter.duration && (
                <p className="text-sm text-muted-foreground">{video.frontmatter.duration}</p>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelected(null)}
            aria-label={t("videoGallery.close")}
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="aspect-video w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getYouTubeEmbedUrl(selected.frontmatter.videoUrl)}
              title={selected.frontmatter.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
