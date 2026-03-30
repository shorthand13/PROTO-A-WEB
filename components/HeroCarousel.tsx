"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface HeroCarouselProps {
  problemLabel: string;
  problemTitle: string;
  problemSubtitle: string;
  solutionTitle: string;
  solutionSubtitle: string;
}

export default function HeroCarousel({
  problemLabel,
  problemTitle,
  problemSubtitle,
  solutionTitle,
  solutionSubtitle,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const total = 3;

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % total);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="rounded-2xl bg-white overflow-hidden relative">
      <div className="relative min-h-[340px]">
        {/* Slide 0: Problem */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-8 py-10 transition-all duration-700 ease-in-out"
          style={{
            opacity: active === 0 ? 1 : 0,
            transform: active === 0 ? "translateX(0)" : active > 0 ? "translateX(-24px)" : "translateX(24px)",
            pointerEvents: active === 0 ? "auto" : "none",
          }}
        >
          <p className="text-sm font-bold text-primary/60 tracking-widest uppercase mb-3">
            {problemLabel}
          </p>
          <h2 className="text-2xl font-bold text-foreground leading-snug whitespace-pre-line">
            {problemTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {problemSubtitle}
          </p>
        </div>

        {/* Slide 1: Solution */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-5 py-10 transition-all duration-700 ease-in-out"
          style={{
            opacity: active === 1 ? 1 : 0,
            transform: active === 1 ? "translateX(0)" : active > 1 ? "translateX(-24px)" : "translateX(24px)",
            pointerEvents: active === 1 ? "auto" : "none",
          }}
        >
          <div className="rounded-2xl bg-primary text-white p-8">
            <h3 className="text-[1.4rem] font-bold leading-snug whitespace-pre-line">
              {solutionTitle}
            </h3>
            <p className="mt-4 text-base text-white/80 leading-relaxed whitespace-pre-line">
              {solutionSubtitle}
            </p>
          </div>
        </div>

        {/* Slide 2: Logo mark */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700 ease-in-out"
          style={{
            opacity: active === 2 ? 1 : 0,
            transform: active === 2 ? "translateX(0)" : "translateX(24px)",
            pointerEvents: active === 2 ? "auto" : "none",
          }}
        >
          <Image
            src="/logo_mark.svg"
            alt="ProtoA"
            width={100}
            height={100}
            className="h-24 w-24 rounded-2xl shadow-sm"
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 pb-5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="transition-all duration-300"
            aria-label={`Slide ${i + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-primary/20"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Connector to next section */}
      <div className="flex flex-col items-center pb-0 -mb-5 relative z-10">
        <div className="w-px h-4 bg-primary/30" />
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </div>
    </div>
  );
}
