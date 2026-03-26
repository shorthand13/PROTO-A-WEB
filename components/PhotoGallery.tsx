"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const photos = [
  { src: "/gallery/20250814_140607-2.jpg", caption: "セミナー風景" },
  { src: "/gallery/20250814_140614-2.jpg", caption: "セミナー風景" },
  { src: "/gallery/20250731_140755_Original.JPG", caption: "活動の様子" },
  { src: "/gallery/20250731_141131_Original.JPG", caption: "活動の様子" },
  { src: "/gallery/1000013399.jpg", caption: "活動の様子" },
  { src: "/gallery/1000014626.jpg", caption: "活動の様子" },
  { src: "/gallery/1000014627.jpg", caption: "活動の様子" },
  { src: "/gallery/IMG_4955 2-2.jpg", caption: "活動の様子" },
  { src: "/gallery/IMG_6919-2.jpg", caption: "活動の様子" },
  { src: "/gallery/加工済IMG_2457.jpg", caption: "活動の様子" },
  { src: "/gallery/多良川講座.jpg", caption: "多良川講座" },
  { src: "/gallery/宮古特別支援学校.jpg", caption: "宮古特別支援学校" },
  { src: "/gallery/宮古特別支援学校2.jpg", caption: "宮古特別支援学校" },
  { src: "/gallery/業務整理ws.jpg", caption: "業務整理ワークショップ" },
];

function chunkPhotos(arr: typeof photos, size: number) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function MobileGallery() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
      {photos.map((photo, i) => (
        <div key={i} className="flex-shrink-0 w-64 snap-start">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.caption}
              width={500}
              height={375}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopGallery() {
  const groups = chunkPhotos(photos, 5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - el.scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {groups.map((group, gi) => (
          <div key={gi} className="flex-shrink-0 w-[800px] lg:w-[960px] snap-start">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
                <Image
                  src={group[0].src}
                  alt={group[0].caption}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              {group.slice(1).map((photo, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={500}
                    height={375}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Clickable dot indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {groups.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
            }`}
            aria-label={`Go to group ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  return (
    <>
      <div className="sm:hidden">
        <MobileGallery />
      </div>
      <div className="hidden sm:block">
        <DesktopGallery />
      </div>
    </>
  );
}
