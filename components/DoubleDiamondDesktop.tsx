"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Search, Target, Lightbulb, Rocket, GraduationCap, Handshake } from "lucide-react";

function SlideIn({ children, direction }: { children: ReactNode; direction: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = direction === "right" ? "translate-x-12" : "-translate-x-12";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0" : `opacity-0 ${translate}`}`}
    >
      {children}
    </div>
  );
}

export default function DoubleDiamondDesktop() {
  const t = useTranslations("DoubleDiamond");
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<number[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const nodes = container.querySelectorAll("[data-node]");
      const containerRect = container.getBoundingClientRect();
      const positions: number[] = [];
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        positions.push(rect.top - containerRect.top + rect.height / 2);
      });
      setNodePositions(positions);
      setContainerHeight(containerRect.height);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function buildSquigglePath(): string {
    if (nodePositions.length < 2) return "";
    const cx = 50;
    const amp = 14;
    const first = nodePositions[0];
    const last = nodePositions[nodePositions.length - 1];
    const h = last - first;
    const y1 = first + h / 3;
    const y2 = first + (h * 2) / 3;
    return [
      `M ${cx} ${first}`,
      `C ${cx + amp * 2} ${first + h / 6}, ${cx + amp * 2} ${y1 - h / 12}, ${cx} ${y1}`,
      `C ${cx - amp * 2.5} ${y1 + h / 12}, ${cx - amp * 2.5} ${y2 - h / 12}, ${cx} ${y2}`,
      `C ${cx + amp} ${y2 + h / 12}, ${cx + amp} ${last - h / 6}, ${cx} ${last}`,
    ].join(" ");
  }

  return (
    <div className="rounded-3xl bg-white p-10 lg:p-14">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-bold text-primary tracking-widest uppercase mb-2">
          {t("label")}
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
          {t("title")}
        </h2>
        <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Phase flow */}
      <div className="relative max-w-2xl mx-auto" ref={containerRef}>

        {/* Squiggly line */}
        {nodePositions.length > 1 && (
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            viewBox={`0 0 100 ${containerHeight}`}
            preserveAspectRatio="none"
            fill="none"
            style={{ height: containerHeight }}
          >
            <path
              d={buildSquigglePath()}
              stroke="#6b9e9e"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}

        <div className="flex flex-col items-center gap-0">

          {/* Problem Space label */}
          <div className="relative z-10 mb-16" data-node>
            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40 mx-auto flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary/60" />
            </div>
            <p className="mt-3 text-sm font-bold text-primary/60 tracking-widest uppercase text-center">{t("problemSpace")}</p>
          </div>

          {/* Discover — LEFT */}
          <div className="relative z-10 mb-20 w-full flex items-start gap-8" data-node>
            <SlideIn direction="left">
              <div className="text-right pr-4">
                <h3 className="text-lg font-bold text-foreground">{t("discover.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("discover.description")}</p>
              </div>
            </SlideIn>
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Search size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-[60px]" />
          </div>

          {/* Define — RIGHT */}
          <div className="relative z-10 mb-20 w-full flex items-start gap-8" data-node>
            <div className="flex-1 min-w-[60px]" />
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Target size={24} className="text-primary" />
            </div>
            <SlideIn direction="right">
              <div className="text-left pl-4">
                <h3 className="text-lg font-bold text-foreground">{t("define.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("define.description")}</p>
              </div>
            </SlideIn>
          </div>

          {/* Midpoint - Solution Space */}
          <div className="relative z-10 mb-16" data-node>
            <div className="w-14 h-14 rounded-full bg-primary border-2 border-primary/30 mx-auto flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white" />
            </div>
            <p className="mt-3 text-sm font-bold text-primary tracking-widest uppercase text-center">{t("solutionSpace")}</p>
          </div>

          {/* Develop — LEFT */}
          <div className="relative z-10 mb-20 w-full flex items-start gap-8" data-node>
            <SlideIn direction="left">
              <div className="text-right pr-4">
                <h3 className="text-lg font-bold text-foreground">{t("develop.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("develop.description")}</p>
              </div>
            </SlideIn>
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Lightbulb size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-[60px]" />
          </div>

          {/* Deliver — RIGHT */}
          <div className="relative z-10 w-full flex items-start gap-8" data-node>
            <div className="flex-1 min-w-[60px]" />
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
              <Rocket size={24} className="text-primary" />
            </div>
            <SlideIn direction="right">
              <div className="text-left pl-4">
                <h3 className="text-lg font-bold text-foreground">{t("deliver.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("deliver.description")}</p>
              </div>
            </SlideIn>
          </div>

        </div>
      </div>

      {/* Services */}
      <SlideIn direction="right">
        <div className="mt-12 grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-white p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <h4 className="text-base font-bold text-foreground">{t("develop.training")}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("develop.trainingDesc")}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Handshake size={20} className="text-primary" />
              </div>
              <h4 className="text-base font-bold text-foreground">{t("develop.coaching")}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("develop.coachingDesc")}</p>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
