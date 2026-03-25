"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface HeroTypewriterProps {
  heroLine1: string;
  heroLine2: string;
  solutionTitle: string;
  solutionSubtitle: string;
}

type Phase = "typing1" | "hold1" | "fade1" | "typing2" | "hold2" | "fade2" | "solution";

export default function HeroTypewriter({
  heroLine1,
  heroLine2,
  solutionTitle,
  solutionSubtitle,
}: HeroTypewriterProps) {
  const hasSeenAnimation = typeof window !== "undefined" && sessionStorage.getItem("hero-animation-seen") === "true";

  const [phase, setPhase] = useState<Phase>(hasSeenAnimation ? "solution" : "typing1");
  const [char1, setChar1] = useState(0);
  const [char2, setChar2] = useState(0);
  const [showSolution, setShowSolution] = useState(hasSeenAnimation);
  const [showSolutionTitle, setShowSolutionTitle] = useState(hasSeenAnimation);
  const [showSolutionSub, setShowSolutionSub] = useState(hasSeenAnimation);
  const skippedRef = useRef(hasSeenAnimation);

  const skipToEnd = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    sessionStorage.setItem("hero-animation-seen", "true");
    setPhase("solution");
    setChar1(heroLine1.length);
    setChar2(heroLine2.length);
    setShowSolution(true);
    setShowSolutionTitle(true);
    setShowSolutionSub(true);
    window.dispatchEvent(new Event("hero-casestudy-show"));
    window.dispatchEvent(new Event("hero-blog-show"));
    window.dispatchEvent(new Event("hero-solution-shown"));
  }, [heroLine1, heroLine2]);

  // Skip animation on scroll (with threshold to avoid accidental triggers)
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

  // Fire events for returning visitors (small delay so listeners are mounted)
  useEffect(() => {
    if (!hasSeenAnimation) return;
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("hero-casestudy-show"));
      window.dispatchEvent(new Event("hero-blog-show"));
      window.dispatchEvent(new Event("hero-solution-shown"));
    }, 100);
    return () => clearTimeout(timer);
  }, [hasSeenAnimation]);

  // Show case studies & blog ONLY after subtitle is visible + CSS fade completes
  useEffect(() => {
    if (!showSolutionSub || skippedRef.current || hasSeenAnimation) return;
    // Wait for the 700ms CSS fade-in to finish, then add buffer
    const t1 = setTimeout(() => {
      window.dispatchEvent(new Event("hero-casestudy-show"));
    }, 1500);
    const t2 = setTimeout(() => {
      window.dispatchEvent(new Event("hero-blog-show"));
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showSolutionSub, hasSeenAnimation]);

  useEffect(() => {
    if (skippedRef.current) return;

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
        t(() => setPhase("fade1"), 2200);
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
              t(() => {
                if (skippedRef.current) return;
                setPhase("hold2");
                window.dispatchEvent(new Event("hero-line2-done"));
              }, 0);
              t(() => { if (!skippedRef.current) setPhase("fade2"); }, 1200);
              t(() => {
                if (skippedRef.current) return;
                setPhase("solution");
                setShowSolution(true);
                sessionStorage.setItem("hero-animation-seen", "true");
                t(() => { if (!skippedRef.current) setShowSolutionTitle(true); }, 1200);
                t(() => { if (!skippedRef.current) setShowSolutionSub(true); }, 2550);
              }, 1800);
            }
          };
          typeLine2();
        }, 3000);
      }
    };

    typeLine1();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [heroLine1, heroLine2]);

  const line1Visible = phase === "typing1" || phase === "hold1";
  const showLine2Phase = phase === "typing2" || phase === "hold2" || phase === "fade2";
  const showIdleCursor = phase === "hold1" || phase === "fade1";

  return (
    <div className="flex flex-col justify-start items-start h-full w-full p-10 relative">
      <p className="text-3xl lg:text-4xl xl:text-5xl font-medium text-foreground leading-relaxed whitespace-pre-line">
        {/* Line 1: stays in flow, fades to transparent so line 2 continues after it */}
        <span
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity: line1Visible ? 1 : showLine2Phase ? 0 : 0 }}
        >
          {showLine2Phase ? heroLine1 : heroLine1.slice(0, char1)}
        </span>

        {/* Blinking cursor: shown during typing1, idle (fade1), and typing2 */}
        {(phase === "typing1" || showIdleCursor) && (
          <span className="inline-block w-[3px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-middle" />
        )}

        {/* Line 2: types right after line 1 */}
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

      {/* Solution — slides up to fill the block */}
      <div
        className="absolute inset-0 flex items-center justify-center p-10 transition-all ease-out"
        style={{
          opacity: showSolution ? 1 : 0,
          transform: showSolution ? "translateY(0)" : "translateY(24px)",
          transitionDuration: "900ms",
        }}
      >
        <div className="rounded-3xl backdrop-blur-sm p-12 lg:p-16 w-full max-w-4xl" style={{ backgroundColor: "#eaad63" }}>
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
  );
}
