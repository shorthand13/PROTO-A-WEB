"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Search, Target, Lightbulb, Rocket, GraduationCap, Handshake, Flag, MapPin } from "lucide-react";

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

  const translate = direction === "right" ? "translate-x-8" : "-translate-x-8";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0" : `opacity-0 ${translate}`}`}
    >
      {children}
    </div>
  );
}

interface ServiceDetail {
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export default function DoubleDiamond({ services }: { services?: [ServiceDetail, ServiceDetail] }) {
  const t = useTranslations("DoubleDiamond");
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<number[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [activeService, setActiveService] = useState<number | null>(null);

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
    <div className="rounded-2xl bg-white p-6 pt-6 overflow-hidden">
      {/* Phase flow */}
      <div className="mt-8 relative" ref={containerRef}>

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

          {/* Starting point */}
          <div className="relative z-10 -mt-11 mb-6 flex justify-center" data-node>
            <MapPin size={38} className="text-primary" />
          </div>

          {/* Discover — LEFT */}
          <div className="relative z-10 mb-8 w-full flex items-center gap-5" data-node>
            <SlideIn direction="left">
              <div className="text-right pr-3">
                <h3 className="text-base font-bold text-foreground flex items-center justify-end gap-1.5"><Search size={28} className="text-primary" />{t("discover.title")}<span className="text-2xl text-[#5a8a8a] underline decoration-[5px] decoration-[#6b9e9e]/30 underline-offset-1">{t("discover.titleEmphasis")}</span></h3>
              </div>
            </SlideIn>
            <div className="flex-shrink-0 w-0 h-0" />
            <div className="flex-1 min-w-[40px]" />
          </div>

          {/* Define — RIGHT */}
          <div className="relative z-10 mb-8 w-full flex items-center gap-5" data-node>
            <div className="flex-1 min-w-[40px]" />
            <div className="flex-shrink-0 w-0 h-0" />
            <SlideIn direction="right">
              <div className="text-left pl-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-1.5"><Target size={28} className="text-primary" />{t("define.title")}<span className="text-2xl text-[#5a8a8a] underline decoration-[5px] decoration-[#6b9e9e]/30 underline-offset-1">{t("define.titleEmphasis")}</span></h3>
              </div>
            </SlideIn>
          </div>

          {/* Midpoint */}
          <div className="relative z-10 mb-6" data-node>
            <div className="w-0 h-0 mx-auto" />
          </div>

          {/* Develop — LEFT */}
          <div className="relative z-10 mb-8 w-full flex items-center gap-5" data-node>
            <SlideIn direction="left">
              <div className="text-right pr-3">
                <h3 className="text-base font-bold text-foreground flex items-center justify-end gap-1.5"><Lightbulb size={28} className="text-primary" />{t("develop.title")}<span className="text-2xl text-[#5a8a8a] underline decoration-[5px] decoration-[#6b9e9e]/30 underline-offset-1">{t("develop.titleEmphasis")}</span></h3>
              </div>
            </SlideIn>
            <div className="flex-shrink-0 w-0 h-0" />
            <div className="flex-1 min-w-[40px]" />
          </div>

          {/* Deliver — RIGHT */}
          <div className="relative z-10 mb-8 w-full flex items-center gap-5" data-node>
            <div className="flex-1 min-w-[40px]" />
            <div className="flex-shrink-0 w-0 h-0" />
            <SlideIn direction="right">
              <div className="text-left pl-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-1.5"><Rocket size={28} className="text-primary" />{t("deliver.title")}<span className="text-2xl text-[#5a8a8a] underline decoration-[5px] decoration-[#6b9e9e]/30 underline-offset-1">{t("deliver.titleEmphasis")}</span></h3>
              </div>
            </SlideIn>
          </div>

          {/* Goal flag */}
          <div className="relative z-10 mt-32 flex justify-center" data-node>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <Flag size={48} className="text-primary" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
