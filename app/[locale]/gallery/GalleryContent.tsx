"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

const photos = [
  { src: "/photos/67504.jpg", alt: "宮古島ハーリー サバニ" },
  { src: "/photos/67505.jpg", alt: "宮古島ハーリー 準備風景" },
  { src: "/photos/67506.jpg", alt: "宮古島ハーリー 出航" },
  { src: "/photos/67507.jpg", alt: "宮古島ハーリー レース" },
  { src: "/photos/67508.jpg", alt: "宮古島ハーリー レース" },
  { src: "/photos/67509.jpg", alt: "宮古島ハーリー 漕ぎ手" },
  { src: "/photos/67510.jpg", alt: "宮古島ハーリー 港" },
];

export default function GalleryContent() {
  const t = useTranslations("Gallery");
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {t("title")}
        </h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {photos.map((photo, i) => (
            <button
              key={i}
              className="mb-4 break-inside-avoid block w-full cursor-pointer"
              onClick={() => setSelected(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1000}
                className="w-full rounded-xl"
              />
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          {t("credit")}
        </p>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <Image
            src={photos[selected].src}
            alt={photos[selected].alt}
            width={1600}
            height={2000}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
