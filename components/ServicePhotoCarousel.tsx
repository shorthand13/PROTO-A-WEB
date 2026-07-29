"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface ServicePhotoCarouselProps {
  photos: string[];
  alt?: string;
  quote?: string;
  quotePhotoIndex?: number;
}

export default function ServicePhotoCarousel({
  photos,
  alt = "",
  quote,
  quotePhotoIndex = 0,
}: ServicePhotoCarouselProps) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, photos.length]);

  return (
    <div className="relative w-full aspect-[4/3]">
      <div className="absolute inset-x-[-14%] -bottom-6 h-1/2 rounded-2xl bg-primary" />
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
        {photos.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <Image src={src} alt={alt} fill className="object-cover" />
          </div>
        ))}

        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {photos.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`Photo ${i + 1}`}
                className="transition-all duration-300"
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {quote && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[52%] rounded-lg bg-black px-1.5 py-1 shadow-lg transition-opacity duration-700 ease-in-out"
          style={{ opacity: active === quotePhotoIndex ? 1 : 0 }}
        >
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}
