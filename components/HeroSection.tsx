"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface HeroSectionProps {
  heroLine1: string;
  heroLine2: string;
  solutionTitle: string;
  solutionSubtitle: string;
  casestudySlot: React.ReactNode;
  blogSlot: React.ReactNode;
}

type Phase = "typing1" | "hold1" | "fade1" | "typing2" | "hold2" | "fade2" | "solution";

export default function HeroSection({
  heroLine1,
  heroLine2,
  solutionTitle,
  solutionSubtitle,
  casestudySlot,
  blogSlot,
}: HeroSectionProps) {
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [phase, setPhase] = useState<Phase>("typing1");
  const [char1, setChar1] = useState(0);
  const [char2, setChar2] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showSolutionTitle, setShowSolutionTitle] = useState(false);
  const [showSolutionSub, setShowSolutionSub] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showDecor, setShowDecor] = useState(false);
  const skippedRef = useRef(false);

  // On mount: check sessionStorage and set initial state
  useEffect(() => {
    const seen = sessionStorage.getItem("hero-animation-seen") === "true";
    if (seen) {
      skippedRef.current = true;
      setSkipped(true);
      setPhase("solution");
      setChar1(heroLine1.length);
      setChar2(heroLine2.length);
      setShowSolution(true);
      setShowSolutionTitle(true);
      setShowSolutionSub(true);
      setShowCaseStudies(true);
      setShowBlog(true);
      setShowDecor(true);
    }
    setReady(true);
  }, [heroLine1, heroLine2]);

  const skipToEnd = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    setSkipped(true);
    sessionStorage.setItem("hero-animation-seen", "true");
    setPhase("solution");
    setChar1(heroLine1.length);
    setChar2(heroLine2.length);
    setShowSolution(true);
    setShowSolutionTitle(true);
    setShowSolutionSub(true);
    setShowCaseStudies(true);
    setShowBlog(true);
    setShowDecor(true);
  }, [heroLine1, heroLine2]);

  // Skip on scroll (with threshold)
  useEffect(() => {
    if (skippedRef.current) return;
    let active = false;
    const activateTimer = setTimeout(() => { active = true; }, 500);
    const handleScroll = () => {
      if (!active || window.scrollY < 30) return;
      skipToEnd();
      window.removeEventListener("scroll", handleScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(activateTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [skipToEnd]);

  // Main animation sequence
  useEffect(() => {
    if (!ready || skippedRef.current) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    let i = 0;
    const typeLine1 = () => {
      if (cancelled || skippedRef.current) return;
      if (i <= heroLine1.length) {
        setChar1(i);
        i++;
        const delay = heroLine1[i - 1] === "\n" ? 1200 : 80;
        timers.push(setTimeout(typeLine1, delay));
      } else {
        t(() => setPhase("hold1"), 0);
        t(() => setPhase("fade1"), 1200);
        t(() => {
          if (skippedRef.current) return;
          setPhase("typing2");
          let j = 0;
          const typeLine2 = () => {
            if (cancelled || skippedRef.current) return;
            if (j <= heroLine2.length) {
              setChar2(j);
              j++;
              timers.push(setTimeout(typeLine2, 80));
            } else {
              t(() => { if (!skippedRef.current) setPhase("hold2"); }, 0);
              t(() => { if (!skippedRef.current) setPhase("fade2"); }, 1000);
              t(() => {
                if (skippedRef.current) return;
                setPhase("solution");
                setShowSolution(true);
                sessionStorage.setItem("hero-animation-seen", "true");
                t(() => { if (!skippedRef.current) setShowSolutionTitle(true); }, 1000);
                t(() => { if (!skippedRef.current) setShowSolutionSub(true); }, 2000);
                t(() => { if (!skippedRef.current) setShowDecor(true); }, 2800);
                t(() => { if (!skippedRef.current) setShowCaseStudies(true); }, 3200);
                t(() => { if (!skippedRef.current) setShowBlog(true); }, 3600);
              }, 1500);
            }
          };
          typeLine2();
        }, 1800);
      }
    };

    typeLine1();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [ready, heroLine1, heroLine2]);

  const line1Visible = phase === "typing1" || phase === "hold1";
  const showLine2Phase = phase === "typing2" || phase === "hold2" || phase === "fade2";
  const showIdleCursor = phase === "hold1" || phase === "fade1";

  return (
    <>
      {/* Typewriter + Solution panel */}
      <div className="col-span-5 flex flex-col gap-2">
        <div className="relative rounded-3xl overflow-hidden min-h-[480px] lg:min-h-[540px]">
          <div className="relative z-10 h-full min-h-[480px] lg:min-h-[540px]">
            <div className="flex flex-col justify-start items-start h-full w-full p-10 relative">
              <p className="text-3xl lg:text-4xl xl:text-5xl font-medium text-foreground leading-relaxed whitespace-pre-line">
                <span
                  className="transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: line1Visible ? 1 : 0 }}
                >
                  {showLine2Phase ? heroLine1 : heroLine1.slice(0, char1)}
                </span>

                {(phase === "typing1" || showIdleCursor) && (
                  <span className="inline-block w-[3px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-middle" />
                )}

                {showLine2Phase && (
                  <span
                    className="transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: phase === "fade2" ? 0 : 1 }}
                  >
                    {heroLine2.slice(0, char2)}
                    {(phase === "typing2" || phase === "hold2") && (
                      <span className="inline-block w-[3px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-middle" />
                    )}
                  </span>
                )}
              </p>

              <div
                className="absolute inset-0 flex items-center justify-center p-10 transition-all ease-out"
                style={{
                  opacity: showSolution ? 1 : 0,
                  transform: showSolution ? "translateY(0)" : "translateY(24px)",
                  transitionDuration: "900ms",
                }}
              >
                <div className="relative rounded-3xl backdrop-blur-sm p-12 lg:p-16 w-full max-w-4xl overflow-hidden" style={{ backgroundColor: "#eaad63" }}>
                  {/* Decorative SVG overlay */}
                  <img
                    src="/photos/solution-decor-g.svg"
                    alt=""
                    aria-hidden="true"
                    className="absolute top-0 right-0 h-full w-auto pointer-events-none select-none transition-opacity duration-700 ease-in-out"
                    style={{ opacity: showDecor ? 1 : 0 }}
                  />
                  <div className="relative z-10">
                    <div
                      className="flex flex-col items-start -space-y-3 transition-opacity duration-700 ease-in-out"
                      style={{ opacity: showSolutionTitle ? 1 : 0 }}
                    >
                      {solutionTitle.replace("一歩」を", "一歩」を\n").split("\n").filter(Boolean).map((line, i) => (
                        <span
                          key={i}
                          className="inline-block bg-white text-foreground text-2xl lg:text-3xl xl:text-4xl font-bold rounded-xl px-5 py-2 shadow-sm"
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    <p
                      className="mt-6 text-base lg:text-lg xl:text-xl text-white font-medium leading-relaxed whitespace-pre-line transition-opacity duration-700 ease-in-out"
                      style={{ opacity: showSolutionSub ? 1 : 0 }}
                    >
                      {solutionSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side tiles — visibility controlled by state, not events */}
      <div className="col-span-2 flex flex-col gap-6 pt-[52px]">
        <div
          className="transition-opacity duration-700 ease-in-out flex-1 flex flex-col"
          style={{ opacity: showCaseStudies ? 1 : 0 }}
        >
          {casestudySlot}
        </div>
        <div
          className="transition-opacity duration-700 ease-in-out"
          style={{ opacity: showBlog ? 1 : 0 }}
        >
          {blogSlot}
        </div>
      </div>
    </>
  );
}
